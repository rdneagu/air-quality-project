<template>
  <section class="graphs-wrapper" :class="[ isLoading ]">
    <Chart measurement="most-polluted" v-tutorial="tutorial.tophigh">HIGHEST VALUES IN DESCENDING ORDER</Chart>
    <div class="dominent-aqi" v-tutorial="tutorial.dominant">
      <div class="title" :style="{ color: getAQIColor.color }">DOMINANT POLLUTANT</div>
      <span class="round-aqi" :style="getAQIColor">{{ getDominentAQI }}</span>
    </div>
    <Chart measurement="most-polluted" :reversed="true" v-tutorial="tutorial.toplow">LOWEST VALUES IN ASCENDING ORDER</Chart>
  </section>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';

import Chart from '../components/Chart.component.vue';

export default {
  components: { Chart },
  data() {
    return {
      tutorial: {
        tophigh: {
          step: 11,
          text: 'This chart shows the top values in descending order',
          pos: 'bottom',
        },
        dominant: {
          step: 12,
          text: 'Shows which pollution index is dominant for the selected region',
          pos: 'bottom',
        },
        toplow: {
          step: 13,
          text: 'This chart shows the top values in ascending order',
          pos: 'bottom',
        },
      },
    };
  },
  computed: {
    getDominentAQI() {
      const aqi = this.$store.getters.getDominentAQI;
      return this.$store.getters.getAQIKeys[aqi].alias || aqi;
    },
    getAQIColor() {
      const color = this.$store.getters.getAQIColor(this.$store.getters.getDominentAQI);
      return {
        color: am4core.color(color).lighten(0.5).rgba,
        backgroundColor: am4core.color(color).lighten(-0.5).rgba,
        borderColor: am4core.color(color).lighten(0.5).rgba,
      };
    },
    isLoading() {
      return (this.$store.getters.getMapState.loading ? 'loading' : null);
    },
  },
};
</script>

<style lang="scss">
.graphs-wrapper {
  position: relative;
  grid-area: graphs;
  display: grid;
  grid-template-columns: 1fr 256px 1fr;
  grid-template-rows: 1fr;
  grid-column-gap: 40px;
  margin: 20px;
  opacity: 1;
  transition: opacity .2s ease;
  &.loading {
    opacity: 0;
  }
  .dominent-aqi {
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
    align-items: center;
    justify-items: center;
    .title {
      font-size: 16px;
      font-weight: 700;
    }
    .round-aqi {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 128px;
      height: 128px;
      margin-top: 15px;
      border-radius: 50%;
      border: 2px solid $map-fill-color;
      background: darken($map-stroke-color, 5%);
      color: $map-fill-color;
      text-shadow: none;
      font-size: 24px;
      font-weight: 700;
    }
  }
}
</style>
