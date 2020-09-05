<template>
  <div>
    <Form ref="formRegister" :model="formRegister" :rules="ruleRegister">
      <FormItem prop="username">
        <Input v-model="formRegister.username" type="text" :placeholder="$t('m.RegisterUsername')" size="large" @on-enter="handleRegister" />
        <Icon slot="prepend" type="ios-person-outline" />
      </FormItem>
      <FormItem prop="email">
        <Input v-model="formRegister.email" :placeholder="$t('m.Email_Address')" size="large" @on-enter="handleRegister" />
        <Icon slot="prepend" type="ios-email-outline" />
      </FormItem>
      <FormItem prop="password">
        <Input v-model="formRegister.password" type="password" :placeholder="$t('m.RegisterPassword')" size="large" @on-enter="handleRegister" />
        <Icon slot="prepend" type="ios-locked-outline" />
      </FormItem>
      <FormItem prop="passwordAgain">
        <Input v-model="formRegister.passwordAgain" type="password" :placeholder="$t('m.Password_Again')" size="large" @on-enter="handleRegister" />
        <Icon slot="prepend" type="ios-locked-outline" />
      </FormItem>
      <FormItem prop="captcha" style="margin-bottom:10px">
        <div class="oj-captcha">
          <div class="oj-captcha-code">
            <Input v-model="formRegister.captcha" :placeholder="$t('m.Captcha')" size="large" @on-enter="handleRegister" />
            <Icon slot="prepend" type="ios-lightbulb-outline" />
          </div>
          <div class="oj-captcha-img">
            <Tooltip content="Click to refresh" placement="top">
              <Identity :identify-code="identifyCode" @click.native="refreshCode" />
            </Tooltip>
          </div>
        </div>
      </FormItem>
    </Form>
    <div class="footer">
      <Button
        type="primary"
        class="btn"
        long
        :loading="btnRegisterLoading"
        @click="handleRegister">
        {{ $t('m.UserRegister') }}
      </Button>
      <Button
        class="btn"
        type="ghost"
        long
        @click="switchMode('login')">
        {{ $t('m.Already_Registed') }}
      </Button>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import api from '@oj/api'
  import { FormMixin } from '@oj/components/mixins'
  import Identity from './../../components/Identify'
  export default {
    components: {
      Identity
    },
    mixins: [FormMixin],
    data () {
      const CheckPassword = (rule, value, callback) => {
        if (!this.formRegister.password || this.formRegister.password.length < 6) {
          callback(new Error('passwordAgain'))
        }
        callback()
      }

      const CheckCaptcha = (rule, value, callback) => {
        if (this.formRegister.captcha !== this.identifyCode) {
          callback(new Error('captchaAgain'))
        }
        callback()
      }

      const CheckAgainPassword = (rule, value, callback) => {
        if (!(!!this.formRegister.passwordAgain && this.formRegister.passwordAgain === this.formRegister.password)) {
          callback(new Error(this.$i18n.t('m.password_does_not_match')))
        }
        callback()
      }

      return {
        btnRegisterLoading: false,
        identifyCodes: '1234567890',
        identifyCode: '',
        formRegister: {
          username: '',
          password: '',
          passwordAgain: '',
          email: '',
          captcha: ''
        },
        ruleRegister: {
          username: [
            { required: true, trigger: 'blur' }
          ],
          email: [
            { required: true, type: 'email', trigger: 'blur' }
          ],
          password: [
            { required: true, trigger: 'blur', min: 6, max: 20 },
            { validator: CheckPassword, trigger: 'blur' }
          ],
          passwordAgain: [
            { required: true, validator: CheckAgainPassword, trigger: 'change' }
          ],
          captcha: [
            { required: true, trigger: 'blur', min: 4, max: 10 },
            { validator: CheckCaptcha, trigger: 'blue' }
          ]
        }
      }
    },
    mounted () {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    methods: {
      ...mapActions(['changeModalStatus']),
      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
      },
      refreshCode () {
        this.identifyCode = ''
        this.makeCode(this.identifyCodes, 4)
      },
      makeCode(o, l) {
        for (let i = 0; i < l; i++) {
          this.identifyCode += this.identifyCodes[
            this.randomNum(0, this.identifyCodes.length)
          ]
        }
      },
      switchMode (mode) {
        this.changeModalStatus({
          mode,
          visible: true
        })
      },
      handleRegister () {
        this.validateForm('formRegister').then(valid => {
          const formData = Object.assign({}, this.formRegister)
          delete formData['passwordAgain']
          this.btnRegisterLoading = true
          api.register(formData).then(res => {
            this.$success(this.$i18n.t('m.Thanks_for_registering'))
            this.switchMode('login')
            this.btnRegisterLoading = false
          }, _ => {
            this.refreshCode()
            this.formRegister.captcha = ''
            this.btnRegisterLoading = false
          })
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .footer {
    overflow: auto;
    margin-top: 20px;
    margin-bottom: -15px;
    text-align: left;
    .btn {
      margin: 0 0 15px 0;
      &:last-child {
        margin: 0;
      }
    }
  }
</style>
<style>
  .code {
    margin: 400px auto;
    width: 114px;
    height: 40px;
    border: 1px solid red;
  }
</style>
