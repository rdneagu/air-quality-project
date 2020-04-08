<template>
  <transition name="fade-io-quick" appear>
    <div class="map-overlay">
      <section class="panel left">
        <MapOverlayDropdown id="filter" icon="filter" :items="filterDropdown" v-tutorial="tutorial.smart">SMART</MapOverlayDropdown>
      </section>
      <section class="panel right">
        <MapOverlayButton icon="home" :click="func.viewHome" v-tutorial="tutorial.home">HOME</MapOverlayButton>
        <FlexSpacer></FlexSpacer>
        <MapOverlayButton icon="zoom-in" :click="func.zoomIn" v-tutorial="tutorial.zoomIn"></MapOverlayButton>
        <MapOverlayButton :icon="$store.getters.getSidebarVisibility ? 'right' : 'left'" :click="toggleSidebar.bind()" v-tutorial="tutorial.sidebar"></MapOverlayButton>
        <MapOverlayButton icon="zoom-out" :click="func.zoomOut" v-tutorial="tutorial.zoomOut"></MapOverlayButton>
        <FlexSpacer></FlexSpacer>
        <MapOverlayButton icon="refresh" :click="func.zoomReset" v-tutorial="tutorial.reset">RESET</MapOverlayButton>
      </section>
    </div>
  </transition>
</template>

<script>
import _ from 'lodash';

import MapOverlayButton from './MapOverlayButton.component.vue';
import MapOverlayDropdown from './MapOverlayDropdown.component.vue';
import FlexSpacer from './FlexSpacer.component.vue';

export default {
  components: {
    MapOverlayButton,
    MapOverlayDropdown,
    FlexSpacer,
  },
  props: ['func'],
  data() {
    return {
      tutorial: {
        smart: {
          step: 2,
          text: 'This button changes the current air quality index statistic',
          pos: 'left',
        },
        home: {
          step: 3,
          text: 'This button takes to your home region',
          pos: 'right',
        },
        zoomIn: {
          step: 4,
          text: 'This button zooms in the map',
          pos: 'right',
        },
        sidebar: {
          step: 5,
          text: 'This button toggles the sidebar which contains information about the selected filter',
          pos: 'right',
        },
        zoomOut: {
          step: 6,
          text: 'This button zooms out the map',
          pos: 'right',
        },
        reset: {
          step: 7,
          text: 'This button resets the map to default state (completely zooms out and centers)',
          pos: 'right',
        },
      },
    };
  },
  computed: {
    filterDropdown() {
      const filters = { smart: { text: 'SMART', icon: 'filter-card', filterColor: this.$store.getters.getAQIColor('smart'), default: true } };
      _.forEach(this.$store.getters.getActiveAQI, (aqi) => {
        const aqiUC = this.$store.getters.getAQIKeys[aqi].alias || aqi;
        filters[aqi] = {
          text: aqiUC.toUpperCase(),
          icon: 'filter-card',
          filterColor: this.$store.getters.getAQIColor(aqi),
        };
      });
      return filters;
    },
  },
  methods: {
    toggleSidebar() {
      this.$store.commit('toggleSidebar');
    },
  },
};
</script>

<style lang="scss">
.map-overlay {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  color: $color-text;
  .panel {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80px;
    height: 100%;
    pointer-events: auto;
    &.left {
      padding-right: 30px;
      background: linear-gradient(to right, rgba(#000, .5) 40%, transparent 100%);
      left: 0;
    }
    &.right {
      padding-left: 30px;
      background: linear-gradient(to left, rgba(#000, .5) 40%, transparent 100%);
      right: 0;
    }
  }
}

</style>
