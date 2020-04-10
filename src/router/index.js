import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'Air Quality - World Map',
    },
  },
  {
    path: '/team',
    name: 'team',
    meta: {
      title: 'Air Quality - Project Team',
    },
    component: () => import('../views/Team.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Air Quality - Login',
    },
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      title: 'Air Quality - Register',
    },
    component: () => import('../views/Register.vue'),
  },
  {
    path: '*',
    name: '404',
    meta: {
      title: 'Air Quality - Page not found',
    },
    component: () => import('../views/404.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
