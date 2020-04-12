<template>
  <div class="profile">
    <div class="info">
      <div class="avatar">
        <Icon name="user-circle"></Icon>
      </div>
      <div class="username">{{ getUser.userName }}</div>
    </div>
    <div class="alerts">
      <div class="title">ALERTS</div>
      <div class="row email">
        <Icon name="mail"></Icon>
        <span>{{ getUser.email }}</span>
      </div>
      <div class="row number">
        <Icon name="phone_msg"></Icon>
        <span>{{ getUser.phoneNumber }}</span>
      </div>
      <div class="alerts-control">
        <Button v-bind="control.email" v-tooltip="tooltip.mail"></Button>
        <Button v-bind="control.sms" v-tooltip="tooltip.sms"></Button>
      </div>
    </div>
    <div class="control">
      <Button type="dropdown" icon="power_off" :click="deauthenticate.bind()">Log out</Button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

import Button from '../Button.component.vue';
import Icon from '../Icon.component.vue';

export default {
  components: { Icon, Button },
  data() {
    return {
      tooltip: {
        mail: { text: 'Test the e-mail service' },
        sms: { text: 'Test the SMS service (charges may apply)' },
      },
      control: {
        email: { text: 'Mail', icon: 'mail', type: 'bzard', click: this.sendEmail.bind() },
        sms: { text: 'SMS', icon: 'phone_msg', type: 'bzard', click: this.sendSMS.bind() },
      },
    };
  },
  computed: {
    getUser() {
      return this.$store.getters.getUser;
    },
  },
  methods: {
    deauthenticate() {
      this.$store.commit('setUser', null);
    },
    async sendEmail() {
      if (this.control.email.pending || !this.$store.getters.getUser) return;
      const data = {
        message: 'Hello, this is the email test alert you requested! Everything seems to work fine',
        address: this.$store.getters.getUser.email,
      };
      try {
        this.$set(this.control.email, 'pending', true);
        await axios.post('/email', data);
      } catch (e) {
        console.error(e);
      }
      this.$delete(this.control.email, 'pending');
    },
    async sendSMS() {
      if (this.control.sms.pending || !this.$store.getters.getUser) return;
      const data = {
        message: 'Hello, this is the SMS test alert you requested! Everything seems to work fine',
        address: this.$store.getters.getUser.phoneNumber,
      };
      try {
        this.$set(this.control.sms, 'pending', true);
        await axios.post('/text', data);
      } catch (e) {
        console.error(e);
      }
      this.$delete(this.control.sms, 'pending');
    },
  },
};
</script>

<style lang="scss">
.profile {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 250px !important;
  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px 0;
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 70px;
      height: 70px;
      border-radius: 100%;
      border: 1px solid $color-text;
      margin-bottom: 10px;
      .icon {
        font-size: 64px;
      }
    }
    .username {
      font-weight: 700;
    }
  }
  .title {
    font-weight: 700;
    border-bottom: 1px solid $color-text;
    margin: 2px 0 8px 0;
    padding: 2px 4px;
  }
  .alerts {
    display: flex;
    flex-direction: column;
    margin: 0 10px;
    border-bottom: 1px solid $color-text;
    .row {
      display: flex;
      align-items: center;
      padding: 0 4px;
      margin: 2px 0;
      word-break: break-all;
      .icon-wrapper { font-size: 20px; margin-right: 10px; }
      span {
        font-weight: 600;
      }
    }
    .alerts-control {
      display: flex;
      justify-content: center;
      margin: 10px 0;
      .button {
        margin: 0 5px;
      }
    }
  }
  .control {
    margin-top: 10px;
  }
}
</style>
