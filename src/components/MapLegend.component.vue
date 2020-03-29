<template>
  <section v-if="!$store.getters.getMapState.loading" class="map-legend-wrapper">
    <div class="map-legend" ref="legend" :style="{ background: createGradient, borderColor: getAQIColor }">
      <span v-show="getMouseoverAQI" class="legend-thumb" :style="{ left: getAQIPosition, background: getAQIColor }"></span>
    </div>
    <span class="range-value aqi-min" :style="{ color: getAQIColor }">{{ getAQIMinMax.min }}</span>
    <span class="range-value aqi-max">{{ getAQIMinMax.max }}</span>
    <div class="label" :style="{ color: getAQIColor }">
      <span class="label-minimum">MIN</span>
      <span class="label-maximum">MAX</span>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    getActiveAQI() {
      return this.$store.getters.getSelected('filter') || 'smart';
    },
    getAQIColor() {
      return this.$store.getters.getAQIColor(this.getActiveAQI);
    },
    getAQIMinMax() {
      const { min, max } = this.$store.getters.getAQIMinMax(this.getActiveAQI);
      return { min, max };
    },
    getMouseoverAQI() {
      if (this.$store.getters.getMouseoverRegion === undefined) return undefined;
      const aqiData = this.$store.getters.getActiveData[this.$store.getters.getMouseoverRegion].aqi;
      if (aqiData === undefined) return undefined;
      return aqiData[this.getActiveAQI];
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
      const fromColor = this.$store.getters.getAQIHeatColor(this.getActiveAQI, this.getAQIMinMax.min);
      const toColor = this.$store.getters.getAQIHeatColor(this.getActiveAQI, this.getAQIMinMax.max);
      return `linear-gradient(to right, ${fromColor}, ${toColor})`;
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
  .label {
    position: absolute;
    left: 0;
    right: 0;
    top: -16px;
    > span {
      position: absolute;
      font-size: 14px;
      font-weight: 600;
    }
    .label-minimum {
      left: 2px;
    }
    .label-maximum {
      right: 2px;
    }

  }
}
</style>
