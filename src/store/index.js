import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selected: {},
    sidebar: {
      visible: false,
    },
    map: {
      aqi: {
        smart: { color: '#008000' },
        h: { color: '#ff0000' },
        p: { color: '#800000' },
        w: { color: '#ffff00' },
        t: { color: '#808000' },
        pm25: { color: '#00ff00' },
        pm10: { color: '#00ffff' },
        dew: { color: '#008080' },
        wg: { color: '#0000ff' },
        so2: { color: '#000080' },
        no2: { color: '#002366' },
        o3: { color: '#ff00ff' },
        co: { color: '#800080' },
        r: { color: '#784212' },
        wd: { color: '#ff5733' },
        uvi: { color: '#ff6fee' },
        mepaqi: { color: '#c0392b' },
        active: [],
      },
      // API data
      data: {
        active: undefined,
        world: [],
        country: {},
      },
      mouseover: undefined,
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
    //
    getMouseoverRegion: (state) => state.map.mouseover,
    // AQI related getters
    getAQIKeys: (state) => _.keys(state.map.aqi),
    getAQIColor: (state) => (aqi) => state.map.aqi[aqi].color,
    getAQIHeatColor: (state, getters) => (aqi, val) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(state.map.aqi[aqi].color);
      const { min, max } = getters.getAQIMinMax(aqi);
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
    getAQIMinMax: (state) => (aqi) => state.map.aqi[aqi],
    getActiveAQI: (state) => state.map.aqi.list,
    // Map data related getters
    getActiveData: (state) => state.map.data.active,
    getWorldData: (state) => state.map.data.world,
    getCountryData: (state) => (country) => state.map.data.country[country],
  },
  mutations: {
    setSelected(state, { id, item }) {
      Vue.set(state.selected, id, item);
    },
    toggleSidebar(state) {
      Vue.set(state.sidebar, 'visible', !state.sidebar.visible);
    },
    setCache(state, { name, data }) {
      const cache = {
        data,
        ts: Date.now() + 3600000,
      };
      Vue.set(state.cache, name, cache);
    },
    //
    setMouseoverRegion(state, { id }) {
      Vue.set(state.map, 'mouseover', id);
    },
    // AQI related mutations
    setAQIMinMax(state, { aqi, min, max }) {
      Vue.set(state.map.aqi, aqi, { ...state.map.aqi[aqi], min, max });
    },
    setActiveAQI(state, { list }) {
      Vue.set(state.map.aqi, 'list', list);
    },
    // Map data related mutations
    setActiveData(state, { data }) {
      Vue.set(state.map.data, 'active', data);
    },
    setWorldData(state, { data }) {
      Vue.set(state.map.data, 'world', data);
    },
    setCountryData(state, { country, data }) {
      Vue.set(state.map.data.country, country, data);
    },
  },
  actions: {
  },
  modules: {
  },
});
