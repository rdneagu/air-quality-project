<template>
  <div class="map-wrapper" @mouseenter="showOverlay" @mouseleave="hideOverlay">
    <transition name="fade-io-quick" appear>
      <div v-show="!map.state.initiating" class="map-model" ref="map"></div>
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

const aqiColors = [
  { aqi: 0, color: { r: 0x00, g: 0xaa, b: 0xff } },
  { aqi: 25, color: { r: 0x00, g: 0xff, b: 0x00 } },
  { aqi: 50, color: { r: 0xff, g: 0xff, b: 0x00 } },
  { aqi: 100, color: { r: 0xff, g: 0x7f, b: 0x00 } },
  { aqi: 150, color: { r: 0xff, g: 0x00, b: 0x00 } },
  { aqi: 300, color: { r: 0x80, g: 0x00, b: 0x80 } },
  { aqi: 1000, color: { r: 0x8b, g: 0x00, b: 0x00 } },
];

function getColorForAQI(aqi, alpha) {
  let i;
  for (i = 1; i < aqiColors.length - 1; i += 1) {
    if (aqi < aqiColors[i].aqi) {
      break;
    }
  }
  const lower = aqiColors[i - 1];
  const upper = aqiColors[i];
  const range = upper.aqi - lower.aqi;
  const rangeAqi = (aqi - lower.aqi) / range;
  const aqiLower = 1 - rangeAqi;
  const aqiUpper = rangeAqi;
  const color = {
    r: Math.floor(lower.color.r * aqiLower + upper.color.r * aqiUpper),
    g: Math.floor(lower.color.g * aqiLower + upper.color.g * aqiUpper),
    b: Math.floor(lower.color.b * aqiLower + upper.color.b * aqiUpper),
  };
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}

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
          worldSeries: undefined,
          countrySeries: undefined,
          imageSeries: undefined,
        },
        state: {
          initiating: true,
          loading: true,
        },
      },
      mapOverlay: false,
      countries: {},
    };
  },
  mounted() {
    this.$nextTick(async () => {
      const worldSeriesResult = await axios.post('/api/getWorld');
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
        const chunks = _.chunk(worldSeries.data, 20);
        console.log(chunks);
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < chunks.length; i++) {
          const promisesChunks = [];
          // eslint-disable-next-line no-plusplus
          for (let j = 0; j < chunks[i].length; j++) {
            console.log(j);
            promisesChunks.push(axios.get(`https://pollution-backend.herokuapp.com/statsCountry?country=${chunks[i][j].id}`));
          }
          // eslint-disable-next-line no-await-in-loop
          const feed = await Promise.all(promisesChunks);
          console.log(feed);
        }
        getColorForAQI(5);
        // const promises = _.forEach(chunks, (chunk) => {
        //   _.forEach(chunk)
        //   // const response = axios.get(`https://api.waqi.info/feed/${r.capital.name}/?token=8701730daa0d71aa3377b66c7bbc1280e7c909f5`);
        //   const response = axios.get(`https://pollution-backend.herokuapp.com/statsCountry?country=${r.id}`);
        //   return response;
        // });
        // const aqifeed = await Promise.all(promises);
        // _.forEach(aqifeed, (aqi, id) => {
        //   console.log(aqi);
        //   if (aqi.status !== 500) {
        //     console.log(console.log(aqi));
        //     worldSeries.dataItems.values[id].mapPolygon.fill = am4core.color(getColorForAQI(50, 1)).lighten(-0.5);
        //     // worldSeries.data[id].aqi = aqi.data.data.aqi;
        //   } else {
        //     worldSeries.data[id].aqi = 'No data recorded nearby';
        //   }
        // });
        this.map.state.initiating = false;
        this.map.state.loading = false;
        this.showWorld();
      });
    });
  },
  methods: {
    /**
     * Default configuration for series
     */
    configSeries(series) {
      series.useGeodata = true;
      series.tooltip.background.fill = am4core.color('#01120b');
      series.tooltip.background.stroke = am4core.color('#5bc640');
      series.tooltip.background.strokeWidth = 1;
      series.tooltip.label.fill = am4core.color('#5bc640');
      series.tooltip.getFillFromObject = false;
      series.tooltip.autoTextColor = false;
    },
    /**
     * Default configuration for polygon series
     */
    configPolygon(polygon) {
      polygon.tooltipText = '{name}';
      polygon.nonScalingStroke = false;
      polygon.strokeOpacity = 0.8;
      polygon.fill = am4core.color('#000000');
      polygon.stroke = am4core.color('#013220');
      polygon.propertyFields.fill = 'color';
      polygon.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      const hsPolygon = polygon.states.create('hover');
      hsPolygon.properties.fill = am4core.color('#367B25');
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
    },
    /**
     * Shows the world series and hides the country series
     */
    showWorld() {
      // Cancel the country zoom-in animation if user clicked on a country before
      this.cancelCountry();
      this.map.series.worldSeries.show();
      this.map.series.countrySeries.hide();
    },
    /**
     * Zoom in to a specific country polygon and load the regions
     */
    enterCountry(target) {
      // Zoom in the clicked region and display the inner regions when the animation finishes
      this.map.state.loading = true;
      this.map.zoom.animation = target.series.chart.zoomToMapObject(target);
      this.map.zoom.animation.events.once('animationended', async () => {
        const { id } = target.dataItem.dataContext;
        if (id) {
          target.isHover = false;
          // Set map zoom threshold to act as a portal back to world on zooming out beyond the threshold
          this.map.zoom.threshold = target.series.chart.zoomLevel;
          // If country is not cached, request data from the server and cache it for later use
          if (this.countries[id] === undefined) {
            const countrySeriesResult = await axios.post('/api/getCountry', { country: id });
            this.countries[id] = { geodata: countrySeriesResult.data };
          }
          // Set the series geodata and show the country series
          this.map.series.countrySeries.geodata = this.countries[id].geodata;
          this.map.zoom.animation = undefined;
          this.map.state.loading = false;
          this.showCountry();
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
};
</script>

<style lang="scss">
@import '../scss/variables';

.map-wrapper {
  position: relative;
  display: flex;
  width: 100%;
  height: 700px;
  border: 1px solid $map-stroke-color;
  background-color: $map-bg-color;
  overflow: hidden;
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
  .map-model {
    width: inherit;
    height: inherit;
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
