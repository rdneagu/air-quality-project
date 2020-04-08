<template>
  <div class="home">
    <slot name="header" />
    <Map />
    <Sidebar />
    <MapLegend />
    <MapCharts />
  </div>
</template>

<script>
import Map from '../modules/Map.module.vue';
import Sidebar from '../modules/Sidebar.module.vue';
import MapLegend from '../components/MapLegend.component.vue';
import MapCharts from '../modules/MapCharts.module.vue';

export default {
  components: {
    Map,
    Sidebar,
    MapLegend,
    MapCharts,
  },
};
</script>

<style lang="scss">
#app .home {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 80px 700px 45px auto;
  grid-row-gap: 10px;
  grid-template-areas: "header header"
                       "map sidebar"
                       "legend legend"
                       "graphs graphs";

  .map-wrapper {
    grid-area: map;
  }
  .map-legend-wrapper {
    margin-top: 15px;
    grid-area: legend;
  }
}
</style>
