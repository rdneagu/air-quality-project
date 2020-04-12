<template>
  <div class="map-wrapper-vue" v-tutorial="tutorial.first">
    <div class="map-wrapper" @mouseenter="showOverlay" @mouseleave="hideOverlay">
      <transition name="fade-io-quick" appear>
        <div v-show="!$store.getters.getMapState.initiating" class="map-model" ref="map" :style="polygonStrokeCSS"></div>
      </transition>
      <MapOverlay v-if="$store.getters.getMapOverlay && !$store.getters.getMapState.initiating" :func="map.func"></MapOverlay>
      <transition name="fade-io-quick" appear>
        <div v-if="$store.getters.getMapState.loading" class="map-loading" :class="[ getLoadingStatus ]">
          <div class="spinner">
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
          </div>
          <span class="message">{{ formatLoadingMessage }}</span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import axios from 'axios';
import {
  create as am4create,
  color as am4color,
  useTheme as am4useTheme,
  MouseCursorStyle as am4MouseCursorStyle,
} from '@amcharts/amcharts4/core';
import {
  MapChart as am4MapChart,
  projections as am4projections,
  MapPolygonSeries as am4MapPolygonSeries,
} from '@amcharts/amcharts4/maps';

import am4themesAnimated from '@amcharts/amcharts4/themes/animated';

import MapOverlay from '../components/MapOverlay/MapOverlay.component.vue';

am4useTheme(am4themesAnimated);

