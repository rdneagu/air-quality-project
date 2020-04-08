import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './directives';

const VueCookies = require('vue-cookies');

Vue.config.productionTip = false;

Vue.use(VueCookies);
Vue.$cookies.config('1y');

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
