<template>
  <div class="home">
    <Map></Map>
    <Sidebar></Sidebar>
    <MapLegend></MapLegend>
    <div class="graphs-wrapper">

    </div>
  </div>
</template>

<script>
import Map from '../modules/Map.module.vue';
import Sidebar from '../modules/Sidebar.module.vue';
import MapLegend from '../components/MapLegend.component.vue';

export default {
  components: {
    Map,
    Sidebar,
    MapLegend,
  },
};
</script>

<style lang="scss">
#app .home {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 700px 45px 1fr;
  grid-row-gap: 10px;
  grid-template-areas: "map sidebar"
                       "legend legend"
                       "graphs graphs";

  .map-wrapper {
    grid-area: map;
  }
  .map-legend-wrapper {
    margin-top: 15px;
    grid-area: legend;
  }
  .graphs-wrapper {
    grid-area: graphs;
  }
}
</style>
