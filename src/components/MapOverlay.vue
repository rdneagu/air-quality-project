<template>
  <transition name="fade-io-quick" appear>
    <div class="map-overlay">
      <section class="panel left">
        <MapOverlayButton icon="filter">SMART</MapOverlayButton>
      </section>
      <section class="panel right">
        <MapOverlayButton icon="home" :clickity="func.viewHome">HOME</MapOverlayButton>
        <FlexSpacer></FlexSpacer>
        <MapOverlayButton icon="zoom-in" :clickity="func.zoomIn"></MapOverlayButton>
        <MapOverlayButton icon="zoom-out" :clickity="func.zoomOut"></MapOverlayButton>
        <FlexSpacer></FlexSpacer>
        <MapOverlayButton icon="refresh" :clickity="func.zoomReset">RESET</MapOverlayButton>
      </section>
    </div>
  </transition>
</template>

<script>
import MapOverlayButton from './MapOverlayButton.vue';
import FlexSpacer from './FlexSpacer.vue';

export default {
  components: {
    MapOverlayButton,
    FlexSpacer,
  },
  props: ['func'],
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
  .panel {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80px;
    height: 100%;
    pointer-events: auto;
    &.left {
      // padding-right: 30px;
      background: linear-gradient(to right, rgba(#000, .5) 40%, transparent 100%);
      left: 0;
    }
    &.right {
      // padding-left: 30px;
      background: linear-gradient(to left, rgba(#000, .5) 40%, transparent 100%);
      right: 0;
    }
  }
}

</style>
