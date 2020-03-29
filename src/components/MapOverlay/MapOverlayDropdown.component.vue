<template>
  <div v-if="items" class="map-overlay-dropdown" :id="getId" :class="[ disabled ]">
    <MapOverlayButton :icon="icon" :disabled="disabled" :clickity="toggleDropdown">{{ items[getSelected].text }}</MapOverlayButton>
    <transition @enter="dropdownEnter" @leave="dropdownLeave" appear>
      <div v-if="isVisible" class="dropdown">
        <MapOverlayButton v-for="(item, id) in items" :key="id" v-bind="item" :clickity="select.bind(null, id)">
          {{ item.text }}
          <template #filter>
            <div class="filter-color" :style="{ backgroundColor: item.filterColor }"></div>
          </template>
        </MapOverlayButton>
      </div>
    </transition>
  </div>
</template>

<script>
import _ from 'lodash';
import Velocity from 'velocity-animate';

import MapOverlayButton from './MapOverlayButton.component.vue';

function findDefault(items) {
  let defaultItem;
  _.forEach(items, (item, key) => {
    defaultItem = defaultItem || key;
    if (item.default) defaultItem = key;
  });
  return defaultItem;
}

export default {
  components: {
    MapOverlayButton,
  },
  props: ['id', 'icon', 'disabled', 'items', 'default'],
  data() {
    return {
      isVisible: false,
    };
  },
  created() {
    if (!this.getSelected) {
      this.$store.commit('setSelected', { id: this.id, item: findDefault(this.items) });
    }
  },
  computed: {
    getId() {
      return `dropdown-${this.id}`;
    },
    getSelected() {
      return this.$store.getters.getSelected(this.id);
    },
    isDisabled() {
      return (this.disabled) ? 'disabled' : false;
    },
  },
  methods: {
    getItemId(item) {
      return `${this.id}-${item}`;
    },
    select(item) {
      this.$store.commit('setSelected', { id: this.id, item });
      this.toggleDropdown();
    },
    toggleDropdown() {
      if (this.disabled) { return; }
      this.isVisible = !this.isVisible;
    },
    /**
     * Animation functions for enter and leave
     */
    dropdownEnter(el, done) {
      /* Auto determine the width of the dropdown menu */
      el.style.width = 'auto';
      const maxWidth = el.offsetWidth;
      el.style.width = 0; // eslint-disable-line
      Velocity(el, 'stop');
      Velocity(el.children, 'stop');
      Velocity(el, { width: maxWidth }, { easing: 'swing', duration: 200 });
      Velocity(el.children, { opacity: 1 }, { easing: 'swing', duration: 200, delay: 200, complete: done });
    },
    dropdownLeave(el, done) {
      Velocity(el, 'stop');
      Velocity(el.children, 'stop');
      Velocity(el.children, { opacity: 0 }, { easing: 'swing', duration: 200 });
      Velocity(el, { width: 0 }, { easing: 'swing', duration: 200, delay: 200, complete: done });
    },
  },
};
</script>

<style lang="scss">
.map-overlay-dropdown {
  position: relative;
  .dropdown {
    position: absolute;
    left: calc(100% + 10px);
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba($map-bg-color, .8);
    border: 1px solid $map-stroke-color;
    border-radius: 2px;
    padding: 0 4px;
    overflow: hidden;
    z-index: 2;
    .map-overlay-button {
      opacity: 0;
    }
  }
}
</style>
