<template>
  <header v-if="!isAuthScreen">
    <Logo></Logo>
    <div class="navigation"></div>
    <div class="account">
      <Button v-bind="account"></Button>
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
    isAuthScreen() {
      switch (this.$route.name) {
        case 'login':
        case 'register':
          return true;
        default:
          return false;
      }
    },
  },
};
</script>

<style lang="scss">
header {
  grid-area: header;
  align-self: center;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto;
  align-items: center;
  padding: 0 20px;
  // height: 60px;
}
</style>
