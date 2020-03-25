import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    colors: {
      pollution: {
        smart: '#008000',
        h: '#ff0000',
        p: '#800000',
        w: '#ffff00',
        t: '#808000',
        pm25: '#00ff00',
        pm10: '#00ffff',
        dew: '#008080',
        wg: '#0000ff',
        so2: '#000080',
        no2: '#002366',
        o3: '#ff00ff',
        co: '#800080',
        r: '#784212',
        wd: '#ff5733',
        uvi: '#ff6fee',
        mepaqi: '#c0392b',
      },
    },
    selected: {},
    sidebar: {
      visible: false,
    },
    map: {
      model: undefined,
    },
  },
  getters: {
    getSidebarVisibility: (state) => state.sidebar.visible,
    getSelected: (state) => (id) => state.selected[id],
  },
  mutations: {
    updateSelected(state, { id, item }) {
      Vue.set(state.selected, id, item);
    },
    toggleSidebar(state) {
      state.sidebar.visible = !state.sidebar.visible;
    },
  },
  actions: {
  },
  modules: {
  },
});
