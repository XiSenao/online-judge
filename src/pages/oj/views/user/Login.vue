<template>
  <div>
    <Form ref="formLogin" :model="formLogin" :rules="ruleLogin">
      <FormItem prop="username">
        <Input v-model="formLogin.username" type="text" :placeholder="$t('m.LoginUsername')" size="large" @on-enter="handleLogin" />
        <Icon slot="prepend" type="ios-person-outline" />
      </FormItem>
      <FormItem prop="password">
        <Input v-model="formLogin.password" type="password" :placeholder="$t('m.LoginPassword')" size="large" @on-enter="handleLogin" />
        <Icon slot="prepend" type="ios-locked-outline" />
      </FormItem>
    </Form>
    <div class="footer">
      <Button
        type="primary"
        class="btn"
        long
        :loading="btnLoginLoading"
        @click="handleLogin">
        {{ $t('m.UserLogin') }}
      </Button>
      <a @click.stop="handleBtnClick('register')">{{ $t('m.No_Account') }}</a>
      <a style="float: right" @click.stop="goResetPassword">{{ $t('m.Forget_Password') }}</a>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { FormMixin } from '@oj/components/mixins'

  export default {
    mixins: [FormMixin],
    data () {
      return {
        btnLoginLoading: false,
        formLogin: {
          username: '',
          password: ''
        },
        ruleLogin: {
          username: [
            { required: true, trigger: 'blur', min: 1, max: 15 }
          ],
          password: [
            { required: true, trigger: 'change', min: 1, max: 20 }
          ]
        }
      }
    },
    computed: {
      ...mapGetters(['modalStatus']),
      visible: {
        get () {
          return this.modalStatus.visible
        },
        set (value) {
          this.changeModalStatus({ visible: value })
        }
      }
    },
    methods: {
      ...mapActions({
        changeModalStatus: 'changeModalStatus'
      }),
      handleBtnClick (mode) {
        this.changeModalStatus({
          mode,
          visible: true
        })
      },
      handleLogin () {
        this.validateForm('formLogin').then(valid => {
          this.btnLoginLoading = true
          const formData = Object.assign({}, this.formLogin)
          this.$store.dispatch('user/login', formData)
            .then(res => {
              this.btnLoginLoading = false
              this.changeModalStatus({ visible: false })
              this.$success(this.$i18n.t('m.Welcome_back'))
            })
            .catch(res => {
              try {
                this.$error(res.data.message)
              } catch (e) {
                this.$error('Server Error.')
              } finally {
                this.btnLoginLoading = false
              }
            })
        })
      },
      goResetPassword () {
        this.changeModalStatus({ visible: false })
        this.$router.push({ name: 'apply-reset-password' })
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
