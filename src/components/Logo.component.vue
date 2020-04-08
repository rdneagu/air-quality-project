<template>
  <div class="logo-vue">
    <router-link :to="{ name: 'home' }" class="logo">
      <div class="part-cloud">
        <Icon name="cloud"></Icon>
        <span class="text-aqi">CO2</span>
        <Icon name="arrow_dr"></Icon>
      </div>
      <div class="part-name">
        <span class="text-air">AIR</span>
        <span class="text-quality">
          <Icon name="leaf"></Icon>
          <span>uality</span>
        </span>
      </div>
    </router-link>
  </div>
</template>

<script>
import Icon from './Icon.component.vue';

export default {
  components: { Icon },
};
</script>

<style lang="scss">
.logo-vue {
  position: relative;
}
.logo {
  position: relative;
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 32px;
  .part-cloud {
    position: relative;
    font-size: 1.5em;
    text-shadow: none;
    .text-aqi {
      position: absolute;
      color: #000;
      left: 50%;
      top: calc(50% + 0.35em);
      transform: translate(-50%, -50%);
      font-size: 0.25em;
    }
    .icon-arrow_dr-aqp {
      position: absolute;
      bottom: -0.35em;
      left: -0.25em;
      font-size: 1em;
    }
  }
  .part-name {
    display: flex;
    margin-left: 0.32em;
    position: relative;
    .text-air { margin-right: 0.16em; }
    .text-quality {
      display: flex;
      color: darken($map-fill-color, 2%);
      font-weight: 600;
      .icon {
        display: block;
        position: relative;
        transform: rotate(15deg) scaleY(-1);
        margin-right: -0.16em;
      }
    }
  }
}
</style>
