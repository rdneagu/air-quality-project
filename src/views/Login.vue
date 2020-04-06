<template>
  <div class="login">
    <div class="form-wrapper">
      <Logo />
      <form class="login-form">
        <div class="title">{{ form.title }}</div>
        <section class="fields">
          <div v-for="(input, id) in form.input" :key="id" :id="formatInputId(id)" class="input-wrapper" :class="[ hasFailed(input) ]">
            <label :for="id">
              <Icon :name="input.icon" />
              <span class="label">{{ input.placeholder }}</span>
            </label>
            <input :id="id" :type="input.type" :name="id" v-model="input.model" />
            <Icon v-if="input.error" class="error" name="warning" v-tooltip="{ type: 'alert', text: input.error }"></Icon>
          </div>
        </section>
        <section class="form-control">
          <Button v-for="(button, id) in form.control" :key="id" :type="button.type" :icon="button.icon" :click="button.click">{{ button.text }}</Button>
        </section>
      </form>
    </div>
  </div>
</template>

<script>
import Logo from '../components/Logo.component.vue';
import Icon from '../components/Icon.component.vue';
import Button from '../components/Button.component.vue';

export default {
  components: { Logo, Icon, Button },
  data() {
    return {
      form: {
        title: 'Authenticate',
        action: '/users/login',
        input: {
          username: { icon: 'person', type: 'text', placeholder: 'USERNAME' },
          password: { icon: 'lock', type: 'password', placeholder: 'PASSWORD' },
        },
        control: [
          { text: 'Login', icon: 'circle-right', type: 'dialog', click: this.submit.bind(null) },
        ],
      },
    };
  },
  methods: {
    /**
     * Formats the input element class based on the id passed in
     *
     * @param {String} id             - The id of the input
     * @returns {String}  The formatted input class name
     */
    formatInputId(id) {
      return `input-${id}`;
    },
    /**
     * Returns a special input element class name if the field has failed the validation checks
     *
     * @param {String} field          - Field name to check
     * @returns {String}  The input class name
     */
    hasFailed(field) {
      return (field.error) ? 'failed' : null;
    },
    /**
     * Submits the active form data to the server
     */
    async submit() {
      // this.clean();
      // const data = this.prepareInputData();
      // // Submit the form data
      // const response = await axios.post(this.getForm.action, data);
      // // Format the input errors if there are any
      // if (response.data.error) {
      //   _.forEach(response.data.error, (error, field) => {
      //     this.$set(this.getForm.input[field], 'error', error[0]);
      //   });
      // } else {
      //   const { step } = this.forms.recovery;
      //   switch (this.form) {
      //     case 'register': this.getForm.success(data.username); break;
      //     case 'login': this.getForm.success(response.data.result); break;
      //     case 'recovery': this.getForm.success(step); break;
      //     default: break;
      //   }
      // }
    },
  },
};
</script>

<style lang="scss">
@import '~@/scss/_mixins';

#app .login {
  display: flex;
  align-items: center;
  justify-content: center;

  .logo {
    font-size: 64px;
  }
  .login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    margin: 40px 0;
    border-radius: 5px;
    box-shadow: 0 0 8px rgba($map-fill-color, .8);
    background: linear-gradient(to bottom, darken($map-stroke-color, 8%), darken($map-stroke-color, 7%), darken($map-stroke-color, 8%));
    .title {
      font-size: 24px;
      font-weight: 700;
    }
    .fields {
      display: flex;
      flex-direction: column;
      margin: 40px 0;
      width: 70%;
      .input-wrapper {
        display: flex;
        flex-direction: column;
        font-size: 20px;
        margin: 5px 0;
        label {
          display: flex;
          align-items: center;
          padding-bottom: 4px;
          border-bottom: 2px solid $map-fill-color;
          font-size: 16px;
          font-weight: 700;
          .icon { margin-right: 5px; }
        }
        input {
          border: none;
          min-width: 50px;
          padding: 6px 25px;
          color: $color-text;
          border-radius: 0 0 4px 4px;
          background-color: rgba($color-text, .05);
          @include transition('background-color, text-shadow, box-shadow', 200ms, ease);
          // @include setPlaceholder($color-text);
          &:hover { background-color: rgba($color-text, .1); }
          &:focus {
            background-color: rgba($color-text, .1);
            text-shadow: 0 0 2px $color-text;
            box-shadow: 0 0 15px rgba($color-text, .1) inset;
          }
          outline: none;
          overflow: hidden;
        }
      }
    }
    .control .button {
      font-size: 16px;
      padding: 10px 20px;
    }
  }
}

</style>