export default {
  components: {
    MapOverlay,
  },
  data() {
    return {
      tutorial: {
        first: {
          step: 1,
          text: 'It looks like you are new here... click next and let me introduce you to our functions',
          pos: 'bottom',
          button: 'Start',
          next: () => {
            this.$store.commit('setMapOverlay', true);
          },
        },
      },
      map: {
        model: undefined,
        // Functions that are passed to the overlay to control the map (need to be refactored)
        func: {
          viewHome: this.viewZoom.bind(null, 'home'),
          zoomReset: this.viewZoom.bind(null, 'reset'),
          zoomIn: this.viewZoom.bind(null, 'in'),
          zoomOut: this.viewZoom.bind(null, 'out'),
        },
        // Zoom configuration
        zoom: {
          min: 1,
          max: 200,
          threshold: 0,
          animation: undefined,
        },
        // amCharts4 map series
        series: {
          target: undefined,
          worldSeries: undefined,
          countrySeries: undefined,
        },
        stroke: '#01452c', // Required to override the region polygon strokes, changes everytime we change the filter
      },
    };
  },
  async mounted() {
    this.$store.commit('setMapState', { initiating: true, loading: true });
    await this.$nextTick();
    const worldSeriesResult = await axios.get('/map');
    console.log(worldSeriesResult);
    const map = am4create(this.$refs.map, am4MapChart);
    this.map.model = map;
    map.projection = new am4projections.Mercator();
    this.updateMinimumZoom();
    map.minZoomLevel = this.map.zoom.min;
    map.maxZoomLevel = this.map.zoom.max;
    // World Map
    const worldSeries = map.series.push(new am4MapPolygonSeries());
    this.configSeries(worldSeries);
    worldSeries.geodata = worldSeriesResult.data;
    const worldPolygon = worldSeries.mapPolygons.template;
    this.configPolygon(worldPolygon);
    worldPolygon.tooltipText = '{name}: ({aqi})';
    // Country
    const countrySeries = map.series.push(new am4MapPolygonSeries());
    this.configSeries(countrySeries);
    const countryPolygon = countrySeries.mapPolygons.template;
    this.configPolygon(countryPolygon);
    countryPolygon.tooltipText = '{name}: ({aqi})';
    // Event handler that triggers when the mousewheel is used
    map.events.on('wheeldown', () => {
      this.leaveCountry();
    });
    // Event handler that triggers when country is clicked
    worldPolygon.events.on('hit', (ev) => {
      this.enterCountry(ev.target);
    });
    // Save series in object variables
    this.map.series.worldSeries = worldSeries;
    this.map.series.countrySeries = countrySeries;

    worldSeries.events.on('datavalidated', async () => {
      this.$store.commit('setMapState', { retries: 0, timeout: 0 });
      const load = async () => {
        try {
          this.$store.commit('setMapState', { status: 'pending' });
          const promises = _.map(worldSeries.data, (r) => {
            const response = axios.get(`/realTime?latitude=${r.capital.geo[0]}&longitude=${r.capital.geo[1]}`);
            return response;
          });
          const aqifeed = await Promise.all(promises);
          const data = _.map(aqifeed, (country, id) => {
            const mapping = { id };
            if (country.data.status === 'ok') {
              return {
                ...mapping,
                name: this.map.series.worldSeries.data[id].name,
                code: this.map.series.worldSeries.data[id].id,
                aqi: { ...country.data.data.iaqi, smart: { v: country.data.data.aqi } },
                dominent: country.data.data.dominentpol,
              };
            }
            return mapping;
          });
          setTimeout(() => {
            this.$store.state.sidebar.visible = true;
            this.$store.commit('setMapOverlay', true);
          }, 500);
          this.$store.commit('setWorldData', { data });
          this.$store.commit('setMapState', { initiating: false, loading: false });
          this.updateAQIMinMax();
          this.showWorld();
        } catch (e) {
          const retries = (this.$store.getters.getMapState.retries || 0) + 1;
          const timeout = (this.$store.getters.getMapState.timeout || 5000) * 2;
          this.$store.commit('setMapState', { retries, timeout, status: 'failed' });
          setTimeout(async () => { await load(); }, timeout);
        }
      };
      await load();
    });
  },
  beforeDestroy() {
    if (this.map.model) { this.map.model.dispose(); }
  },
  computed: {
    getAQIColorCSS() {
      return this.$store.getters.getAQIColor(this.$store.getters.getCurrentAQI);
    },
    polygonStrokeCSS() {
      return { '--stroke': this.map.stroke };
    },
    getLoadingStatus() {
      return this.$store.getters.getMapState.status;
    },
    formatLoadingMessage() {
      const { retries, timeout, status } = this.$store.getters.getMapState;
      let message = 'Loading...';
      if (status === 'pending' && retries) {
        message = 'Retrying...';
      } else if (status === 'failed' && retries) {
        message = `Failed ${retries} time${retries !== 1 ? 's' : ''}. Retrying again in ${timeout / 1000} seconds`;
      } else if (status === 'failed' && !retries) {
        message = 'Failed. Returning back in 10 seconds';
      }
      return message;
    },
  },
  methods: {
    updateActiveAQI() {
      const dominentCount = {};
      const list = _.chain(this.$store.getters.getActiveData)
        .reduce((acc, country) => {
          dominentCount[country.dominent] = (dominentCount[country.dominent] || 0) + 1;
          acc = { ...acc || {}, ...country.aqi };
          return acc;
        }, {})
        .keys()
        .reject((aqi) => aqi === 'smart' || !this.$store.getters.getAQIKeys[aqi])
        .value();
      if (list.indexOf(this.$store.getters.getCurrentAQI) === -1) {
        this.$store.commit('setSelected', { id: 'filter', item: 'smart' });
      }
      this.$store.commit('setActiveAQI', { list });
      const dominentAQI = _(dominentCount)
        .map((count, aqi) => ({ aqi, count }))
        .sortBy('count')
        .last();
      this.$store.commit('setDominentAQI', { aqi: dominentAQI.aqi });
    },
    updateAQIMinMax() {
      _.forEach(this.$store.getters.getAQIKeys, (data, aqi) => {
        const aqiNumbers = _.map(this.$store.getters.getWorldData, (country) => ((country.aqi && country.aqi[aqi]) ? country.aqi[aqi].v : 0));
        const [min, max] = [_.min(aqiNumbers), _.max(aqiNumbers)];
        this.$store.commit('setAQIMinMax', { aqi, min, max });
      });
    },
    updateAQIHeatMap() {
      const aqi = this.$store.getters.getCurrentAQI;
      const aqiColor = this.$store.getters.getAQIColor(aqi);
      this.map.series.target.mapPolygons.template.stroke = am4color(aqiColor).lighten(-0.5);
      this.map.stroke = (am4color(aqiColor).lighten(0.5)).rgba;
      _.forEach(this.$store.getters.getActiveData, (country, id) => {
        let tooltip = 'No data recorded for this Air Quality Index';
        this.map.series.target.dataItems.values[id].mapPolygon.fill = am4color('rgba(0, 0, 0, 1)');
        if (country.aqi && (country.aqi[aqi] && !_.isNaN(country.aqi[aqi].aqi))) {
          this.map.series.target.dataItems.values[id].mapPolygon.fill = am4color(this.$store.getters.getAQIHeatColor(aqi, country.aqi[aqi].v));
          tooltip = `${aqi}: ${country.aqi[aqi].v.toFixed(1)} μ/mg`;
        }
        this.map.series.target.data[id].aqi = tooltip;
      });
    },
    /**
     * Default configuration for map series
     */
    configSeries(series) {
      series.useGeodata = true;
      series.tooltip.background.fill = am4color('#01120b');
      series.tooltip.background.stroke = am4color('#357a24');
      series.tooltip.background.strokeWidth = 1;
      series.tooltip.label.fill = am4color('#357a24');
      series.tooltip.getFillFromObject = false;
      series.tooltip.autoTextColor = false;
    },
    /**
     * Default configuration for polygon series
     */
    configPolygon(polygon) {
      polygon.tooltipText = '{name}';
      polygon.nonScalingStroke = true;
      polygon.strokeOpacity = 0.8;
      polygon.strokeWidth = 0.4;
      polygon.fill = am4color('#000000');
      polygon.stroke = am4color('#01452c');
      polygon.propertyFields.fill = 'color';
      polygon.cursorOverStyle = am4MouseCursorStyle.pointer;
      polygon.events.on('over', (evt) => {
        const id = _.findIndex(evt.target.series.mapPolygons.values, (p) => p.uid === evt.target.uid);
        this.$store.commit('setMouseoverRegion', { id });
      });
      polygon.events.on('out', (evt) => {
        const id = _.findIndex(evt.target.series.mapPolygons.values, (p) => p.uid === evt.target.uid);
        if (id !== this.$store.getters.getMouseoverRegion) return;
        this.$store.commit('setMouseoverRegion', { id: undefined });
      });
    },
    /**
     * Shows the overlay
     */
    showOverlay() {
      this.$store.commit('setMapOverlay', true);
    },
    /**
     * Hides the overlay
     */
    hideOverlay() {
      this.$store.commit('setMapOverlay', false);
    },
    /**
     * Updates the minimum zoom allowed based on a document width ratio
     */
    updateMinimumZoom() {
      const ratio = window.innerWidth / 1920;
      this.map.zoom.min = _.clamp(2 * ratio, 1, Number.POSITIVE_INFINITY);
    },
    /**
     * Shows the country series and hides the world series
     */
    showCountry() {
      this.map.series.worldSeries.hide();
      this.map.series.countrySeries.show();
      this.updateActiveAQI();
      this.updateAQIHeatMap();
    },
    /**
     * Shows the world series and hides the country series
     */
    showWorld() {
      // Cancel the country zoom-in animation if user clicked on a country before
      this.cancelCountry();
      this.map.series.worldSeries.show();
      this.map.series.countrySeries.hide();
      this.map.series.target = this.map.series.worldSeries;
      this.$store.commit('setActiveData', { data: this.$store.getters.getWorldData });
      this.updateActiveAQI();
      this.updateAQIHeatMap();
    },
    /**
     * Zoom in to a specific country polygon and load the regions
     */
    enterCountry(target) {
      // Zoom in the clicked region and display the inner regions when the animation finishes
      this.$store.commit('setMapState', { loading: true, retries: 0, timeout: 0, status: 'pending' });
      this.map.zoom.animation = target.series.chart.zoomToMapObject(target);
      this.map.zoom.animation.events.once('animationended', async () => {
        const code = target.dataItem.dataContext.id;
        if (code) {
          target.isHover = false;
          // Set map zoom threshold to act as a portal back to world on zooming out beyond the threshold
          this.map.zoom.threshold = target.series.chart.zoomLevel;
          // If country is not cached, request data from the server and cache it for later use
          if (!this.$store.getters.getCache(`country_${code}`)) {
            const response = await axios.get(`/countryMap?countryCode=${code}`);
            this.$store.commit('setCache', { name: `country_${code}`, data: response.data });
          }
          // Set the series geodata and show the country series
          this.map.series.countrySeries.geodata = { ...this.$store.getters.getCache(`country_${code}`).data };
          this.map.series.countrySeries.events.once('datavalidated', async () => {
            if (!this.$store.getters.getCountryData(code)) {
              try {
                const promises = _.map(this.map.series.countrySeries.mapPolygons.values, (cityPolygon) => {
                  const response = axios.get(`/realTime?latitude=${cityPolygon.latitude}&longitude=${cityPolygon.longitude}`);
                  return response;
                });
                const aqifeed = await Promise.all(promises);
                const data = _.map(aqifeed, (city, id) => {
                  const mapping = { id };
                  if (city.data.status === 'ok') {
                    return {
                      ...mapping,
                      name: this.map.series.countrySeries.data[id].name,
                      code,
                      aqi: { ...city.data.data.iaqi, smart: { v: city.data.data.aqi } },
                      dominent: city.data.data.dominentpol,
                    };
                  }
                  return mapping;
                });
                this.$store.commit('setCountryData', { country: code, data });
              } catch (e) {
                this.$store.commit('setMapState', { status: 'failed' });
                setTimeout(this.viewZoom.bind(this, 'reset'), 10000);
              }
            }
            if (this.$store.getters.getCountryData(code)) {
              this.$store.commit('setActiveData', { data: this.$store.getters.getCountryData(code) });
              this.$set(this.map.series, 'target', this.map.series.countrySeries);
              this.map.zoom.animation = undefined;
              this.$store.commit('setMapState', { loading: false });
              this.showCountry();
            }
          });
        }
      });
    },
    /**
     * Cancels the country zoom-in animation
     */
    cancelCountry() {
      if (this.map.zoom.animation) {
        this.$store.commit('setMapState', { loading: false });
        this.map.zoom.animation.kill();
        this.map.zoom.animation = undefined;
      }
    },
    /**
     * Returns back to world
     */
    leaveCountry() {
      // If the zoom level is lower or equal than the minimum country zoom threshold
      if (this.map.model.zoomLevel - 0.1 <= this.map.zoom.threshold) {
        // Reset the threshold and show the world
        this.map.zoom.threshold = 0;
        this.showWorld();
      }
    },
    getPermission() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve,
          () => {
            alert('Geolocation permission is denied\n\nPlease check your site permissions and try again!'); // eslint-disable-line no-alert
            reject(new Error('Geolocation permission denied'));
          });
      });
    },
    /**
     * Handles different view functions
     */
    async viewZoom(zoom) {
      const mapModel = this.map.model;
      switch (zoom) {
        // Point the map to home based on IP Geolocation
        case 'home':
          this.showWorld();
          try {
            await this.getPermission();
            const geolocation = await axios.get('https://freegeoip.app/json/');
            const poly = this.map.series.worldSeries.dataItems.values.find((c) => c.dataContext.name === geolocation.data.region_name);
            if (!poly) {
              alert('Geolocation failed\n\nYour location is probably not supported at the moment!'); // eslint-disable-line no-alert
              throw 'Geolocation failed';
            }
            this.enterCountry(poly.mapPolygon);
          } catch (e) {
            this.viewZoom('reset');
          }
          break;
        // Point the map to center and fully zoom out
        case 'reset':
          this.showWorld();
          this.updateMinimumZoom();
          mapModel.zoomToGeoPoint(mapModel.centerGeoPoint, this.map.zoom.min, true);
          break;
        // Zoom in
        case 'in':
          this.cancelCountry();
          mapModel.zoomIn();
          break;
        // Zoom out
        case 'out':
          this.cancelCountry();
          mapModel.zoomOut().events.on('animationprogress', this.leaveCountry);
          break;
        default:
          break;
      }
    },
  },
  watch: {
    '$store.state.selected.filter': async function filterChanged(to, from) {
      if (to !== undefined && to !== from) {
        this.updateAQIHeatMap();
      }
    },
  },
};
</script>

