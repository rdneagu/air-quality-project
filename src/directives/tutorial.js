import Vue from 'vue';

import router from '../router';
import store from '../store';

import Tutorial from '../components/Tutorial.component.vue';

const tutorialDirective = {
  bind(el, binding) {
    if (!binding.value) return;
    const created = document.createElement('div');
    el.appendChild(created);

    const tutorial = Vue.observable({
      text: binding.value.text,
      pos: binding.value.pos,
      step: binding.value.step,
      next: () => {
        if (typeof (binding.value.next) === 'function') binding.value.next();
        setTimeout(() => {
          store.commit('setTutorialAt');
        }, 100);
      },
    });

    const tutorialComponent = Vue.extend(Tutorial);
    const instance = new tutorialComponent({
      propsData: tutorial,
      router,
      store,
    });
    instance.$mount(created);
    store.commit('addTutorialStep', { step: binding.value.step, text: binding.value.text });
  },
};

export default tutorialDirective;
