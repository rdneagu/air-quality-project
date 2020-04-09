<template>
  <section class="map-legend-wrapper" :class="[ isLoading ]" v-tutorial="getTutorial('heatmap')">
    <div class="map-legend" ref="legend" :style="{ background: createGradient, borderColor: getAQIColor }">
      <span v-if="!disabled" v-show="getMouseoverAQI" class="legend-thumb" :style="{ left: getAQIPosition, background: getAQIColor }"></span>
    </div>
    <span class="range-value aqi-min" :style="{ color: getAQITextColor }">{{ getAQIMinMax.min }}</span>
    <span class="range-value aqi-max">{{ getAQIMinMax.max }}</span>
    <div class="minmax" :style="{ color: getAQITextColor }">
      <span class="label-minimum" v-tutorial="getTutorial('min')">MIN</span>
      <span class="label-maximum">MAX</span>
    </div>
    <div class="effect" :class="getAQIEffect" :style="{ color: getAQITextColor }">
      <span class="label-worse">WORSE</span>
      <span class="label-better" v-tutorial="getTutorial('better')">BETTER</span>
    </div>
  </section>
</template>

<script>
export default {
  props: ['disabled'],
  data() {
    return {
      tutorial: {
        heatmap: { step: 8, text: 'The heatmap shows where the values are in the range when a region is hovered', pos: 'bottom' },
        min: { step: 9, text: 'Shows the minimum and maximum values available in the range', pos: 'left' },
        better: { step: 10, text: 'Shows whether lower values are better or worse', pos: 'left' },
      },
    };
  },
  computed: {
    isLoading() {
      return (this.$store.getters.getMapState.loading && !this.disabled) ? 'loading' : null;
    },
    getAQIEffect() {
      return (this.$store.getters.getAQIKeys[this.$store.getters.getCurrentAQI].effectInversed) ? 'w-to-b' : 'b-to-w';
    },
    getAQIColor() {
      return this.$store.getters.getAQIColor(this.$store.getters.getCurrentAQI);
    },
    getAQITextColor() {
      return this.$store.getters.getAQITextColor(this.$store.getters.getCurrentAQI);
    },
    getAQIMinMax() {
      const { min, max } = this.$store.getters.getAQIMinMax(this.$store.getters.getCurrentAQI);
      return { min, max };
    },
    getMouseoverAQI() {
      if (this.$store.getters.getMouseoverRegion === undefined) return undefined;
      const aqiData = this.$store.getters.getActiveData[this.$store.getters.getMouseoverRegion].aqi;
      if (aqiData === undefined) return undefined;
      return aqiData[this.$store.getters.getCurrentAQI];
    },
    getAQIPosition() {
      const aqi = this.getMouseoverAQI;
      if (!aqi) return 0;

      let { min, max } = this.getAQIMinMax; // eslint-disable-line
      let value = aqi.v;
      if (min < 0) {
        value += Math.abs(min);
        max += Math.abs(min);
      }
      const percentage = value / max;
      const width = this.$refs.legend.clientWidth;
      const left = (width * percentage) - 4;
      return `${left}px`;
    },
    createGradient() {
      const fromColor = this.$store.getters.getAQIHeatColor(this.$store.getters.getCurrentAQI, this.getAQIMinMax.min);
      const toColor = this.$store.getters.getAQIHeatColor(this.$store.getters.getCurrentAQI, this.getAQIMinMax.max);
      return `linear-gradient(to right, ${fromColor}, ${toColor})`;
    },
  },
  methods: {
    getTutorial(step) {
      if (this.disabled) return undefined;
      return this.tutorial[step];
    },
  },
};
</script>

<style lang="scss">
@import '~@/scss/_mixins';

.map-legend-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  text-shadow: none;
  opacity: 1;
  transition: opacity .2s ease;
  &.loading {
    opacity: 0;
  }
  .map-legend {
    flex: 1;
    border: 1px solid $map-stroke-color;
    border-left: none;
    border-right: none;
    border-radius: 2px;
    overflow: hidden;

    .legend-thumb {
      position: absolute;
      top: 1px;
      bottom: 1px;
      width: 4px;
      background-color: #000;
      border: 1px solid black;
      border-top: none;
      border-bottom: none;
    }
  }
  .range-value {
    position: absolute;
    font-size: 16px;
    font-weight: 600;
    padding: 5px;
    &.aqi-min {
      left: 0;
    }
    &.aqi-max {
      right: 0;
      color: #000;
    }
  }
  .minmax {
    position: absolute;
    left: 0;
    right: 0;
    top: -16px;
    > span {
      position: absolute;
      font-size: 14px;
      font-weight: 600;
    }
    .label-minimum { left: 2px; }
    .label-maximum { right: 2px; }
  }
  .effect {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    > span {
      position: absolute;
      font-size: 14px;
      font-weight: 600;
    }
    &.w-to-b {
      .label-worse { left: 2px; }
      .label-better { right: 2px; }
    }
    &.b-to-w {
      .label-better { left: 2px; }
      .label-worse { right: 2px; }
    }
  }
}
</style>
