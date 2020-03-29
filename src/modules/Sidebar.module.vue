<template>
  <transition name="sidebar-slide" appear>
    <div v-show="$store.getters.getSidebarVisibility" class="sidebar-wrapper">
      <div class="class">test123</div>
    </div>
  </transition>
</template>

<script>
export default {
  computed: {
    getActiveAQI() {
      return this.$store.getters.getSelected('filter') || 'smart';
    },
    getAQIColor() {
      return this.$store.getters.getAQIColor(this.getActiveAQI);
    },
  },
};
</script>

<style lang="scss">
@import '~@/scss/_mixins';

.sidebar-wrapper {
  grid-area: sidebar;
  background-color: $map-bg-color;
  border: 1px solid $map-stroke-color;
  border-right: none;
  width: 350px;
  overflow: hidden;
  transition: width .2s ease;
  > * { transition: opacity .2s ease .3s; }
}

.sidebar-slide-leave-to {
  transition: width .2s ease .3s;
  > * { transition: opacity .2s ease; }
}
.sidebar-slide-enter, .sidebar-slide-leave-to {
  width: 0;
  > * { opacity: 0; }
}

</style>
