<template>
  <div class="button-vue" :id="getName">
    <router-link class="button" :class="[ getStyle, isActive ]" v-if="href" :to="href" @click.native.capture="OnButtonClick">
      <Icon :name="icon"></Icon>
      <span class="text">{{ getButtonText }}</span>
    </router-link>
    <div v-else class="button" :class="[ getStyle, isDisabled, isActive ]" @click.capture="OnButtonClick">
      <Icon :name="isPending"></Icon>
      <span class="text">{{ getButtonText }}</span>
    </div>
    <Dropdown v-if="dropdown && dropdown.items" :dropdown="dropdown"></Dropdown>
  </div>
</template>

<script>
import Icon from './Icon.component.vue';
import Dropdown from './Dropdown.component.vue';

export default {
  components: { Icon, Dropdown },
  props: ['name', 'href', 'type', 'icon', 'text', 'click', 'disabled', 'dropdown', 'pending'],
  computed: {
    getName() {
      return `btn-${this.name}`;
    },
    getStyle() {
      return (this.type) ? `${this.type}-style` : null;
    },
    getButtonText() {
      if (this.dropdown && !this.dropdown.ignoreSelection) {
        const selectedId = this.$store.getters.getSelected(this.dropdown.id);
        return (selectedId) ? this.dropdown.items[this.getSelectedId] : '...';
      }
      return this.text || ((this.$slots.default && this.$slots.default.length) ? this.$slots.default[0].text : null);
    },
    isActive() {
      return ((this.dropdown && this.dropdown.visible) || this.$route.path.slice(1) === this.href) ? 'active' : false;
    },
    isDisabled() {
      return this.disabled ? 'disabled' : null;
    },
    isPending() {
      return (this.pending ? 'spinner' : this.icon);
    },
  },
  methods: {
    OnButtonClick() {
      // If the button is disabled don't do anything
      if (this.disabled) return false;
      // If the button has a dropdown menu, force the click functionality to show the dropdown
      if (this.dropdown) return this.$set(this.dropdown, 'visible', !this.dropdown.visible);
      // If the button is not a valid function don't do anything
      if (typeof (this.click) !== 'function') return false;
      // Call the bound function
      return this.click();
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_mixins.scss';
@import '@/scss/_variables.scss';

.button-vue {
  position: relative;
  .button {
    display: flex;
    align-items: center;
    cursor: pointer;
    .icon-wrapper {
      position: relative;
      margin: 0 8px 0 0; // Add spacing between icon and text on the right side of the icon [ICON  TEXT]
    }
    .text {
      flex: 1;
      font-weight: 600;
    };
    &.inversed {
      .text { order: 1 };
      .icon-wrapper {
        order: 2;
        margin: 0 0 0 8px; // Add spacing between icon and text on the left side of the icon [TEXT  ICON]
      }
    }
    &.disabled {
      cursor: default;
      opacity: .4;
    }
    @include disableSelect();
  }

  .bzard-style {
    padding: 6px 16px;
    background-color: darken($color-text, 30%);
    color: lighten($color-text, 20%);
    box-shadow: 0 1px 1px rgba(black, .3), 0 0 1px 1px rgba(white, .15) inset;
    @include transition('background-color, box-shadow', .2s, ease);
    &:not(.disabled) {
      &.is-active, &:hover {
        background-color: darken($color-text, 25%);
      }
    }
  }

  .dialog-style {
    padding: 8px 20px;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    border-radius: 3px;
    background: linear-gradient(to bottom, darken($color-text, 10%), darken($color-text, 20%));
    background-blend-mode: screen;
    color: lighten($color-text, 40%);
    box-shadow: 0 1px 2px rgba(black, .8), 0 0 1px 1px rgba(white, .15) inset;
    @include transition('background-color, border', .2s, ease);
    &:not(.disabled) {
      &.active, &:hover {
        background-color: darken($color-text, 40%);
        border-color: $color-text;
      }
    }
    &.google {
      font-weight: 600;
      background: linear-gradient(to bottom, #dd4a36, darken(#dd4a36, 10%));
      color: lighten(#dd4a36, 40%);
      &:hover:not(.disabled) {
        background-color: darken(#c93737, 35%);
        border-color: #c93737;
      }
    }
    &.facebook {
      font-weight: 600;
      background: linear-gradient(to bottom, #7289da, darken(#7289da, 10%));
      color: lighten(#7289da, 40%);
      &:hover:not(.disabled) {
        background-color: darken(#7289da, 35%);
        border-color: #7289da;
      }
    }
  }

  .header-style {
    padding: 10px;
    color: $color-text;
    font-size: 16px;
    font-weight: 600;
    @include transition('color', .2s, ease);
    &:hover, &.active { color: lighten($color-text, 20%); }
  }

  .account-style {
    padding: 4px 8px;
    color: $color-text;
    font-size: 16px;
    font-weight: 600;
    @include transition('color', .2s, ease);
    &:hover, &.active { color: lighten($color-text, 20%); }
  }

  .dropdown-style {
    padding: 8px 12px;
    color: $color-text;
    font-size: 14px;
    font-weight: 600;
    @include transition('background-color, color', .4s, ease);
    .text { @include transition('padding', .2s, ease); }
    &:hover, &.active {
      background-color: darken($map-stroke-color, 7.5%);
      color: lighten($color-text, 20%);
      .text { padding-left: 5px; }
    }
  }

  .menu-style {
    flex: 1;
    padding: 10px;
    font-size: 20px;
    font-weight: 600;
    border-radius: 4px;
    @include transition('color, backgroundcolor', .2s, ease);
    &:hover, &.active { color: lighten($color-text, 20%); }
    &.active { background-color: rgba($color-text, .2); }
  }
}
</style>
