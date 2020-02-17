<template>
  <div class="home">
    <div class="map" ref="map"></div>
  </div>
</template>

<script>
import _ from 'lodash';
import axios from 'axios';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themesAnimated);

export default {
  data() {
    return {
      map: undefined,
      countries: {},
      zoomThreshold: -1,
    };
  },
  async mounted() {
    const worldSeriesResult = await axios.post('/api/getWorld');
    this.$nextTick(() => {
      const map = am4core.create(this.$refs.map, am4maps.MapChart);
      map.projection = new am4maps.projections.Mercator();
      map.background.fillOpacity = 1;
      map.background.fill = am4core.color('#01120b');
      map.deltaLongitude = -12;
      /* Zoom Levels */
      const ratio = this.$refs.map.clientWidth / 1920;
      map.minZoomLevel = _.clamp(2 * ratio, 1, Number.POSITIVE_INFINITY);
      map.maxZoomLevel = 200;
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
      countrySeries.hide();
      const countryPolygon = countrySeries.mapPolygons.template;
      countryPolygon.tooltipText = '{name}';
      countryPolygon.nonScalingStroke = false;
      // countryPolygon.strokeOpacity = 0.5;
      countryPolygon.fill = am4core.color('#000000');
      countryPolygon.stroke = am4core.color('#013220');
      countryPolygon.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      const hsCountry = countryPolygon.states.create('hover');
      hsCountry.properties.fill = am4core.color('#367B25');
      map.events.on('wheeldown', (ev) => {
        if (countrySeries.appeared && this.zoomThreshold >= ev.target.zoomLevel - 0.5) {
          worldSeries.show();
          countrySeries.hide();
        }
      });
      //
      worldPolygon.events.on('hit', (ev) => {
        const zoom = ev.target.series.chart.zoomToMapObject(ev.target);
        zoom.events.on('animationended', async () => {
          const { id } = ev.target.dataItem.dataContext;
          if (id) {
            this.zoomThreshold = ev.target.series.chart.zoomLevel;
            ev.target.isHover = false; // eslint-disable-line no-param-reassign
            console.log(this.countries[id]);
            if (this.countries[id] === undefined) {
              const countrySeriesResult = await axios.post('/api/getCountry', { country: id });
              this.countries[id] = { geodata: countrySeriesResult.data };
              console.log(this.countries[id]);
            }
            countrySeries.geodata = this.countries[id].geodata;
            worldSeries.hide();
            countrySeries.show();
          }
        });
      });
    });
  },
  methods: {

  },
};
</script>

<style lang="scss">
@import '@/scss/_mixins.scss';
#app .home {
  display: flex;
  .map {
    width: 100%;
    height: 600px;
  }
}
</style>
