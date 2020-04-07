<template>
  <router-link v-if="name && href && !disabled" :to="href" class="icon-wrapper">
    <img v-if="img" :src="getImage" :class="[ getIcon ]" />
    <i v-else class="icon" :class="[ getIcon, isPointer ]"></i>
  </router-link>
  <div v-else-if="name" class="icon-wrapper" :class="[ isDisabled ]" @click="OnIconClick">
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
    OnIconClick(evt) {
      if (this.disabled || typeof (this.click) !== 'function') return false;

      evt.stopPropagation();
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
    url('../assets/fonts/icon-aqp.ttf?ynh86t') format('truetype'),
    url('../assets/fonts/icon-aqp.woff?ynh86t') format('woff'),
    url('../assets/fonts/icon-aqp.svg?ynh86t#icon-aqp') format('svg');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
.icon {
  /* use !important to prevent issues with browser extensions that change fonts */
  display: flex;
  align-items: center;
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

.icon-spinner-aqp:before, .icon-spinner-2-aqp:before {
  animation: Spin 1s linear infinite;
  text-shadow: 0 0 2px #000;
}
.icon-spinner-2-aqp:before {
  content: "\e91e";
}
.icon-spinner-aqp:before {
  content: "\e91f";
}
.icon-phone-aqp:before {
  content: "\e91d";
}
.icon-warning-aqp:before {
  content: "\e91c";
}
.icon-circle-left-aqp:before {
  content: "\e918";
}
.icon-circle-down-aqp:before {
  content: "\e919";
}
.icon-circle-right-aqp:before {
  content: "\e91a";
}
.icon-circle-up-aqp:before {
  content: "\e91b";
}
.icon-mail-aqp:before {
  content: "\e917";
}
.icon-lock-aqp:before {
  content: "\e916";
}
.icon-login-aqp:before {
  content: "\e913";
}
.icon-person_add-aqp:before {
  content: "\e914";
}
.icon-person-aqp:before {
  content: "\e915";
}
.icon-arrow_dr-aqp, .icon-arrow_dl-aqp, .icon-arrow_du-aqp, .icon-arrow_dd-aqp { font-size: 1.8em; }
.icon-arrow_dr-aqp:before {
  content: "\e90f";
}
.icon-arrow_dl-aqp:before {
  content: "\e910";
}
.icon-arrow_du-aqp:before {
  content: "\e911";
}
.icon-arrow_dd-aqp:before {
  content: "\e912";
}
.icon-leaf-2-aqp:before {
  content: "\e90e";
}
.icon-leaf-aqp:before {
  content: "\e90d";
}
.icon-cloud-aqp:before {
  content: "\e90c";
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

@keyframes Spin {
  from { transform: rotate(0); }
  to { transform: rotate(360deg); }
}
</style>
