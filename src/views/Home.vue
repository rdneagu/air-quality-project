<template>
  <div class="home">
    <Map></Map>
  </div>
</template>

<script>
import Map from '../components/Map.vue';

export default {
  components: {
    Map,
  },
};
</script>

<style lang="scss">
#app .home {
  display: flex;
}
</style>
