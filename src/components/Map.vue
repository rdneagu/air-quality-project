<template>
  <div class="map-wrapper" @mouseenter="showOverlay" @mouseleave="hideOverlay">
    <transition name="fade-io-quick" appear>
      <div v-show="!map.state.initiating" class="map-model" ref="map" :style="polygonStrokeCSS"></div>
    </transition>
    <MapOverlay v-if="mapOverlay && !map.state.initiating" :func="map.func"></MapOverlay>
    <transition name="fade-io-quick" appear>
      <div v-if="map.state.loading" class="map-loading">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
    </transition>
  </div>
</template>

<script>
import _ from 'lodash';
import axios from 'axios';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';

import MapOverlay from './MapOverlay.vue';

am4core.useTheme(am4themesAnimated);

export default {
  components: {
    MapOverlay,
  },
  data() {
    return {
      map: {
        model: undefined,
        func: {
          viewHome: this.viewZoom.bind(null, 'home'),
          zoomReset: this.viewZoom.bind(null, 'reset'),
          zoomIn: this.viewZoom.bind(null, 'in'),
          zoomOut: this.viewZoom.bind(null, 'out'),
        },
        zoom: {
          min: 1,
          max: 200,
          threshold: 0,
          animation: undefined,
        },
        series: {
          target: undefined,
          worldSeries: undefined,
          countrySeries: undefined,
        },
        aq: {
          list: {},
        },
        data: {
          target: undefined,
          world: [],
          country: {},
        },
        state: {
          initiating: true,
          loading: true,
        },
        stroke: '#01452c',
      },
      mapOverlay: false,
    };
  },
  async mounted() {
    await this.$nextTick();

    const worldSeriesResult = await axios.get('http://codegod.xyz:8090/map');
    // const worldSeriesResult = await axios.get('/api/getWorld');
    const map = am4core.create(this.$refs.map, am4maps.MapChart);
    this.map.model = map;
    map.projection = new am4maps.projections.Mercator();
    this.updateMinimumZoom();
    map.minZoomLevel = this.map.zoom.min;
    map.maxZoomLevel = this.map.zoom.max;
    // World Map
    const worldSeries = map.series.push(new am4maps.MapPolygonSeries());
    this.configSeries(worldSeries);
    worldSeries.geodata = worldSeriesResult.data;
    const worldPolygon = worldSeries.mapPolygons.template;
    this.configPolygon(worldPolygon);
    worldPolygon.tooltipText = '{name}: ({aqi})';
    // Country
    const countrySeries = map.series.push(new am4maps.MapPolygonSeries());
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
      try {
        const promises = _.map(worldSeries.data, (r) => {
          const response = axios.get(`https://api.waqi.info/feed/geo:${r.capital.geo[0]};${r.capital.geo[1]}/?token=d3b80dc36410993d538776db2c79b3083ad14edf`);
          // const response = axios.get(`http://codegod.xyz:8090/realTime?latitude=${r.capital.geo[0]}&longitude=${r.capital.geo[1]}`);
          return response;
        });
        const aqifeed = await Promise.all(promises);
        this.$set(this.map.data, 'world', _.map(aqifeed, (country, id) => {
          const mapping = { id };
          if (country.data.status === 'ok') {
            return {
              ...mapping,
              aqi: { ...country.data.data.iaqi, smart: { v: country.data.data.aqi } },
              dominent: country.data.data.dominentpol,
            };
          }
          return mapping;
        }));
        this.map.state.initiating = false;
        this.map.state.loading = false;
        this.showWorld();
      } catch (e) {
        console.error(e);
      }
    });
  },
  computed: {
    polygonStrokeCSS() {
      return { '--stroke': this.map.stroke };
    },
  },
  methods: {
    updateAQIList() {
      const aqiList = _.reduce(this.map.data.target, (acc, country) => {
        acc = { ...acc || {}, ...country.aqi };
        return acc;
      }, {});
      delete aqiList.smart;
      this.$store.state.map.aqis = aqiList;
    },
    updateHeatMap() {
      const filter = this.$store.getters.getSelected('filter') || 'smart';
      const aqiNumbers = _.map(this.map.data.target, (country) => ((country.aqi && filter in country.aqi) ? country.aqi[filter].v : 0));
      const [min, max] = [_.min(aqiNumbers), _.max(aqiNumbers)];
      console.log(`min -> ${min}`);
      console.log(`max -> ${max}`);
      this.map.series.target.mapPolygons.template.stroke = am4core.color(this.$store.getters.getAQIColor(filter)).lighten(-0.5);
      this.map.stroke = (am4core.color(this.$store.getters.getAQIColor(filter)).lighten(0.5)).rgba;
      _.forEach(this.map.data.target, (country, id) => {
        let tooltip = 'No data recorded for this Air Quality Index';
        this.map.series.target.dataItems.values[id].mapPolygon.fill = am4core.color('rgba(0, 0, 0, 1)');
        if (country.aqi && filter in country.aqi) {
          this.map.series.target.dataItems.values[id].mapPolygon.fill = am4core.color(this.$store.getters.getAQIHeatColor(country.aqi[filter].v, min, max));
          tooltip = `${filter}: ${country.aqi[filter].v} μ/mg`;
        }
        this.map.series.target.data[id].aqi = tooltip;
      });
    },
    /**
     * Default configuration for series
     */
    configSeries(series) {
      series.useGeodata = true;
      series.tooltip.background.fill = am4core.color('#01120b');
      series.tooltip.background.stroke = am4core.color('#357a24');
      series.tooltip.background.strokeWidth = 1;
      series.tooltip.label.fill = am4core.color('#357a24');
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
      polygon.fill = am4core.color('#000000');
      polygon.stroke = am4core.color('#01452c');
      polygon.propertyFields.fill = 'color';
      polygon.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    },
    /**
     * Shows the overlay
     */
    showOverlay() {
      this.mapOverlay = true;
    },
    /**
     * Hides the overlay
     */
    hideOverlay() {
      this.mapOverlay = false;
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
      this.updateHeatMap();
    },
    /**
     * Shows the world series and hides the country series
     */
    showWorld() {
      // Cancel the country zoom-in animation if user clicked on a country before
      this.cancelCountry();
      this.map.series.worldSeries.show();
      this.map.series.countrySeries.hide();
      this.map.data.target = this.map.data.world;
      this.map.series.target = this.map.series.worldSeries;
      this.updateAQIList();
      this.updateHeatMap();
    },
    /**
     * Zoom in to a specific country polygon and load the regions
     */
    enterCountry(target) {
      // Zoom in the clicked region and display the inner regions when the animation finishes
      this.map.state.loading = true;
      this.map.zoom.animation = target.series.chart.zoomToMapObject(target);
      this.map.zoom.animation.events.once('animationended', async () => {
        const code = target.dataItem.dataContext.id;
        if (code) {
          target.isHover = false;
          // Set map zoom threshold to act as a portal back to world on zooming out beyond the threshold
          this.map.zoom.threshold = target.series.chart.zoomLevel;
          // If country is not cached, request data from the server and cache it for later use
          if (!this.$store.getters.getCache(`country_${code}`)) {
            const response = await axios.get(`http://codegod.xyz:8090/countryMap?countryCode=${code}`);
            // const response = await axios.get(`/api/getCountry?country=${code}`);
            this.$store.commit('setCache', { name: `country_${code}`, data: response.data });
          }
          // Set the series geodata and show the country series
          this.map.series.countrySeries.geodata = { ...this.$store.getters.getCache(`country_${code}`).data };
          this.map.series.countrySeries.events.once('datavalidated', async () => {
            if (!this.map.data.country[code]) {
              try {
                const promises = _.map(this.map.series.countrySeries.mapPolygons.values, (cityPolygon) => {
                  const response = axios.get(`https://api.waqi.info/feed/geo:${cityPolygon.latitude};${cityPolygon.longitude}/?token=d3b80dc36410993d538776db2c79b3083ad14edf`);
                  return response;
                });
                const aqifeed = await Promise.all(promises);
                this.$set(this.map.data.country, code, _.map(aqifeed, (city, id) => {
                  const mapping = { id };
                  if (city.data.status === 'ok') {
                    return {
                      ...mapping,
                      aqi: { ...city.data.data.iaqi, smart: { v: city.data.data.aqi } },
                      dominent: city.data.data.dominentpol,
                    };
                  }
                  return mapping;
                }));
              } catch (e) {
                console.error(e);
              }
            }
            this.$store.commit('setSelected', { id: 'filter', item: 'smart' });
            this.$set(this.map.data, 'target', this.map.data.country[code]);
            this.$set(this.map.series, 'target', this.map.series.countrySeries);
            this.map.zoom.animation = undefined;
            this.map.state.loading = false;
            this.updateAQIList();
            this.updateHeatMap();
            this.showCountry();
          });
        }
      });
    },
    /**
     * Cancels the country zoom-in animation
     */
    cancelCountry() {
      if (this.map.zoom.animation) {
        this.map.state.loading = false;
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
            const geolocation = await axios.get('https://freegeoip.app/json/');
            const poly = this.map.series.worldSeries.dataItems.values.find((c) => c.dataContext.name === geolocation.data.region_name);
            this.enterCountry(poly.mapPolygon);
          } catch (e) {
            console.log(e);
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
        this.updateHeatMap();
      }
    },
  },
};
</script>

<style lang="scss">
@import '../scss/variables';

.map-wrapper {
  position: relative;
  display: flex;
  border-top: 1px solid $map-stroke-color;
  border-bottom: 1px solid $map-stroke-color;
  background-color: $map-bg-color;
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
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at center, rgba(#000, 0.8) 0%, transparent 200%);

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
  svg g g g g g g g g g g g {
    stroke: var(--stroke) !important;
  }
}

@keyframes loading {
  0% {
    background-color: transparent;
  }
  25% {
    background-color: $map-fill-color;
  }
  50%, 100% {
    background-color: transparent;
  }
}
</style>
