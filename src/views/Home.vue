<template>
  <div class="home">
    <Map></Map>
    <Sidebar></Sidebar>
    <div class="graphs-wrapper">

    </div>
  </div>
</template>

<script>
import Map from '../components/Map.vue';
import Sidebar from '../components/Sidebar.vue';

export default {
  components: {
    Map,
    Sidebar,
  },
};
</script>

<style lang="scss">
@import '@/scss/_variables.scss';

#app .home {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 700px 1fr;
  grid-template-areas: "map sidebar"
                       "graphs graphs";

  .map-wrapper {
    grid-area: map;
  }
  .graphs-wrapper {
    grid-area: graphs;
  }
}
</style>
