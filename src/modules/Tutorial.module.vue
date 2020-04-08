<template>
  <div v-if="isTutorialVisible" class="tutorial-vue"></div>
</template>

<script>
export default {
  computed: {
    isTutorialVisible() {
      return (this.$store.getters.getTutorialAt !== null && this.$store.getters.getTutorialAt <= this.$store.getters.getTutorialSteps.length);
    },
  },
  watch: {},
};
</script>

<style lang="scss">
@import '~@/scss/_mixins';

.tutorial-vue {
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>
