<template>
  <div class="login">
    <div class="bg"></div>
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
  .bg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: url('../assets/images/login-bg.jpg') no-repeat center center / cover;
    opacity: .2;
    &:after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      background: $map-fill-color;
      mix-blend-mode: hard-light;
    }
  }

  .form-wrapper {
    position: relative;
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
          display: grid;
          grid-template-columns: 1fr auto;
          grid-template-rows: auto auto;
          grid-template-areas: "label label"
                              "field error";
          font-size: 20px;
          margin: 5px 0;
          label {
            grid-area: label;
            display: flex;
            align-items: center;
            padding-bottom: 4px;
            border-bottom: 2px solid $map-fill-color;
            font-size: 16px;
            font-weight: 700;
            .icon { margin-right: 5px; }
          }
          input {
            grid-area: field;
            border: none;
            min-width: 50px;
            padding: 6px 25px;
            color: $color-text;
            border-radius: 0 0 4px 4px;
            @include transition('background-color, text-shadow', 200ms, ease);
            &:hover { background-color: rgba($color-text, .1); }
            &:focus { text-shadow: 0 0 2px $color-text; }
            outline: none;
            overflow: hidden;
            background: none;
          }
          .error {
            grid-area: error;
            display: flex;
            align-items: center;
            padding: 0 6px 0 6px;
            align-self: center;
            font-size: 16px;
          }
          &.failed {
            label {
              color: $color-error;
              border-color: $color-error;
            }
            .error {
              font-size: 20px;
              color: $color-error;
              animation: .4s fxerror ease-in-out;
            }
            input {
              @include setPlaceholder($color-error);
              color: $color-error;
              border-color: $color-error;
              &:hover { background-color: rgba($color-error, .1); }
              &:focus { text-shadow: 0 0 2px $color-error; }
              &::selection {
                background-color: $color-error;
              }
            }
          }
        }
      }
      .control .button {
        font-size: 16px;
        padding: 10px 20px;
      }
    }
  }
}

</style>
