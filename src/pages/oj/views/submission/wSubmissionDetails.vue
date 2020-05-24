<template>
  <Row type="flex" justify="space-around">
    {{status}}
    {{submission[0].msg}}
    <Col :span="20" id="status">
      <Alert :type="status.type" showIcon>
        <span class="title">{{status.name}}</span>
        <div slot="desc" class="content">
          {{submission[0].msg}}
          <template v-if="submission[0].submitStatus !== 'Accepted'">
            <pre>{{submission[0].msg}}</pre>
          </template>
          <template v-else>
            <span>{{$t('m.Time')}}: {{submission[0].time}}</span>
            <span>{{$t('m.Memory')}}: {{submission[0].memory}}</span>
            <span>{{$t('m.Lang')}}: {{submission[0].language}}</span>
            <span>{{$t('m.Author')}}: {{submission[0].creator}}</span>
          </template>
        </div>
      </Alert>
    </Col>

    <!--后台返info就显示出来， 权限控制放后台 -->
    <Col v-if="submission[0].submitStatus === 'Accepted'" :span="20">
      <Table stripe :loading="loading" :disabled-hover="true" :columns="columns" :data="submission"></Table>
    </Col>

    <Col :span="20">
      <Highlight :code="submission[0].code" :language="submission[0].language" :border-color="status.color"></Highlight>
    </Col>
    <Col v-if="submission.can_unshare" :span="20">
      <div id="share-btn">
        <Button v-if="submission.shared"
                type="warning" size="large" @click="shareSubmission(false)">
          {{$t('m.UnShare')}}
        </Button>
        <Button v-else
                type="primary" size="large" @click="shareSubmission(true)">
          {{$t('m.Share')}}
        </Button>
      </div>
    </Col>
  </Row>

</template>

<script>
  import api from '@oj/api'
  import {JUDGE_STATUS} from '@/utils/constants'
  import utils from '@/utils/utils'
  import Highlight from '@/pages/oj/components/Highlight'
  let Base64 = require('js-base64').Base64;
  export default {
    name: 'submissionDetails',
    components: {
      Highlight
    },
    data () {
      return {
        status: {},
        columns: [
          {
            title: this.$i18n.t('m.ID'),
            align: 'center',
            type: 'index'
          },
          {
            title: this.$i18n.t('m.Status'),
            align: 'center',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  color: JUDGE_STATUS[params.row.submitStatus].color
                }
              }, JUDGE_STATUS[params.row.submitStatus].name)
            }
          },
          {
            title: this.$i18n.t('m.Memory'),
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.memory)
            }
          },
          {
            title: this.$i18n.t('m.Time'),
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.time)
            }
          }
        ],
        submission: {
          result: '0',
          code: '',
          info: {
            data: []
          },
          statistic_info: {
            time_cost: '',
            memory_cost: ''
          }
        },
        isConcat: false,
        loading: false,
        dataInfo: {}
      }
    },
    created () {
      this.dataInfo = JSON.parse(Base64.decode(this.$route.params.data))
      this.submission = {
        creator: this.dataInfo.creator,
        language: this.dataInfo.language,
        memory: utils.submissionMemoryFormat(this.dataInfo.memory),
        submitStatus: this.dataInfo.submitStatus,
        time: utils.submissionTimeFormat(this.dataInfo.time),
        id: this.dataInfo.id
      }
      this.submission = [this.submission]
    },
    mounted () {
      this.getSubmission()
    },
    methods: {
      getSubmission () {
        this.loading = true
        api.getSubmission(this.dataInfo.problemId, this.dataInfo.id).then(res => {
          this.loading = false
          console.log(res)
          let data = res.data.data
          console.log(data)
          data = JSON.parse(data)
          let Base64 = require('js-base64').Base64
          let code = Base64.decode(data.code)
          let msg = data.msg ? JSON.parse(data.msg).msg : null
          console.log(code)
          console.log(msg)
          this.submission[0].code = code
          this.submission[0].msg = msg
          console.log(this.submission)
          // if (data.info && data.info.data && !this.isConcat) {
          //   // score exist means the submission is OI problem submission
          //   if (data.info.data[0].score !== undefined) {
          //     this.isConcat = true
          //     const scoreColumn = {
          //       title: this.$i18n.t('m.Score'),
          //       align: 'center',
          //       key: 'score'
          //     }
          //     this.columns.push(scoreColumn)
          //     this.loadingTable = false
          //   }
          //   if (this.isAdminRole) {
          //     this.isConcat = true
          //     const adminColumn = [
          //       {
          //         title: this.$i18n.t('m.Real_Time'),
          //         align: 'center',
          //         render: (h, params) => {
          //           return h('span', utils.submissionTimeFormat(params.row.real_time))
          //         }
          //       },
          //       {
          //         title: this.$i18n.t('m.Singal'),
          //         align: 'center',
          //         key: 'signal'
          //       }
          //     ]
          //     this.columns = this.columns.concat(adminColumn)
          //   }
          // }
        }, () => {
          this.loading = false
        })
      },
      shareSubmission (shared) {
        let data = {id: this.submission.id, shared: shared}
        api.updateSubmission(data).then(res => {
          this.getSubmission()
          this.$success(this.$i18n.t('m.Succeeded'))
        }, () => {
        })
      }
    },
    watch: {
      'dataInfo.submitStatus' (newValue) {
        console.log(newValue)
        this.status = {
          type: JUDGE_STATUS[newValue].type,
          name: JUDGE_STATUS[newValue].name,
          color: JUDGE_STATUS[newValue].color
        }
        console.log(this.status)
      }
    },
    computed: {
      isCE () {
        return this.submission[0].submitStatus === 'CompileError'
      }
    }
  }
</script>

<style scoped lang="less">
  #status {
    .title {
      font-size: 20px;
    }
    .content {
      margin-top: 10px;
      font-size: 14px;
      span {
        margin-right: 10px;
      }
      pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }

  .admin-info {
    margin: 5px 0;
    &-content {
      font-size: 16px;
      padding: 10px;
    }
  }

  #share-btn {
    float: right;
    margin-top: 5px;
    margin-right: 10px;
  }

  pre {
    border: none;
    background: none;
  }
</style>
