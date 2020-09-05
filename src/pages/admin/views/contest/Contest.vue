<template>
  <div class="view">
    <Spin v-if="utilSpin" size="large" fix />
    <Panel :title="title">
      <el-form ref="contest" label-position="top" :model="contest" :rules="contentRules">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="$t('m.ContestTitle')" prop="title">
              <el-input v-model="contest.title" :placeholder="$t('m.ContestTitle')" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('m.ContestDescription')" prop="description">
              <Simditor v-model="contest.description" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Contest_Start_Time')" prop="startTime" required>
              <el-date-picker
                v-model="contest.startTime"
                type="datetime"
                :placeholder="$t('m.Contest_Start_Time')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Contest_End_Time')" prop="endTime" required>
              <el-date-picker
                v-model="contest.endTime"
                type="datetime"
                :placeholder="$t('m.Contest_End_Time')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Contest_Password')" :required="contest.signUpRule === CONTEST_QUERY_VALUE.KEY">
              <el-input
                v-model="contest.password"
                :placeholder="$t('m.Contest_Password')"
                :disabled="contest.signUpRule !== CONTEST_QUERY_VALUE.KEY"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="'Rank Rule'">
              <el-radio v-model="contest.rankModel" class="radio" :label="CONTEST_QUERY_VALUE.ACM_ICPC" :disabled="disableRuleType">ACM/ICPC</el-radio>
              <el-radio v-model="contest.rankModel" class="radio" :label="CONTEST_QUERY_VALUE.WARM_UP" :disabled="disableRuleType">Exercise</el-radio>
              <el-radio v-model="contest.rankModel" class="radio" :label="CONTEST_QUERY_VALUE.INTEGRAL" :disabled="disableRuleType">Rating</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="'Sign Up Rule'" prop="signUpRule" required>
              <el-select v-model="contest.signUpRule" clearable placeholder="请选择">
                <el-option
                  v-for="item in signUpRuleTable"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item :label="$t('m.Real_Time_Rank')">
              <el-switch
                v-model="contest.realtimeRank"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item :label="$t('m.Contest_Status')">
              <el-switch
                v-model="contest.status"
                active-text=""
                inactive-text=""
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <save @click.native="saveContest('contest')" />
      <el-button type="info" class="el-btn" @click="resetContestForm()">重置</el-button>
    </Panel>
  </div>
</template>

<script>
  import api from '../../api.js'
  import Simditor from '../../components/Simditor.vue'
  import utils from '@/utils/utils'
  import { CONTEST_QUERY_VALUE } from '@/utils/constants'

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
            value: CONTEST_QUERY_VALUE.PUBLIC,
            label: 'Public'
          }, {
            value: CONTEST_QUERY_VALUE.PROOF,
            label: 'Approve'
          }, {
            value: CONTEST_QUERY_VALUE.KEY,
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
          signUpRule: CONTEST_QUERY_VALUE.PUBLIC,
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
        },
        CONTEST_QUERY_VALUE
      }
    },
    watch: {
      'contest.signUpRule' (newValue) {
        if (newValue !== CONTEST_QUERY_VALUE.KEY) {
          this.contest.password = ''
        }
      }
    },
    mounted () {
      if (this.$route.name === 'EditContest') {
        this.title = 'Edit Contest'
        this.disableRuleType = true
        api.getContest(this.$route.params.contestId).then(res => {
          const data = res.data.data
          data.status = !!data.status
          data.realtimeRank = !!data.realtimeRank
          this.contest = data
          this.utilSpin = false
        }).catch(() => {
          this.utilSpin = false
        })
      } else {
        this.utilSpin = false
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
        if (this.contest.signUpRule === CONTEST_QUERY_VALUE.KEY && (!this.contest.password || !this.contest.password.trim())) {
          this.$error('Password can not be empty')
          return
        }
        if (new Date(this.contest.endTime).getTime() < new Date(this.contest.startTime).getTime()) {
          this.$error('There is a problem with the relationship before and after time')
          return
        }
        const data = Object.assign({}, this.contest)
        this.$refs[contestValidateName].validate((valid) => {
          if (valid) {
            const funcName = this.$route.name === 'EditContest' ? 'editContest' : 'createContest'
            data.id = data.id || null
            data.realtimeRank = data.realtimeRank ? 1 : 0
            data.status = data.status ? 1 : -1
            data.endTime = utils.formatDate(new Date(data.endTime))
            data.startTime = utils.formatDate(new Date(data.startTime))
            api[funcName](data).then(res => {
              this.$router.push({ name: 'ContestList', query: { refresh: 'true' }})
            }).catch(() => {})
          } else {
            return false
          }
        })
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
