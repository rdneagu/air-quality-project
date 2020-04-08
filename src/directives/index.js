import Vue from 'vue';

import tutorialDirective from './tutorial';
import tooltipDirective from './tooltip';

Vue.directive('tooltip', tooltipDirective);
Vue.directive('tutorial', tutorialDirective);
