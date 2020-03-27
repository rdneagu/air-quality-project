import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    colors: {
      aqi: {
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
      aqis: {},
      world: {},
      country: {},
    },
    cache: {},
  },
  getters: {
    getSidebarVisibility: (state) => state.sidebar.visible,
    getSelected: (state) => (id) => state.selected[id],
    getCache: (state) => (name) => {
      if (state.cache[name] && state.cache[name].ts > Date.now()) return state.cache[name];
      return false;
    },
    getAQIColor: (state) => (aqi) => state.colors.aqi[aqi],
    getAQIHeatColor: (state) => (val, min, max) => {
      const filter = state.selected.filter || 'smart';
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(state.colors.aqi[filter]);

      const intensity = (val - min) / (max - min);
      const lower = 1 - intensity;
      const upper = intensity;
      const color = {
        r: Math.floor(0x00 * lower + parseInt(result[1], 16) * upper),
        g: Math.floor(0x00 * lower + parseInt(result[2], 16) * upper),
        b: Math.floor(0x00 * lower + parseInt(result[3], 16) * upper),
      };
      return `rgb(${color.r}, ${color.g}, ${color.b})`;
    },
  },
  mutations: {
    setSelected(state, { id, item }) {
      Vue.set(state.selected, id, item);
    },
    toggleSidebar(state) {
      state.sidebar.visible = !state.sidebar.visible;
    },
    setCache(state, { name, data }) {
      const cache = {
        data,
        ts: Date.now() + 3600000,
      };
      Vue.set(state.cache, name, cache);
    },
  },
  actions: {
  },
  modules: {
  },
});
