<template>
  <div class="sidebar-vue">
    <transition name="sidebar-slide" appear>
      <div v-show="$store.getters.getSidebarVisibility" class="sidebar-wrapper" :style="{ color: getAQITextColor }">
        <div class="title" :style="getAQIFullColor">{{ getCurrentAQI }}</div>
        <component :is="getSidebarContent" class="content"></component>
        <MapLegend :disabled="true" />
      </div>
    </transition>
  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';

import MapLegend from '@/components/MapLegend.component.vue';

export default {
  components: { MapLegend },
  computed: {
    getSidebarContent() {
      const aqi = this.$store.getters.getCurrentAQI;
      const importFile = require(`@/modules/aqi/${aqi}.content.vue`).default; // eslint-disable-line
      return importFile;
    },
    getCurrentAQI() {
      const aqi = this.$store.getters.getAQIKeys[this.$store.getters.getCurrentAQI].alias || this.$store.getters.getCurrentAQI;
      return aqi.toUpperCase();
    },
    getAQITextColor() {
      return this.$store.getters.getAQITextColor(this.$store.getters.getCurrentAQI);
    },
    getAQIFullColor() {
      const color = this.getAQITextColor;
      const bg = this.$store.getters.getAQIColor(this.$store.getters.getCurrentAQI);
      return {
        color,
        backgroundColor: am4core.color(bg).lighten(-0.5),
        borderColor: color,
      };
    },
  },
};
</script>

<style lang="scss">
@import '~@/scss/_mixins';

.sidebar-vue {
  position: relative;
  display: flex;
  flex: 1;
}
.sidebar-wrapper {
  grid-area: sidebar;
  display: grid;
  grid-template-rows: auto 1fr 30px;
  grid-template-columns: 1fr;
  grid-template-areas: "title"
                       "content"
                       "legend";
  background-color: #000;
  border: 1px solid $map-stroke-color;
  border-right: none;
  padding: 20px 0 40px 0;
  width: 350px;
  overflow-y: hidden;
  transition: width .2s ease;
  * { transition: opacity .2s ease .3s; }

  .title {
    justify-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    padding: 10px;
    border: 1px solid white;
    border-radius: 50%;
    font-size: 20px;
    font-weight: 700;
  }
  .content {
    position: relative;
    flex: 1;
    align-self: center;
    text-align: justify;
    font-weight: 600;
    padding: 0 20px;
    span {
      display: block;
      margin: 30px 0;
      &:first-letter {
        margin-left: 20px;
      }
    }
  }
  .map-legend-wrapper {
    height: 30px;
  }
}

.sidebar-slide-leave-to {
  transition: width .2s ease .3s;
  * { transition: opacity .2s ease; }
}
.sidebar-slide-enter, .sidebar-slide-leave-to {
  width: 0;
  * { opacity: 0; }
}

</style>
