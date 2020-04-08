import Vue from 'vue';
import Vuex from 'vuex';

import * as am4core from '@amcharts/amcharts4/core';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selected: {},
    sidebar: {
      visible: false,
    },
    map: {
      overlay: false,
      aqi: {
        smart: { color: '#008000' },
        h: { color: '#ff0000' },
        p: { color: '#800000' },
        w: { color: '#ffff00' },
        pm25: { color: '#00ff00', alias: 'pm2.5' },
        pm10: { color: '#00ffff' },
        dew: { color: '#008080', effectInversed: true },
        so2: { color: '#000080' },
        no2: { color: '#002366' },
        o3: { color: '#ff00ff' },
        co: { color: '#800080' },
        wd: { color: '#ff5733' },
        uvi: { color: '#ff6fee' },
        active: [],
        dominent: 'pm25',
      },
      // API data
      data: {
        active: undefined,
        world: [],
        country: {},
      },
      mouseover: undefined,
      // Map state
      state: {
        initiating: true,
        loading: true,
      },
    },
    cache: {},
    tooltip: null,
    tutorial: {
      at: 0,
      steps: [undefined],
    },
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
    getAQIKeys: (state) => state.map.aqi,
    getAQIColor: (state) => (aqi) => state.map.aqi[aqi].color,
    getAQITextColor: (state, getters) => (aqi) => am4core.color(getters.getAQIColor(aqi)).lighten(0.5),
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
    getCurrentAQI: (state) => state.selected.filter || 'smart',
    getActiveAQI: (state) => state.map.aqi.active,
    getDominentAQI: (state) => state.map.aqi.dominent,
    // Map data related getters
    getActiveData: (state) => state.map.data.active,
    getWorldData: (state) => state.map.data.world,
    getCountryData: (state) => (country) => state.map.data.country[country],
    //
    getMapState: (state) => state.map.state,
    getMapOverlay: (state) => state.map.overlay,
    //
    getTooltip: (state) => state.tooltip,
    //
    getTutorialAt: (state) => state.tutorial.at,
    getTutorialSteps: (state) => state.tutorial.steps,
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
      Vue.set(state.map.aqi, 'active', list);
    },
    setDominentAQI(state, { aqi }) {
      Vue.set(state.map.aqi, 'dominent', aqi);
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
    //
    setMapState(state, payload) {
      Vue.set(state.map, 'state', { ...state.map.state, ...payload });
    },
    setMapOverlay(state, status) {
      Vue.set(state.map, 'overlay', status);
    },
    //
    showTooltip(state, tooltip) {
      state.tooltip = tooltip;
    },
    hideTooltip(state) {
      state.tooltip = null;
    },
    //
    setTutorialAt(state, payload) {
      const step = payload || (state.tutorial.at || 0) + 1;
      Vue.set(state.tutorial, 'at', step);
      Vue.$cookies.set('tutorial', step);
    },
    addTutorialStep(state, { step, text }) {
      state.tutorial.steps.splice(step, 0, text);
    },
  },
  actions: {
  },
  modules: {
  },
});
