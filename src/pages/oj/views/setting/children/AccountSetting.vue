<template>
  <div class="setting-main">
    <div class="flex-container">
      <div class="left">
        <p class="section-title">{{ $t('m.ChangePassword') }}</p>
        <Form ref="formPassword" :model="formPassword" :rules="rulePassword" class="setting-content">
          <FormItem label="Old Password" prop="old_password">
            <Input v-model="formPassword.old_password" type="password" />
          </FormItem>
          <FormItem label="New Password" prop="new_password">
            <Input v-model="formPassword.new_password" type="password" />
          </FormItem>
          <FormItem label="Confirm New Password" prop="again_password">
            <Input v-model="formPassword.again_password" type="password" />
          </FormItem>
          <FormItem v-if="visible.tfaRequired" label="Two Factor Auth" prop="tfa_code">
            <Input v-model="formPassword.tfa_code" />
          </FormItem>
          <FormItem v-if="visible.passwordAlert">
            <Alert type="success">{{ $t('m.Update_Success_Password') }}</Alert>
          </FormItem>
          <Button type="primary" @click="changePassword">{{ $t('m.Update_Password') }}</Button>
        </Form>
      </div>

      <div class="middle separator" />

      <div class="right">
        <p class="section-title">{{ $t('m.ChangeEmail') }}</p>
        <Form ref="formEmail" :model="formEmail" :rules="ruleEmail" class="setting-content">
          <FormItem label="Current Password" prop="password">
            <Input v-model="formEmail.password" type="password" />
          </FormItem>
          <FormItem label="Old Email">
            <Input v-model="formEmail.old_email" disabled />
          </FormItem>
          <FormItem label="New Email" prop="new_email">
            <Input v-model="formEmail.new_email" />
          </FormItem>
          <FormItem v-if="visible.tfaRequired" label="Two Factor Auth" prop="tfa_code">
            <Input v-model="formEmail.tfa_code" />
          </FormItem>
          <Button type="primary" @click="changeEmail">{{ $t('m.ChangeEmail') }}</Button>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@oj/api'
  import { FormMixin } from '@oj/components/mixins'
  import { mapGetters } from 'vuex'

  export default {
    mixins: [FormMixin],
    data () {
      const oldPasswordCheck = [{ required: true, trigger: 'blur', min: 1, max: 20 }]
      const tfaCheck = [{ required: true, trigger: 'change' }]
      const CheckAgainPassword = (rule, value, callback) => {
        if (value !== this.formPassword.new_password) {
          callback(new Error(this.$t('m.Update_Not_Match_Password')))
        }
        callback()
      }
      const CheckNewPassword = (rule, value, callback) => {
        if (this.formPassword.old_password !== '') {
          if (this.formPassword.old_password === this.formPassword.new_password) {
            callback(new Error(this.$t('m.Update_Not_Change_Password')))
          } else {
            // 对第二个密码框再次验证
            this.$refs.formPassword.validateField(this.$t('m.Update_Again_Password'))
          }
        }
        callback()
      }
      return {
        loading: {
          btnPassword: false,
          btnEmail: false
        },
        visible: {
          passwordAlert: false,
          emailAlert: false,
          tfaRequired: false
        },
        formPassword: {
          tfa_code: '',
          old_password: '',
          new_password: '',
          again_password: ''
        },
        formEmail: {
          tfa_code: '',
          password: '',
          old_email: '',
          new_email: ''
        },
        rulePassword: {
          old_password: oldPasswordCheck,
          new_password: [
            { required: true, trigger: 'blur', min: 1, max: 20 },
            { validator: CheckNewPassword, trigger: 'blur' }
          ],
          again_password: [
            { required: true, validator: CheckAgainPassword, trigger: 'change' }
          ],
          tfa_code: tfaCheck
        },
        ruleEmail: {
          password: oldPasswordCheck,
          new_email: [{ required: true, type: 'email', trigger: 'change' }],
          tfa_code: tfaCheck
        }
      }
    },
    computed: {
      ...mapGetters({
        profile: 'user/profile'
      })
    },
    watch: {
      'profile': {
        handler: function (newVal, oldVal) {
          this.formEmail.old_email = newVal.email
        }
      }
    },
    mounted () {
      this.formEmail.old_email = this.profile.email || ''
    },
    methods: {
      changePassword () {
        this.validateForm('formPassword').then(valid => {
          this.loading.btnPassword = true
          const data = Object.assign({}, this.formPassword)
          delete data.again_password
          if (!this.visible.tfaRequired) {
            delete data.tfa_code
          }
          const idata = {
            oldPassword: data.old_password,
            newPassword: data.new_password
          }
          api.changePassword(idata).then(res => {
            this.loading.btnPassword = false
            this.visible.passwordAlert = true
            this.$success('Update password successfully')
            setTimeout(() => {
              this.visible.passwordAlert = false
              this.$router.push({ name: 'logout' })
            }, 5000)
          }, res => {
            if (res.data.data === 'tfa_required') {
              this.visible.tfaRequired = true
            }
            this.loading.btnPassword = false
          })
        })
      },
      changeEmail () {
        this.validateForm('formEmail').then(valid => {
          this.loading.btnEmail = true
          const data = Object.assign({}, this.formEmail)
          if (!this.visible.tfaRequired) {
            delete data.tfa_code
          }
          const idata = {
            oldEmail: data.old_email,
            newEmail: data.new_email
          }
          api.changeEmail(idata).then(res => {
            this.loading.btnEmail = false
            this.visible.emailAlert = true
            this.$success('Change email successfully')
            this.$refs.formEmail.resetFields()
            this.$store.dispatch('user/getProfile')
          }, res => {
            if (res.data.data === 'tfa_required') {
              this.visible.tfaRequired = true
            }
          })
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  /deep/.ivu-form .ivu-form-item-label {
    color: var(--font-color-white);
  }
  /deep/.ivu-input {
    background: var(--setting-profile-input-bg-color);
    color: var(--font-setting-profile-color);
  }
  .flex-container {
    justify-content: flex-start;
    .left {
      flex: 1 0;
      width: 250px;
      padding-right: 5%;
    }
    > .middle {
      flex: none;
    }
    .right {
      flex: 1 0;
      width: 250px;
    }
  }
</style>

