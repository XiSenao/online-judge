<template>
  <div class="view">
    <Spin size="large" fix v-if="utilSpin"></Spin>
    <Panel :title="title">
      <el-form label-position="top" :model="contest" :rules="contentRules" ref="contest">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="$t('m.ContestTitle')" prop="title">
              <el-input v-model="contest.title" :placeholder="$t('m.ContestTitle')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('m.ContestDescription')" prop="description">
              <Simditor v-model="contest.description"></Simditor>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Contest_Start_Time')" prop="startTime" required>
              <el-date-picker
                v-model="contest.startTime"
                type="datetime"
                :placeholder="$t('m.Contest_Start_Time')">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Contest_End_Time')" prop="endTime" required>
              <el-date-picker
                v-model="contest.endTime"
                type="datetime"
                :placeholder="$t('m.Contest_End_Time')">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Contest_Password')" :required="contest.signUpRule === '密码'">
              <el-input v-model="contest.password" :placeholder="$t('m.Contest_Password')" :disabled="contest.signUpRule!=='密码'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="'Rank Rule'">
              <el-radio class="radio" v-model="contest.rankModel" label="ACM/ICPC" :disabled="disableRuleType">ACM/ICPC</el-radio>
              <el-radio class="radio" v-model="contest.rankModel" label="练习" :disabled="disableRuleType">Exercise</el-radio>
              <el-radio class="radio" v-model="contest.rankModel" label="积分" :disabled="disableRuleType">Rating</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="'Sign Up Rule'" prop="signUpRule" required>
              <el-select v-model="contest.signUpRule" clearable placeholder="请选择">
                <el-option
                  v-for="item in signUpRuleTable"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item :label="$t('m.Real_Time_Rank')">
              <el-switch
                v-model="contest.realtimeRank"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item :label="$t('m.Contest_Status')">
              <el-switch
                v-model="contest.status"
                active-text=""
                inactive-text="">
              </el-switch>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item :label="$t('m.Allowed_IP_Ranges')">
              <div v-for="(range, index) in contest.allowed_ip_ranges" :key="index">
                <el-row :gutter="20" style="margin-bottom: 15px">
                  <el-col :span="8">
                    <el-input v-model="range.value" :placeholder="$t('m.CIDR_Network')"></el-input>
                  </el-col>
                  <el-col :span="10">
                    <el-button plain icon="el-icon-fa-plus" @click="addIPRange"></el-button>
                    <el-button plain icon="el-icon-fa-trash" @click="removeIPRange(range)"></el-button>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <save @click.native="saveContest('contest')"></save>
      <el-button type="info" class="el-btn" @click="resetContestForm()">重置</el-button>
    </Panel>
  </div>
</template>

<script>
  import api from '../../api.js'
  import Simditor from '../../components/Simditor.vue'
  import utils from '@/utils/utils'

  export default {
    name: 'CreateContest',
    components: {
      Simditor
    },
    data () {
      return {
        title: 'Create Contest',
        disableRuleType: false,
        utilSpin: true,
        signUpRuleTable: [
          {
            value: '公开',
            label: 'Public'
          }, {
            value: '认证',
            label: 'Approve'
          }, {
            value: '密码',
            label: 'Password'
          }
        ],
        contest: {
          title: '',
          description: '',
          startTime: '',
          endTime: '',
          rankModel: 'ACM/ICPC',
          password: '',
          signUpRule: '公开',
          realtimeRank: true,
          status: true
        },
        contentRules: {
          title: [
            { required: true, message: '请输入比赛标题', trigger: 'blur' },
            { min: 2, message: '比赛标题至少为2个字符', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入比赛描述描述', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '请输入比赛的开始时间', trigger: 'blur' }
          ],
          endTime: [
            { required: true, message: '请输入比赛的结束时间', trigger: 'blur' }
          ],
          signUpRule: [
            { required: true, message: '请选择比赛的报名规则', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      'contest.signUpRule' (newValue) {
        if (newValue !== '密码') {
          this.contest.password = ''
        }
      }
    },
    methods: {
      resetContestForm () {
        this.contest = {
          title: '',
          description: '',
          startTime: '',
          endTime: '',
          rankModel: this.contest.rankModel,
          password: '',
          signUpRule: '',
          realtimeRank: true,
          status: true
        }
      },
      saveContest (contestValidateName) {
        if (this.contest.signUpRule === '密码' && (!this.contest.password || !this.contest.password.trim())) {
          this.$error('Password can not be empty')
          return 
        }
        if (new Date(this.contest.endTime).getTime() < new Date(this.contest.startTime).getTime()) {
          this.$error('There is a problem with the relationship before and after time')
          return
        }
        let data = Object.assign({}, this.contest)
        this.$refs[contestValidateName].validate((valid) => {
          if (valid) {
            let funcName = this.$route.name === 'edit-contest' ? 'editContest' : 'createContest'
            let data = Object.assign({}, this.contest)
            data.id = data.id || null
            data.realtimeRank = data.realtimeRank ? 1 : 0
            data.status = data.status ? 1 : -1
            data.endTime = utils.formatDate(new Date(data.endTime))
            data.startTime = utils.formatDate(new Date(data.startTime))
            api[funcName](data).then(res => {
              this.$router.push({name: 'contest-list', query: {refresh: 'true'}})
            }).catch(() => {
            })
          } else {
            return false;
          }
        })
      }
    },
    mounted () {
      if (this.$route.name === 'edit-contest') {
        this.title = 'Edit Contest'
        this.disableRuleType = true
        api.getContest(this.$route.params.contestId).then(res => {
          let data = res.data.data
          data.status = data.status ? true : false
          data.realtimeRank = data.realtimeRank ? true : false
          this.contest = data
          this.utilSpin = false
        }).catch(() => {
          this.utilSpin = false
        })
      } else {
        this.utilSpin = false
      }
    }
  }
</script>

<style scoped>
  .el-btn {
    margin-left: 19px; 
    margin-top: 60px; 
    margin-bottom: 15px;
  } 
</style>
