<template>
  <transition @enter="dropdownEnter" @leave="dropdownLeave" @afterEnter="dropdownAfterEnter" appear>
    <div v-show="dropdown.visible" class="dropdown-vue" :class="[ dropdown.style ]">
      <div :id="getId" class="dropdown">
        <Button v-for="(item, id) in dropdown.items" :key="id" v-bind="item" :name="getItemName(id)" :clickity="select.bind(null, id)">{{ item.text }}</Button>
      </div>
    </div>
  </transition>
</template>

<script>
import Velocity from 'velocity-animate';
import util from '../lib/util';

export default {
  components: {
    Button: () => import('@/components/Button.component.vue'),
  },
  props: ['dropdown'],
  created() {
    if (!this.getSelected && !this.dropdown.ignoreSelection) {
      this.$store.commit('setSelected', { id: this.dropdown.id, item: util.findDefault(this.dropdown.items) });
    }
  },
  computed: {
    getId() {
      return `dropdown-${this.dropdown.id}`;
    },
    getSelected() {
      return this.$store.getters.getSelected(this.dropdown.id);
    },
  },
  methods: {
    getItemName(item) {
      return `${item}-${this.getId}`;
    },
    select(item) {
      this.$set(this.dropdown, 'visible', false);
      if (this.dropdown.ignoreSelection) return;

      this.$store.commit('setSelected', { id: this.dropdown.id, item });
    },
    /**
     * Animation functions for enter and leave
     */
    dropdownEnter(el, done) {
      /* Auto determine the height of the dropdown menu */
      [el] = el.children;
      el.style.height = 'auto';
      const maxHeight = Number.parseInt(el.style.maxHeight.substr(0, el.style.maxHeight.length - 2), 10);
      const height = (el.offsetHeight > maxHeight) ? maxHeight : el.offsetHeight;
      el.style.height = 0; // eslint-disable-line
      el.style.overflowY = 'hidden';
      Velocity(el, 'stop');
      Velocity(el.children, 'stop');
      Velocity(el, { height }, { easing: 'swing', duration: 200 });
      Velocity(el.children, { opacity: 1 }, { easing: 'swing', duration: 200, delay: 200, complete: done });
    },
    dropdownAfterEnter(el) {
      [el] = el.children;
      el.style.height = 'auto';
      el.style.overflowY = 'auto';
    },
    dropdownLeave(el, done) {
      [el] = el.children;
      el.style.overflowY = 'hidden';
      Velocity(el, 'stop');
      Velocity(el.children, 'stop');
      Velocity(el.children, { opacity: 0 }, { easing: 'swing', duration: 200 });
      Velocity(el, { height: 0 }, { easing: 'swing', duration: 200, delay: 200, complete: done });
    },
  },
};
</script>

<style lang="scss">
.dropdown-vue {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  padding-top: 10px;
  z-index: 5;
  &.account {
    width: 200px;
    top: 40px;
    left: unset;
    .dropdown {
      max-height: 400px;
    }
  }
  &:before {
    content: "";
    position: absolute;
    bottom: calc(100% - 10px);
    right: 18px;
    border-width: 0 6px 6px 6px;
    border-style: solid;
    border-color: darken($map-stroke-color, 10%) transparent;
  }
  .dropdown {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background-color: darken($map-stroke-color, 10%);
    border-radius: 4px;
    box-shadow: 0 0 20px #000;
    overflow-y: auto;
  }
}
</style>
