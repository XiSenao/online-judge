<template>
  <Row type="flex" justify="space-around">
    <Col :span="20" id="status">
      <Alert :type="status.type" showIcon>
        <span class="title">{{status.statusName}}</span>
        <div slot="desc" class="content">
          <template v-if="isCE">
            <pre>{{submission.statistic_info.err_info}}</pre>
          </template>
          <template v-else>
            <span>{{$t('m.Time')}}: {{submission.statistic_info.time_cost | submissionTime}}</span>
            <span>{{$t('m.Memory')}}: {{submission.statistic_info.memory_cost | submissionMemory}}</span>
            <span>{{$t('m.Lang')}}: {{submission.language}}</span>
            <span>{{$t('m.Author')}}: {{submission.username}}</span>
          </template>
        </div>
      </Alert>
    </Col>

    <!--后台返info就显示出来， 权限控制放后台 -->
    <Col v-if="submission.info && !isCE" :span="20">
      <Table stripe :loading="loading" :disabled-hover="true" :columns="columns" :data="submission.info.data"></Table>
    </Col>

    <Col :span="20">
      <Highlight :code="submission.code" :language="submission.language" :border-color="status.color"></Highlight>
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
  export default {
    name: 'submissionDetails',
    components: {
      Highlight
    },
    data () {
      return {
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
                  color: JUDGE_STATUS[params.row.result].color
                }
              }, JUDGE_STATUS[params.row.result].name)
            }
          },
          {
            title: this.$i18n.t('m.Memory'),
            align: 'center',
            render: (h, params) => {
              return h('span', utils.submissionMemoryFormat(params.row.memory))
            }
          },
          {
            title: this.$i18n.t('m.Time'),
            align: 'center',
            render: (h, params) => {
              return h('span', utils.submissionTimeFormat(params.row.cpu_time))
            }
          }
        ],
        submission: {
          result: 'CompileError',
          code: '',
          info: {
            data: []
          },
          statistic_info: {
            time_cost: '',
            memory_cost: ''
          }
        },
        dataInfo: null,
        isConcat: false,
        loading: false
      }
    },
    beforeRouteEnter (to, from, next) {
      
      // api.getContestList(1, limit).then((res) => {
      //   next((vm) => {
      //     vm.contests = res.data.data.records
      //     vm.total = res.data.data.total
      //     vm.currentTime = utils.formatDate(new Date(res.headers.date))
      //   })
      // }, (res) => {
      //   next()
      // })
      next(vm => {
        vm.getSubmission()
      })
    },
    methods: {
      getSubmission () {
        this.loading = true
        let Base64 = require('js-base64').Base64;
        try {
          this.dataInfo = JSON.parse(Base64.decode(this.$route.params.data))
        } catch (_) {}
        if (!this.dataInfo) {
          this.$router.push('/404')
          return
        }
        api.getSubmission(this.dataInfo.problemId, this.dataInfo.id).then(res => {
          this.loading = false
          let data = res.data.data
          data = JSON.parse(data)
          let Base64 = require('js-base64').Base64
          let code = Base64.decode(data.code)
					let msg = data.msg ? JSON.parse(data.msg).msg : null
					this.submission = {
						result: this.dataInfo.submitStatus,
						code: code,
						language: this.dataInfo.language,
						username: this.dataInfo.creator,
						info: {
							data: [
								{
									memory: this.dataInfo.memory,
									cpu_time: this.dataInfo.time,
									result: this.dataInfo.submitStatus
								}
							]
						},
						statistic_info: {
							time_cost: this.dataInfo.time,
							memory_cost: this.dataInfo.memory,
							err_info: msg
						}
					}
        }, (_) => {
          this.$router.go(-1)
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
    computed: {
      status () {
        return {
          type: JUDGE_STATUS[this.submission.result].type,
          statusName: JUDGE_STATUS[this.submission.result].name,
          color: JUDGE_STATUS[this.submission.result].color
        }
      },
      isCE () {
        return this.submission.result === 'CompileError'
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