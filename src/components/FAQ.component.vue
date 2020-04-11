<template>
  <section class="faq" :class="[ name ]">
    <div class="title" :class="[ isExpandable ]" @click="toggleVisibility">{{ title }}</div>
    <transition @enter="slideEnter" @leave="slideLeave">
      <component v-if="visible" :is="getComponent(name)" class="content"></component>
    </transition>
    <FAQ v-for="(faq, k) in subfaq" :key="k" v-bind="faq" :n="getNested(k)" :title="`${getNested(k)}. ${faq.title}`" />
  </section>
</template>

<script>
import Velocity from 'velocity-animate';

export default {
  components: {
    FAQ: () => import('@/components/FAQ.component.vue'),
  },
  props: ['n', 'name', 'title', 'subfaq', 'disable'],
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    isExpandable() {
      return !this.disable ? 'expand' : null;
    },
  },
  methods: {
    toggleVisibility() {
      if (this.disable) { return; }
      this.$set(this, 'visible', !this.visible);
    },
    slideEnter(el, done) {
      el.style.height = 'auto';
      const height = el.offsetHeight;
      el.style.height = 0; // eslint-disable-line
      Velocity(el, 'stop');
      Velocity(el.children, 'stop');
      Velocity(el, { height }, { easing: 'swing', duration: 200 });
      Velocity(el.children, { opacity: 1 }, { easing: 'swing', duration: 200, delay: 200, complete: done });
    },
    slideLeave(el, done) {
      Velocity(el, 'stop');
      Velocity(el.children, 'stop');
      Velocity(el.children, { opacity: 0 }, { easing: 'swing', duration: 200 });
      Velocity(el, { height: 0 }, { easing: 'swing', duration: 200, delay: 200, complete: done });
    },
    getNested(n) {
      return `${this.n}.${n + 1}`;
    },
    getComponent(name) {
      try {
        const avatar = require(`@/components/PollutionFAQ/${name}.faq.vue`).default; // eslint-disable-line
        return avatar;
      } catch (e) {
        console.error(e);
      }
      return null;
    },
  },
};
</script>

<style lang="scss">
@import '~@/scss/_mixins';

.faq {
  position: relative;
  display: flex;
  flex-direction: column;
  padding-left: 40px;
  .title, .subtitle {
    @include disableSelect();
    font-size: 30px;
    font-weight: 700;
    padding: 5px 8px;
    border-radius: 4px;
    transition: background-color .2s ease;
    &.expand {
      cursor: pointer;
      &:hover { background-color: rgba($map-fill-color, .4); }
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 10px 0;
    padding-left: 40px;
    overflow: hidden;
    > * {
      opacity: 0;
    }
    ul {
      padding-left: 0;
      li {
        font-size: 18px;
        text-align: justify;
        list-style-type: none;
        margin: 2px 0;
        &:first-letter { font-weight: 700; }
      }
    }
    .faq-text {
      margin: 10px 0;
      font-size: 20px;
      text-align: justify;
      &:first-letter {
        margin-left: 40px;
        font-weight: 700;
      }
    }
  }
}
</style>
