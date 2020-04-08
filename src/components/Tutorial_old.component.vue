<template>
  <div class="tutorial-step" :class="[ arrowPosition ]" :style="tooltipPosition">
    <span class="tutorial-text">{{ text }}</span>
    <Button type="dialog" :click="next">Next</Button>
  </div>
</template>

<script>
import Button from './Button.component.vue';

export default {
  components: { Button },
  props: ['element', 'text', 'pos', 'next'],
  data() {
    return {
      tooltipPosition: null,
      arrowPosition: null,
    };
  },
  mounted() {
    this.updateTutorial();
  },
  methods: {
    async updateTutorial() {
      await this.$nextTick();
      const el = this.element;
      const tooltip = this.$el;
      const { left, top } = el.getBoundingClientRect();
      const preset = {
        top: document.documentElement.clientHeight - top + 15,
        middle: top + el.offsetHeight / 2 - tooltip.offsetHeight / 2,
        bottom: top + el.offsetHeight + 10,
        left: document.documentElement.clientWidth - left + 10,
        center: left + el.offsetWidth / 2 - tooltip.offsetWidth / 2,
        right: left + el.offsetWidth + 10,
      };
      const position = {
        x: { css: 'left', px: preset.center },
        y: { css: 'bottom', px: preset.top },
      };
      this.arrowPosition = 'bottom';
      switch (this.pos) {
        case 'right': {
          position.y = { css: 'top', px: preset.middle };
          position.x = { css: 'left', px: preset.right };
          this.arrowPosition = 'left';
          break;
        }
        case 'left': {
          position.y = { css: 'top', px: preset.middle };
          position.x = { css: 'right', px: preset.left };
          this.arrowPosition = 'right';
          break;
        }
        case 'bottom': {
          position.y = { css: 'top', px: preset.bottom };
          this.arrowPosition = 'top';
          break;
        }
        default: break;
      }

      this.tooltipPosition = {};
      this.tooltipPosition[position.x.css] = `${position.x.px}px`;
      this.tooltipPosition[position.y.css] = `${position.y.px}px`;
    },
  },
  watch: {
    '$store.getters.getActiveTutorial': function OnStepChange(to) {
      if (to !== null) {
        this.updateTutorial();
      }
    },
  },
};
</script>

<style lang="scss">
@import '~@/scss/_mixins';

.tutorial-step {
  position: absolute;
  display: flex;
  align-items: center;
  padding: 4px 6px 4px 6px;
  border-radius: 2px;
  border-color: $map-stroke-color;
  border: 1px solid;
  background-color: $map-bg-color;
  box-shadow: 0 0 20px rgba(#000, .5);
  font-size: 14px;
  white-space: pre;
  z-index: 5000;
  @include transition('opacity', .2s, ease);
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
    &:before { border-left: 5px solid; }
    &:after {
      z-index: 10;
      margin-left: -1px;
      border-left: 5px solid $map-bg-color;
    }
    &.alert:after { border-left: 5px solid darken($color-error, 60%); }
  }
  &.bottom {
    &:before { border-top: 5px solid; }
    &:after {
      margin-top: -1px;
      z-index: 10;
      border-top: 5px solid $map-bg-color;
    }
    &.alert:after { border-top: 5px solid darken($color-error, 60%); }
  }
  &.left {
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
  .tutorial-text {
    margin: 0 10px;
    font-weight: 600;
  }
  .button { padding: 4px 20px; }
}
</style>
