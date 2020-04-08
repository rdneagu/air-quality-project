<template>
  <transition name="tooltipfx" appear>
    <div v-if="isAtStep" class="tutorial-test" :class="[ pos ]">
      <span class="tip" v-html="text"></span>
      <Button type="dialog" :click="next">Next</Button>
    </div>
  </transition>
</template>

<script>
import Button from '@/components/Button.component.vue';

export default {
  components: { Button },
  props: ['text', 'pos', 'next', 'step'],
  computed: {
    isAtStep() {
      return (this.$store.getters.getTutorialAt === this.step);
    },
  },
};
</script>

<style lang="scss">
@import '~@/scss/_mixins';

.tutorial-test {
  position: absolute;
  display: flex;
  align-items: center;
  padding: 4px 6px 4px 6px;
  border-radius: 2px;
  border-color: $color-text !important;
  border: 1px solid;
  border-left: 8px solid;
  color: $color-text !important;
  background-color: $map-bg-color !important;
  box-shadow: 0 0 20px rgba(#000, .5) !important;
  text-shadow: none !important;
  font-size: 14px !important;
  white-space: pre;
  z-index: 5000;
  @include transition('opacity', .2s, ease);
  .tip {
    margin-right: 10px;
    font-weight: 600;
  }
  .button { padding: 4px 20px; }
  &:before, &:after {
    content: "";
    position: absolute;
    display: block;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    pointer-events: none;
  }
  &.alert {
    border-color: $color-error;
    border: 1px solid;
    color: $color-error;
    background-color: darken($color-error, 60%);
  }

  &.top:before, &.top:after, &.bottom:before, &.bottom:after {
    left: 50%;
    transform: translateX(-50%);
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
  }
  &.left:before, &.left:after, &.right:before, &.right:after {
    top: 50%;
    transform: translateY(-50%);
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
  }
  &.top:before, &.top:after { top: 0; }
  &.bottom:before, &.bottom:after { top: 100%; }
  &.left:before, &.left:after { left: 0; }
  &.right:before, &.right:after { left: 100%; }
  &.right {
    right: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%);
    &:before { border-left: 5px solid; }
    &:after {
      z-index: 10;
      margin-left: -1px;
      border-left: 5px solid $map-bg-color;
    }
    &.alert:after { border-left: 5px solid darken($color-error, 60%); }
  }
  &.bottom {
    bottom: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
    &:before { border-top: 5px solid; }
    &:after {
      margin-top: -1px;
      z-index: 10;
      border-top: 5px solid $map-bg-color;
    }
    &.alert:after { border-top: 5px solid darken($color-error, 60%); }
  }
  &.left {
    .tip {
      margin-right: 0;
      margin-left: 10px;
      order: 10;
    }
    border-left: 1px solid;
    border-right: 8px solid;
    left: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%);
    &:before {
      left: -13px;
      border-right: 5px solid;
    }
    &:after {
      left: -12px;
      z-index: 10;
      border-right: 5px solid $map-bg-color;
    }
    &.alert:after { border-right: 5px solid darken($color-error, 60%); }
  }
  &.top {
    top: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
    &:before {
      top: -6px;
      border-bottom: 5px solid;
    }
    &:after {
      top: -5px;
      z-index: 10;
      border-bottom: 5px solid $map-bg-color;
    }
    &.alert:after { border-bottom: 5px solid darken($color-error, 60%); }
  }
}
</style>