<style lang="scss">
@import '~@/scss/_mixins';

.map-wrapper-vue {
  position: relative;
  display: flex;
}
.map-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  border-bottom: 1px solid $map-stroke-color;
  background-color: #000;
  overflow: hidden;
  .map-model {
    flex: 1;
  }
  .map-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at center, rgba(#000, 0.8) 0%, transparent 200%);
    .spinner {
      display: flex;
      .bar {
        width: 20px;
        height: 20px;
        background-color: transparent;
        border: 4px solid $map-stroke-color;
        animation: loading 1.5s ease infinite;
        margin: 0 5px;
        &:nth-child(1) { animation-delay: -1.0s }
        &:nth-child(2) { animation-delay: -0.5s }
        &:nth-child(3) { animation-delay: 0.0s }
      }
    }
    .message {
      margin-top: 10px;
      font-size: 16px;
      font-weight: 700;
    }
    &.failed {
      .bar {
        border-color: darken($color-error, 20%);
        animation-name: loadingError;
      }
      .message { color: $color-error; }
    }
  }
  svg g g g g g g g g g g g {
    stroke: var(--stroke) !important;
  }
}

@keyframes loading {
  0% { background-color: transparent; }
  25% { background-color: $color-text; }
  50%, 100% { background-color: transparent; }
}
@keyframes loadingError {
  0% { background-color: transparent; }
  25% { background-color: $color-error; }
  50%, 100% { background-color: transparent; }
}
</style>
