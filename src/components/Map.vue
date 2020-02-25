<template>
  <div class="map-wrapper" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
    <div class="map-model" ref="map"></div>
    <MapOverlay v-if="mapOverlay" :func="map.func"></MapOverlay>
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
          threshold: -1,
          animation: undefined,
        },
        series: {
          worldSeries: undefined,
          countrySeries: undefined,
        },
        state: {
          isCountryHit: false,
        },
      },
      mapOverlay: false,
      countries: {},
    };
  },
  async mounted() {
    const worldSeriesResult = await axios.post('/api/getWorld');
    this.$nextTick(() => {
      const map = am4core.create(this.$refs.map, am4maps.MapChart);
      this.map.model = map;
      map.projection = new am4maps.projections.Mercator();
      map.background.fillOpacity = 1;
      map.background.fill = am4core.color('#01120b');
      map.deltaLongitude = -12;

      map.events.on('ready', () => {
        this.showWorld();
      });
      /* Zoom Levels */
      this.updateZoomRatio();
      map.minZoomLevel = this.map.zoom.min;
      map.maxZoomLevel = this.map.zoom.max;
      /* World Map */
      const worldSeries = map.series.push(new am4maps.MapPolygonSeries());
      worldSeries.useGeodata = true;
      worldSeries.geodata = worldSeriesResult.data;
      // worldSeries.exclude = ["AQ"];
      const worldPolygon = worldSeries.mapPolygons.template;
      worldPolygon.tooltipText = '{name}';
      worldPolygon.nonScalingStroke = false;
      // worldPolygon.strokeOpacity = 0.5;
      worldPolygon.fill = am4core.color('#000000');
      worldPolygon.stroke = am4core.color('#013220');
      worldPolygon.propertyFields.fill = 'color';
      worldPolygon.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      const hsWorld = worldPolygon.states.create('hover');
      hsWorld.properties.fill = am4core.color('#367B25');
      /* Country */
      const countrySeries = map.series.push(new am4maps.MapPolygonSeries());
      countrySeries.useGeodata = true;
      const countryPolygon = countrySeries.mapPolygons.template;
      countryPolygon.tooltipText = '{name}';
      countryPolygon.nonScalingStroke = false;
      // countryPolygon.strokeOpacity = 0.5;
      countryPolygon.fill = am4core.color('#000000');
      countryPolygon.stroke = am4core.color('#013220');
      countryPolygon.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      const hsCountry = countryPolygon.states.create('hover');
      hsCountry.properties.fill = am4core.color('#367B25');
      map.events.on('wheeldown', () => {
        this.leaveCountry();
      });
      worldPolygon.events.on('hit', (ev) => {
        this.enterCountry(ev.target);
      });
      this.map.series.worldSeries = worldSeries;
      this.map.series.countrySeries = countrySeries;
    });
  },
  methods: {
    mouseEnter() {
      this.mapOverlay = true;
    },
    mouseLeave() {
      this.mapOverlay = false;
    },
    updateZoomRatio() {
      const ratio = this.$refs.map.clientWidth / 1920;
      this.map.zoom.min = _.clamp(2 * ratio, 1, Number.POSITIVE_INFINITY);
    },
    showCountry() {
      this.map.series.worldSeries.hide();
      this.map.series.countrySeries.show();
    },
    showWorld() {
      // Stop the zoom to country animation if it is running
      if (this.map.zoom.animation) {
        this.map.zoom.animation.stop(true);
        this.map.zoom.animation.dispose();
        this.map.zoom.animation = undefined;
      }
      this.map.series.worldSeries.show();
      this.map.series.countrySeries.hide();
    },
    leaveCountry() {
      // If country is visible and the zoom level is lower or equal than the minimum country zoom threshold
      if (this.map.zoom.animation && this.map.model.zoomLevel <= this.map.zoom.threshold) {
        // Reset the threshold and show the world
        this.map.zoom.threshold = -1;
        this.showWorld();
      }
    },
    enterCountry(target) {
      this.map.zoom.animation = target.series.chart.zoomToMapObject(target);
      this.map.zoom.animation.events.on('animationended', async () => {
        const { id } = target.dataItem.dataContext;
        if (id) {
          this.map.zoom.threshold = target.series.chart.zoomLevel;
          target.isHover = false; // eslint-disable-line no-param-reassign
          if (this.countries[id] === undefined) {
            const countrySeriesResult = await axios.post('/api/getCountry', { country: id });
            this.countries[id] = { geodata: countrySeriesResult.data };
          }
          this.map.series.countrySeries.geodata = this.countries[id].geodata;
          this.showCountry();
        }
      });
    },
    viewZoom(zoom) {
      const mapModel = this.map.model;
      let { longitude, latitude } = mapModel.centerGeoPoint;
      let zoomAnimation;
      switch (zoom) {
        case 'home':
          this.showWorld();
          navigator.geolocation.getCurrentPosition((pos) => {
            latitude = pos.coords.latitude;
            longitude = pos.coords.longitude;
            mapModel.zoomToGeoPoint({ latitude, longitude }, 10, true);
          }, () => {
            this.viewZoom('reset');
          });
          break;
        case 'reset':
          this.showWorld();
          this.updateZoomRatio();
          latitude = mapModel.centerGeoPoint.latitude;
          longitude = mapModel.centerGeoPoint.longitude;
          mapModel.zoomToGeoPoint({ latitude, longitude }, this.map.zoom.min, true);
          break;
        case 'in':
          mapModel.zoomIn();
          break;
        case 'out':
          zoomAnimation = mapModel.zoomOut();
          zoomAnimation.events.on('animationended', this.leaveCountry);
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
  .map-model {
    width: inherit;
    height: inherit;
  }
}
</style>
