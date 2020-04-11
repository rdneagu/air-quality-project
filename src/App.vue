<template>
  <div id="app" v-if="isRoute">
    <transition name="fade-in" mode="out-in" appear>
      <keep-alive>
        <router-view class="page">
          <div class="bg"></div>
          <Header v-if="!isAuthScreen" />
        </router-view>
      </keep-alive>
    </transition>
    <Tooltip />
    <Overview v-if="isOverviewVisible" />
  </div>
</template>

<script>
import axios from 'axios';

import Header from './modules/Header.module.vue';
import Tooltip from './modules/Tooltip.module.vue';
import Overview from './modules/Overview.module.vue';

export default {
  components: { Header, Tooltip, Overview },
  async mounted() {
    await this.getSession();
  },
  computed: {
    /**
     * Returns the current route name (URL path)
     *
     * @returns {String}  The current URL path
     */
    isRoute() {
      return this.$route.name;
    },
    /**
     * Returns whether the current screen is for authentication
     *
     * @returns {Boolean}  True or false whether the URL is login or register
     */
    isAuthScreen() {
      switch (this.$route.name) {
        case 'login':
        case 'register':
          return true;
        default:
          return false;
      }
    },
    /**
     * Returns whether the overview should be visible or not
     *
     * @returns {Boolean}  True or false whether the overview is visible or not
     */
    isOverviewVisible() {
      return this.$store.getters.getOverview;
    },
  },
  methods: {
    async getSession() {
      try {
        const res = await axios.get('http://18.191.197.201:8090/session/user');
        if (res.data === 'anonymousUser') {
          throw 'Session mismatch';
        }
        this.$store.commit('setUser', res.data);
      } catch (e) {
        this.$store.commit('setUser', null);
      }
    },
  },
  watch: {
    /**
     * Watcher to change the title according to the loaded route defaulting to 'Air Quality'
     */
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
  min-width: 900px;
}
#app {
  position: relative;
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
    position: relative;
    grid-area: page;
    overflow: hidden;
    transition: opacity .4s ease;
    .bg {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: url('./assets/images/login-bg.jpg') no-repeat center center / cover;
      background-attachment: fixed;
      opacity: .1;
      &:after {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        background: $map-fill-color;
        mix-blend-mode: hard-light;
      }
    }
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
