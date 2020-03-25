<template>
  <div id="app">
    <Header></Header>
    <router-view class="page" />
  </div>
</template>

<script>
import Header from './components/Header.vue';

export default {
  components: {
    Header,
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Titillium+Web:400,500,600,700&display=swap');
@import './scss/_variables';
@import './scss/_normalize';
@import './scss/_fx';

html, body, #app {
  min-height: 100vh;
  background-color: black;
}
#app {
  display: grid;
  grid-template-rows: 60px 1fr;
  flex-direction: column;
  font-size: 14px;
  font-family: 'Titillium Web', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $color-text;
  text-shadow: 1px 1px 1px black;
}
</style>
