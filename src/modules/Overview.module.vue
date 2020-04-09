<template>
  <transition name="tooltipfx" appear>
    <div v-if="isOverviewVisible" class="overview-vue">
      <Logo />
      <section class="intro">
        <h1 class="welcome">Welcome to the air pollution tracker “Air Quality”</h1>
        <div id="intro-1" class="intro-panel">
          <div class="intro-img"></div>
          <div class="intro-txt">Informations about each type of pollution and how it affects the environment</div>
        </div>
        <div id="intro-2" class="intro-panel">
          <div class="intro-img"></div>
          <div class="intro-txt">Charts that represent the most and least affected areas by a selected Air Quality Index</div>
        </div>
        <div id="intro-3" class="intro-panel">
          <div class="intro-img"></div>
          <div class="intro-txt">Fully interactive map with clickable regions which displays in-depth real-time pollution data for each country and city</div>
        </div>
      </section>
      <div class="control">
        <Button type="dialog" icon="lightbulb" :click="start.bind()">Get started</Button>
        <Button v-if="hasFinishedTutorial" type="dialog" icon="circle-right" :click="start.bind(null, true)">Skip tutorial</Button>
      </div>
    </div>
  </transition>
</template>

<script>
import Button from '../components/Button.component.vue';
import Logo from '../components/Logo.component.vue';

export default {
  components: { Logo, Button },
  computed: {
    /**
     * Returns whether the user has finished the tutorial or not
     *
     * @returns {Boolean}  True or false whether the cookie tutorial step is higher than the total steps
     */
    hasFinishedTutorial() {
      return (this.$cookies.get('tutorial') || 0) >= this.$store.getters.getTutorialLast;
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
    /**
     * Hide the overview and proceed showing the main page
     */
    start(skip) {
      // If the tutorial is not being skipped, start the tutorial
      if (!skip) {
        this.$store.commit('setTutorialAt', 1);
      } else {
        this.$store.commit('setTutorialAt', this.$store.getters.getTutorialLast);
      }
      // Hide the overview and stop it from further showing into the user's face on page load
      this.$store.commit('setOverview', false);
      this.$cookies.set('overview', 1);
    },
  },
};
</script>

<style lang="scss">
@import '~@/scss/_mixins';

.overview-vue {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  min-height: 100%;
  min-width: 100%;
  padding: 40px 0;
  background: url('../assets/images/panel-bg.jpg') no-repeat center center / cover;
  background-attachment: fixed;
  z-index: 100;
  @include transition('opacity', .2s, ease);
  &:before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(#000, .9);
  }
  // Because of the above rule we must set all the child to relative
  > * {
    position: relative;
  }
  .logo {
    font-size: 72px;
    margin-bottom: 40px;
  }
  .intro {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-self: stretch;
    &:before, &:after {
      content: "";
      width: 90%;
      border-bottom: 1px solid $map-stroke-color;
    }
    .welcome {
      flex: 100%;
      text-align: center;
    }
    .intro-panel {
      flex: 0 0 400px;
      margin: 20px 0;
      .intro-img {
        height: 400px;
        box-shadow: 0 0 4px $map-stroke-color;
      }
      .intro-txt {
        margin: 10px 0;
        font-size: 16px;
        font-weight: 700;
        text-align: center;
      }
    }
    #intro-1 .intro-img { background: url('../assets/images/welcome-4.jpg') no-repeat center center / cover; }
    #intro-2 .intro-img { background: url('../assets/images/welcome-2.jpg') no-repeat left center / cover; }
    #intro-3 .intro-img { background: url('../assets/images/welcome-3.jpg') no-repeat center center / cover; }
  }
  .control {
    display: flex;
    margin-top: 20px;
    font-size: 18px;
    .button {
      margin: 0 20px;
    }
  }
}
</style>
