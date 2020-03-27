<template>
  <transition name="fade-io-quick" appear>
    <div class="map-overlay">
      <section class="panel left">
        <MapOverlayDropdown id="filter" icon="filter" :items="filterDropdown">SMART</MapOverlayDropdown>
      </section>
      <section class="panel right">
        <MapOverlayButton icon="home" :clickity="func.viewHome">HOME</MapOverlayButton>
        <FlexSpacer></FlexSpacer>
        <MapOverlayButton icon="zoom-in" :clickity="func.zoomIn"></MapOverlayButton>
        <MapOverlayButton :icon="$store.getters.getSidebarVisibility ? 'right' : 'left'" :clickity="toggleSidebar.bind()"></MapOverlayButton>
        <MapOverlayButton icon="zoom-out" :clickity="func.zoomOut"></MapOverlayButton>
        <FlexSpacer></FlexSpacer>
        <MapOverlayButton icon="refresh" :clickity="func.zoomReset">RESET</MapOverlayButton>
      </section>
    </div>
  </transition>
</template>

<script>
import _ from 'lodash';

import MapOverlayButton from './MapOverlayButton.vue';
import MapOverlayDropdown from './MapOverlayDropdown.vue';
import FlexSpacer from './FlexSpacer.vue';

export default {
  components: {
    MapOverlayButton,
    MapOverlayDropdown,
    FlexSpacer,
  },
  props: ['func'],
  computed: {
    filterDropdown() {
      const filters = { smart: { text: 'SMART', icon: 'filter-card', filterColor: this.$store.getters.getAQIColor('smart'), default: true } };
      _.forEach(this.$store.state.map.aqis, (aqi, id) => {
        filters[id] = {
          text: id.toUpperCase(),
          icon: 'filter-card',
          filterColor: this.$store.getters.getAQIColor(id),
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
@import '../scss/variables';

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
