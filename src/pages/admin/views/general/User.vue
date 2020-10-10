<template>
  <div class="view">
    <icon-btn :disabled="showUser" name="User" icon="user" @click.native="exchangeIdentity('User')" />
    <icon-btn :disabled="!showUser" name="Admin" icon="user-circle" @click.native="exchangeIdentity('Admin')" />
    <icon-btn name="Add New Account" icon="plus" @click.native="showUserDialog = !showUserDialog" />
    <Panel :title="showUser ? $t('m.User_User') : 'Admin'">
      <div slot="header">
        <el-row :gutter="15" type="flex" justify="start" align="middle">
          <el-col v-show="selectedAll.length" :span="10">
            <icon-btn
              type="warning"
              icon="ban"
              name="Ban All Account"
              @click.native="toggleSelection('ban')"
              @dblclick.native="exchangeSelectedAccount" />
            <icon-btn
              type="warning"
              icon="refresh"
              name="Refresh All Account"
              @click.native="defineBatch='reflesh'"
              @dblclick.native="refreshSelectedAccount" />
            <icon-btn
              type="warning"
              icon="check-square-o"
              name="Renew All Account"
              @click.native="toggleSelection('renew')"
              @dblclick.native="exchangeSelectedAccount" />
          </el-col>
          <el-col :span="selectedAll.length ? 14 : 24">
            <el-input v-model="keyword" prefix-icon="el-icon-search" placeholder="Keywords" />
          </el-col>
        </el-row>
      </div>
      <el-table
        v-loading="loadingTable"
        ref="table"
        :data="showUser ? userList : adminList"
        element-loading-text="loading"
        style="width: 100%"
        @selection-change="selectedAll = arguments[0]">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="username" label="Username" />
        <el-table-column prop="crtTs" label="Create Time" width="180">
          <template slot-scope="scope">
            {{ scope.row.crtTs }}
          </template>
        </el-table-column>
        <el-table-column prop="lmTs" label="Last Modify" width="180">
          <template slot-scope="scope">
            {{ scope.row.lmTs }}
          </template>
        </el-table-column>
        <el-table-column v-if="!showUser" prop="description" label="Description" width="150" />
        <el-table-column v-if="showUser" prop="email" label="Email" width="180" />
        <el-table-column v-if="showUser" prop="rank" label="Rank" width="80" />
        <el-table-column v-if="showUser" prop="acNum" label="AC" width="80" />
        <el-table-column fixed="right" label="Option" width="200">
          <template slot-scope="{row}">
            <icon-btn name="Reset" icon="refresh" @click.native="resetPassword(row.username)" />
            <icon-btn :name="row.status ? 'Forbid' : 'Enable'" :icon="row.status ? 'ban' : 'check-square-o'" @click.native="exchangeAccountStatus(row.username, row.status)" />
          </template>
        </el-table-column>
      </el-table>
      <div class="panel-options">
        <el-pagination
          :page-size="pageSize"
          :total="total"
          class="page"
          layout="prev, pager, next"
          @current-change="currentChange"
        />
      </div>
    </Panel>
    <Panel v-show="showUser" :title="$t('m.Generate_User')">
      <el-form ref="formGenerateUser" :model="formGenerateUser">
        <el-row type="flex" justify="space-between">
          <el-col :span="4">
            <el-form-item label="Prefix" prop="prefix">
              <el-input v-model="formGenerateUser.prefix" placeholder="Prefix" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="Suffix" prop="suffix">
              <el-input v-model="formGenerateUser.suffix" placeholder="Suffix" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="Start Number" prop="number_from" required>
              <el-input-number v-model="formGenerateUser.number_from" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="End Number" prop="number_to" required>
              <el-input-number v-model="formGenerateUser.number_to" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="Password Length" prop="password_length" required>
              <el-input v-model="formGenerateUser.password_length" placeholder="Password Length" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <a id="downloadGenerateUsers" href="" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loadingGenerate" type="primary" icon="el-icon-fa-users" @click="generateUser">Generate & Export
          </el-button>
          <span
            v-if="formGenerateUser.number_from && formGenerateUser.number_to &&
            formGenerateUser.number_from <= formGenerateUser.number_to"
            class="userPreview">
            The usernames will be {{ formGenerateUser.prefix + formGenerateUser.number_from + formGenerateUser.suffix }},
            <span v-if="formGenerateUser.number_from + 1 < formGenerateUser.number_to">
              {{ formGenerateUser.prefix + (formGenerateUser.number_from + 1) + formGenerateUser.suffix + '...' }}
            </span>
            <span v-if="formGenerateUser.number_from + 1 <= formGenerateUser.number_to">
              {{ formGenerateUser.prefix + formGenerateUser.number_to + formGenerateUser.suffix }}
            </span>
          </span>
        </el-form-item>
      </el-form>
    </Panel>
    <!-- 创建新用户 -->
    <el-dialog :visible.sync="showUserDialog" :close-on-click-modal="false" title="Create New Account">
      <el-form ref="user" :model="user" label-width="120px" label-position="left">
        <el-row :gutter="20">
          <el-col :span="user.admin_type==='Regular User' ? 12 : 13">
            <el-form-item :label="$t('m.User_Username')" prop="username" required>
              <el-input v-model="user.username" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-show="user.admin_type==='Regular User'" :label="$t('m.User_Email')">
              <el-input v-model="user.email" />
            </el-form-item>
          </el-col>
          <el-col :span="user.admin_type==='Regular User' ? 12 : 13">
            <el-form-item :label="$t('m.User_New_Password')" required>
              <Poptip trigger="hover">
                <div slot="content">
                  <p style="font-weight: 900;">Strength:</p>
                  <span style="font-weight: 600; color: #42b983">Hight</span>
                  <span style="font-weight: 600; color: #dbd766; padding: 0 6px;">Middle</span>
                  <span style="font-weight: 600; color: #d97e7e">Week</span>
                </div>
                <input
                  v-model="user.password"
                  :style="`border-color: ${passwordStrength.COLOR}`"
                  :placeholder="$t('m.password')"
                  type="password"
                  class="el-input__inner"
                  @input="checkPasswordStrength">
              </Poptip>
            </el-form-item>
          </el-col>
          <el-col :span="user.admin_type==='Regular User' ? 12 : 13">
            <el-form-item :label="$t('m.User_Type')">
              <el-select v-model="user.admin_type">
                <el-option label="Regular User" value="Regular User" />
                <el-option label="Admin" value="Admin" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-show="user.admin_type!=='Regular User'" :label="'Description'">
              <el-input v-model="user.description" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <cancel @click.native="showUserDialog = false">Cancel</cancel>
        <save @click.native="saveAccountInfo()" />
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import api from '../../api.js'
  import { PAWSTRENGTH } from '@/utils/constants'
  export default {
    name: 'User',
    data () {
      return {
        passwordStrength: {},
        // 一页显示的用户数
        pageSize: 10,
        // 用户总数
        total: 0,
        // 管理员列表
        adminList: [],
        showAdminDialog: false,
        // 用户列表
        userList: [],
        uploadUsers: [],
        uploadUsersPage: [],
        uploadUsersCurrentPage: 1,
        uploadUsersPageSize: 15,
        // 批量操作
        defineBatch: '',
        // 搜索关键字
        keyword: '',
        // 是否显示用户对话框
        showUserDialog: false,
        // 当前用户model
        user: {
          admin_type: 'Regular User'
        },
        loadingTable: false,
        loadingGenerate: false,
        // 当前页码
        currentPage: 0,
        selectedAll: [],
        formGenerateUser: {
          prefix: '',
          suffix: '',
          number_from: 0,
          number_to: 0,
          password_length: 8
        },
        showUser: true
      }
    },
    computed: {
      selectedExchangeAccountStatus () {
        const ids = []
        for (const user of this.selectedAll) {
          ids.push({
            username: user.username,
            status: user.status ? 0 : 1
          })
        }
        return ids
      },
      selectedResetPasswordUserIDs () {
        const ids = []
        for (const user of this.selectedAll) {
          ids.push({
            username: user.username
          })
        }
        return ids
      }
    },
    watch: {
      'keyword' (newVal, oldVal) {
        this.currentChange(1)
      },
      'uploadUsersCurrentPage' (page) {
        this.uploadUsersPage = this.uploadUsers.slice((page - 1) * this.uploadUsersPageSize, page * this.uploadUsersPageSize)
      }
    },
    mounted () {
      this.getUserList(1)
    },
    methods: {
      checkPasswordStrength () {
        const password = this.user.password
        const regs = PAWSTRENGTH
        const length = regs.length
        for (let i = length - 1; i >= 0; --i) {
          const nowReg = regs[i]
          const reg = new RegExp(nowReg.REG)
          if (reg.test(password)) {
            this.passwordStrength = nowReg
            return
          }
        }
        this.passwordStrength = {
          COLOR: '#DCDFE6'
        }
      },
      exchangeIdentity (identity) {
        if (identity === 'User') {
          this.getUserList(1)
          this.showUser = true
        } else {
          this.getAdminList(1)
          this.showUser = false
        }
      },
      currentChange (page) {
        this.currentPage = page
        this.showUser ? this.getUserList(page) : this.getAdminList(page)
      },
      saveAccountInfo () {
        // 使用表单验证可能出现奇怪的现象
        if (!!this.user.password || !!this.user.username) {
          this.$error('Please fill in the required information')
          return
        }
        const nowRole = this.user.admin_type
        delete this.user.admin_type
        if (nowRole === 'Admin') {
          delete this.user.email
        } else {
          delete this.user.description
        }
        this.$refs.user.validate(valid => {
          api.addNewAccount(this.user, nowRole).then(res => {
            this.showUserDialog = false
            this.user = {
              admin_type: 'Regular User'
            }
            this.showUser = nowRole !== 'Admin'
            this.currentChange(this.currentPage)
          })
        })
      },
      // 获取管理员列表
      getAdminList (page) {
        this.loadingTable = true
        api.getAdminList(page, this.pageSize, this.keyword).then(res => {
          this.loadingTable = false
          this.total = res.data.data.total
          this.adminList = res.data.data.records
        }, res => {
          this.loadingTable = false
        })
      },
      // 获取用户列表
      getUserList (page) {
        this.loadingTable = true
        api.getUserList(page, this.pageSize, this.keyword).then(res => {
          this.loadingTable = false
          this.total = res.data.data.total
          this.userList = res.data.data.records
        }, res => {
          this.loadingTable = false
        })
      },
      exchangeAccountStatus (username, status) {
        status = status === 1 ? 0 : 1
        api.exchangeAccountStatus(username, status, this.showUser).then(res => {
          this.currentChange(this.currentPage)
        })
      },
      resetPassword (username) {
        api.resetPassword(username, this.showUser).then(res => {
          this.$success('重置成功')
        })
      },
      // 改变账户状态
      exchangeSelectedAccount () {
        const role = this.showUser ? 'User(s)' : 'Admin(s)'
        const nowValue = this.selectedExchangeAccountStatus
        var hint = []
        for (let i = 0; i < nowValue.length; ++i) {
          hint.push(nowValue[i].username)
        }
        hint = '[ ' + hint.toString() + ' ]'
        this.$confirm(
          ` 
            Sure to delete following ${role}? 
            ${hint}
            The associated resources created by Admin(s) will be deleted as well, like problem, contest, announcement, etc.`,
         'confirm', {
           type: 'warning'
         }).then(() => {
           const promiseQueue = []
           Object.keys(nowValue).forEach(res => {
             const value = nowValue[res]
             promiseQueue.push(api.exchangeAccountStatus(value.username, value.status, this.showUser))
           })
           Promise.all(promiseQueue).then(res => {
             this.currentChange(this.currentPage)
           })
         }, () => {})
      },
      // 重置账户密码
      refreshSelectedAccount () {
        const role = this.showUser ? 'User(s)' : 'Admin(s)'
        const nowValue = this.selectedResetPasswordUserIDs
        var hint = []
        for (let i = 0; i < nowValue.length; ++i) {
          hint.push(nowValue[i].username)
        }
        hint = '[ ' + hint.toString() + ' ]'
        this.$confirm(
          ` 
            Sure to reset following ${role}? 
            ${hint}
            the password will be converted to the initial value.`,
         'confirm', {
           type: 'warning'
         }).then(() => {
           const promiseQueue = []
           Object.keys(nowValue).forEach(res => {
             const value = nowValue[res]
             promiseQueue.push(api.resetPassword(value.username, this.showUser))
           })
           Promise.all(promiseQueue).then(res => {
             this.currentChange(this.currentPage)
           })
         })
      },
      handleSelectionChange (val) {
        this.selectedAll = val
      },
      generateUser () {
        this.$refs['formGenerateUser'].validate((valid) => {
          if (!valid) {
            this.$error('Please validate the error fields')
            return
          }
          this.loadingGenerate = true
          const formUsers = {
            endNumber: this.formGenerateUser.number_to,
            passwordLength: this.formGenerateUser.password_length,
            prefix: this.formGenerateUser.prefix,
            startNumber: this.formGenerateUser.number_from,
            suffix: this.formGenerateUser.suffix
          }
          api.generateUser(formUsers).then(res => {
            const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
            const reg = /;\w+=/
            const str = res.headers['content-disposition']
            const targetStr = str.match(reg)[0].length + str.match(reg).index
            const target = str.substring(targetStr)
            const targetName = target.substring(1, target.match(/.xlsx/).index)
            const fileName = targetName + '.xls'
            const linkNode = document.createElement('a')
            linkNode.download = fileName // a标签的download属性规定下载文件的名称
            linkNode.style.display = 'none'
            linkNode.href = window.URL.createObjectURL(blob) // 生成一个Blob URL
            document.body.appendChild(linkNode)
            linkNode.click() // 模拟在按钮上的一次鼠标单击
            URL.revokeObjectURL(linkNode.href) // 释放URL对象
            document.body.removeChild(linkNode)
            this.getUserList(this.currentPage)
            this.loadingGenerate = false
          }).catch(_ => {
            this.loadingGenerate = false
          })
        })
      },
      // 切换选择
      toggleSelection (defineBatch) {
        const rows = this.selectedAll
        const table = []
        this.defineBatch = defineBatch
        if (rows.length) {
          for (let i = 0; i < rows.length; ++i) {
            const nowValue = rows[i]
            table.push(nowValue)
            if (this.defineBatch === 'ban' && !!nowValue.status || this.defineBatch === 'renew' && !nowValue.status) {
              table.pop()
              continue
            }
            this.$refs.table.toggleRowSelection(table.pop())
          }
        } else {
          this.$refs.table.clearSelection()
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .import-user-icon {
    color: #555555;
    margin-left: 4px;
  }
  .ivu-poptip,
  .el-select,
  /deep/.ivu-poptip-rel {
    width: 100%;
  }
  .userPreview {
    padding-left: 10px;
  }

  .notification {
    p {
      margin: 0;
      text-align: left;
    }
  }

</style>
