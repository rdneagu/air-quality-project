<template>
  <router-link v-if="name && href && !disabled" :to="href" class="icon-wrapper">
    <img v-if="img" :src="getImage" :class="[ getIcon ]" />
    <i v-else class="icon" :class="[ getIcon, isPointer ]"></i>
  </router-link>
  <div v-else-if="name" class="icon-wrapper" :class="[ isDisabled ]" @click.stop="OnIconClick">
    <img v-if="img" :src="getImage" :class="[ getIcon ]" />
    <i v-else class="icon" :class="[ getIcon, isPointer ]"></i>
  </div>
</template>

<script>
export default {
  props: ['name', 'disabled', 'click', 'href', 'img'],
  computed: {
    isDisabled() {
      return this.disabled ? 'disabled' : false;
    },
    isPointer() {
      return this.click || this.href ? 'pointer' : false;
    },
    getImage() {
      return require(`@/assets/images/${this.img}.png`); // eslint-disable-line
    },
    getIcon() {
      return `icon-${this.name}-aqp`;
    },
  },
  methods: {
    OnIconClick() {
      if (this.disabled || typeof (this.click) !== 'function') return false;
      return this.click();
    },
  },
};
</script>

<style lang="scss">
@import '~@/scss/_mixins';

@font-face {
  font-family: 'icon-aqp';
  src:
    url('../assets/fonts/icon-aqp.ttf?hnmce8') format('truetype'),
    url('../assets/fonts/icon-aqp.woff?hnmce8') format('woff'),
    url('../assets/fonts/icon-aqp.svg?hnmce8#icon-aqp') format('svg');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
.icon {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'icon-aqp' !important;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // @include transition(color, .2s, ease);
  // &.pointer:hover {
  //   color: lighten($color-text, 20%);
  //   cursor: pointer;
  // }
}
.icon-filter-card-aqp:before {
  content: "\e90b";
}
.icon-right-aqp:before {
  content: "\e90a";
}
.icon-left-aqp:before {
  content: "\e909";
}
.icon-refresh-aqp:before {
  content: "\e908";
}
.icon-zoom-out-aqp:before {
  content: "\e906";
}
.icon-zoom-in-aqp:before {
  content: "\e907";
}
.icon-maximize-aqp:before {
  content: "\e904";
}
.icon-minimize-aqp:before {
  content: "\e905";
}
.icon-remove-aqp:before {
  content: "\e903";
}
.icon-add-aqp:before {
  content: "\e901";
}
.icon-home-aqp:before {
  content: "\e902";
}
.icon-filter-aqp:before {
  content: "\e900";
}
</style>
