<template>
  <div id="app" v-if="isRoute">
    <transition name="fade-in" mode="out-in" appear>
      <router-view class="page">
        <Header slot="header" />
      </router-view>
    </transition>
  </div>
</template>

<script>
import Header from './modules/Header.module.vue';

export default {
  components: {
    Header,
  },
  computed: {
    isRoute() {
      return this.$route.name;
    },
  },
  watch: {
    $route(to) {
      document.title = to.meta.title || 'Air Quality';
    },
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Titillium+Web:400,500,600,700&display=swap');
@import './scss/_normalize';
@import './scss/_fx';

a {
  text-decoration: none !important;
  color: $color-text;

  transition: color .15s linear, text-shadow .15s linear, background-color .15s linear;
  cursor: pointer;

  &:hover:not(.icon):not(.button) {
    color: lighten($color-text, 20%);
    text-shadow: 0 0 1px $color-text !important;
  }
}
html, body, #app {
  min-height: 100vh;
  background-color: $map-bg-color;
}
#app {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-areas: "page";
  font-size: 14px;
  font-family: 'Titillium Web', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $color-text;
  text-shadow: 1px 1px 1px black;
  .page {
    grid-area: page;
    overflow: hidden;
    transition: opacity .4s ease;
  }
}
*::selection {
  background-color: darken($color-text, 5%);
  color: #000;
  text-shadow: none;
}

.fade-in-enter, .fade-in-leave-active {
  opacity: 0;
}
</style>
