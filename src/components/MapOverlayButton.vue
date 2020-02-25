<template>
  <button :id="name" :class="[ special, isDisabled ]" @click="click">
    <i class="icon" :class="[ getIcon ]"></i>
    <span class="label" :class="[ labelType || 'small' ]" v-if="$slots.default"><slot></slot></span>
  </button>
</template>

<script>
export default {
  props: ['name', 'special', 'icon', 'labelType', 'disabled', 'clickity'],
  computed: {
    getIcon() {
      return `icon-${this.icon}-aqp`;
    },
    isDisabled() {
      return (this.disabled) ? 'disabled' : false;
    },
  },
  methods: {
    click() {
      if (this.disabled) return false;
      if (typeof (this.clickity) !== 'function') return false;
      return this.clickity();
    },
  },
};
</script>

<style lang="scss">
@import '../scss/variables';

button {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: $map-fill-color;
  margin: 8px 0;
  cursor: pointer;
  width: 48px;
  height: 48px;
  // Disable button styling
  border: none;
  background: none;
  outline: none;
  transition: .4s color ease;

  &.disabled {
    opacity: .2;
    cursor: default;
  }
  &:hover:not(.disabled) { color: lighten($map-fill-color, 20%) }

  .icon { font-size: 1.5em }
  .label.small {
    font-size: .6em;
    font-weight: 700;
  }
}
</style>
