<template>
  <button class="map-overlay-button" :id="name" :class="[ special, isDisabled ]" @click.capture="click">
    <Icon :name="icon"></Icon>
    <span class="label" :class="[ labelType || 'small' ]"><slot name="default"></slot></span>
    <slot name="filter"></slot>
  </button>
</template>

<script>
import Icon from './Icon.vue';

export default {
  components: {
    Icon,
  },
  props: ['name', 'text', 'special', 'icon', 'labelType', 'disabled', 'clickity', 'filterColor', 'default'],
  computed: {
    getId() {
      return `button-${this.name}`;
    },
    isDisabled() {
      return (this.disabled) ? 'disabled' : false;
    },
  },
  methods: {
    click() {
      if (this.disabled || typeof (this.clickity) !== 'function') { return false; }
      return this.clickity();
    },
  },
};
</script>

<style lang="scss">
@import '../scss/variables';

.map-overlay-button {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 48px;
  margin: 8px 0;
  color: $color-text;
  cursor: pointer;
  transition: .2s color ease;
  // Disable button styling
  border: none;
  background: none;
  outline: none;

  &.disabled {
    opacity: .2;
    cursor: default;
  }
  &:hover:not(.disabled) { color: lighten($color-text, 20%); }

  .icon { font-size: 22px }
  .label.small {
    font-size: 12px;
    font-weight: 700;
  }
  .filter-color {
    position: absolute;
    top: 9px;
    left: 19px;
    height: 14px;
    width: 14px;
    z-index: -1;
  }
}
</style>
