<template>
  <header v-tutorial="tutorial.map">
    <Logo v-tutorial="tutorial.logo"></Logo>
    <div class="navbar"></div>
    <div class="navicon">
      <Button :class="[ shine ]" icon="refresh" type="menu" :click="restartTutorial" v-tutorial="tutorial.restart"></Button>
    </div>
    <div class="account">
      <Button v-bind="account" v-tutorial="tutorial.account"></Button>
    </div>
  </header>
</template>

<script>
import Logo from '@/components/Logo.component.vue';
import Button from '@/components/Button.component.vue';

export default {
  components: { Logo, Button },
  data() {
    return {
      tutorial: {
        logo: {
          step: 14,
          text: 'Click on the logo whenever you want to return to the home page',
          pos: 'left',
        },
        account: {
          step: 15,
          text: 'Here you can manage your account',
          pos: 'right',
        },
        map: {
          step: 16,
          text: 'Remember that our map is completely interactive! You can use your cursor to navigate around'
           + '<br />* Dragging the map around will let you change the current view position'
           + '<br />* Scrolling up and down will let you zoom in and out'
           + '<br />* Clicking on any region will warp to that region and load the subunits',
          pos: 'top',
        },
        restart: {
          step: 17,
          text: 'If you missed anything in the tutorial, clicking this button will reset it to the beginning',
          pos: 'right',
        },
      },
      account: {
        name: 'account',
        icon: 'arrow_dd',
        text: 'My Account',
        type: 'inversed account',
        dropdown: {
          id: 'account',
          ignoreSelection: true,
          style: 'account',
          items: {
            login: { icon: 'person', text: 'Login', type: 'dropdown', href: { name: 'login' } },
            register: { icon: 'person_add', text: 'Register', type: 'dropdown', href: { name: 'register' } },
          },
        },
      },
    };
  },
  computed: {
    shine() {
      return (this.tutorial.restart.step === this.$store.getters.getTutorialAt) ? 'shine' : null;
    },
  },
  methods: {
    restartTutorial() {
      this.$store.commit('setTutorialAt', 1);
    },
  },
};
</script>

<style lang="scss">
header {
  position: relative;
  grid-area: header;
  align-self: center;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  grid-template-rows: auto;
  align-items: center;
  padding: 0 20px;
  margin-top: 10px;
  .navicon {
    margin: 0 40px;
    .button.menu-style { font-size: 24px; }
    .shine { animation: shine 1.5s ease-in-out infinite; }
  }
}

@keyframes shine {
  0% { text-shadow: 0 0 0 $color-text; }
  50% {
    text-shadow: 0 0 10px lighten($color-text, 20%), 0 0 5px lighten($color-text, 20%), 0 0 2px lighten($color-text, 20%);
    color: lighten($color-text, 20%)
  }
  100% { text-shadow: 0 0 0 $color-text; }
}
</style>
