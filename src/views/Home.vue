<template>
  <div class="home">
    <slot />
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
  components: { Map, Sidebar, MapLegend, MapCharts },
  mounted() {
    // If the user hasn't viewed the overview yet, pop it in his face
    if (this.$cookies.get('overview') === null) {
      this.$store.commit('setOverview', true);
    }
    // Prepare the tutorial if the user hasn't finished it yet
    const isInTutorial = this.$cookies.get('tutorial');
    this.$store.commit('setTutorialAt', Number.parseInt(isInTutorial, 10) || 1);
  },
};
</script>

<style lang="scss">
#app .home {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 700px 70px auto;
  grid-template-areas: "header header"
                       "map sidebar"
                       "legend legend"
                       "graphs graphs";

  .map-wrapper {
    grid-area: map;
  }
  .map-legend-wrapper {
    margin: 20px 0;
    grid-area: legend;
  }
}
</style>
