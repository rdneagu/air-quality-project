<template>
  <transition name="tooltipfx">
    <div v-if="getTooltip" class="tooltip-vue" :class="[ getTooltip.type, arrowPosition ]" :style="tooltipPosition">
      <span class="tip">{{ getTooltip.text }}</span>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      tooltipPosition: null,
      arrowPosition: null,
    };
  },
  computed: {
    getTooltip() {
      return this.$store.getters.getTooltip;
    },
  },
  watch: {
    async getTooltip(to) {
      if (!to) return;
      this.$nextTick(() => {
        const el = to.element;
        const tooltip = this.$el;
        const { left, top } = el.getBoundingClientRect();
        const { clientHeight, clientWidth } = document.querySelector('#app');
        const preset = {
          top: clientHeight - top + 15,
          middle: top + el.offsetHeight / 2 - tooltip.offsetHeight / 2,
          bottom: top + el.offsetHeight + 10,
          left: clientWidth - left + 10,
          center: left + el.offsetWidth / 2 - tooltip.offsetWidth / 2,
          right: left + el.offsetWidth + 10,
        };
        const position = {
          x: { css: 'left', px: preset.center },
          y: { css: 'bottom', px: preset.top },
        };
        this.tooltipPosition = {};
        this.arrowPosition = 'bottom';
        if (position.x.px - tooltip.offsetWidth <= 0 || position.x.px + tooltip.offsetWidth >= clientWidth) {
          position.y = { css: 'top', px: preset.middle };
          if (position.x.px - tooltip.offsetWidth <= 0) {
            position.x = { css: 'left', px: preset.right };
            this.arrowPosition = 'left';
          }
          if (position.x.px + tooltip.offsetWidth >= clientWidth) {
            position.x = { css: 'right', px: preset.left };
            this.arrowPosition = 'right';
          }
        } else if (top - tooltip.offsetHeight - 10 <= 0) {
          position.y = { css: 'top', px: preset.bottom };
          this.arrowPosition = 'top';
        }
        this.tooltipPosition[position.x.css] = `${position.x.px}px`;
        this.tooltipPosition[position.y.css] = `${position.y.px}px`;
      });
    },
  },
};
</script>

<style lang="scss">
@import '~@/scss/_mixins';

.tooltip-vue {
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
  z-index: 10;
  @include transition('opacity', .2s, ease);
  .tip { font-weight: 600; }
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
      z-index: 1;
      margin-left: -2px;
      border-left: 5px solid $map-bg-color;
    }
    &.alert:after { border-left: 5px solid darken($color-error, 60%); }
  }
  &.bottom {
    &:before { border-top: 5px solid; }
    &:after {
      margin-top: -2px;
      z-index: 1;
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
      left: -11px;
      z-index: 1;
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
      top: -4px;
      z-index: 1;
      border-bottom: 5px solid $map-bg-color;
    }
    &.alert:after { border-bottom: 5px solid darken($color-error, 60%); }
  }
}

.tooltipfx-enter, .tooltipfx-leave-to {
  opacity: 0;
}
</style>
