<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Noto+Sans:400,700&display=swap');
@import '@/scss/_normalize.scss';

html, body, #app {
  min-height: 100vh;
  background-color: black;
}
#app {
  display: flex;
  flex-direction: column;
  font-family: 'Noto Sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: lighten(teal, 10%);
  text-shadow: 1px 1px 1px black;

  > * { flex: 1; }
}
</style>
