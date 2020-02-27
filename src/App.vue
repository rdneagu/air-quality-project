<template>
  <div id="app">
    <Header></Header>
    <router-view/>
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
@import './scss/_fonts.scss';
@import './scss/_normalize.scss';
@import './scss/fx';

html, body, #app {
  min-height: 100vh;
  background-color: black;
}
#app {
  display: flex;
  flex-direction: column;
  font-size: 18px;
  font-family: 'Noto Sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: lighten(teal, 10%);
  text-shadow: 1px 1px 1px black;

  > * { flex: 1; }
}
</style>
