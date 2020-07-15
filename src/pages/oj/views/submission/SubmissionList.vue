<template>
  <div class="flex-container">
    <div id="main">
      <Panel shadow>
        <div slot="title">{{title}}</div>
        <div slot="extra" v-if="!contestID">
          <ul class="filter">
            <li>
              <Dropdown @on-click="handleResultChange">
                <span>{{status}}
                  <Icon type="arrow-down-b"></Icon>
                </span>
                <Dropdown-menu slot="list">
                  <Dropdown-item name="">{{$t('m.All')}}</Dropdown-item>
                  <Dropdown-item v-for="status in Object.keys(JUDGE_STATUS)" :key="status" :name="status">
                    {{$t('m.' + statusName(status))}}
                  </Dropdown-item>
                </Dropdown-menu>
              </Dropdown>
            </li>
            <li>
              <el-tooltip effect="dark" :content="!this.profile.id ? 'Please Login First' : formFilter.myself ? 'Show All' : 'Show Mine'" placement="top-start">
                <i-switch size="large" v-model="formFilter.myself" @on-change="handleQueryChange" :disabled="!this.profile.id">
                  <span slot="open">{{$t('m.Mine')}}</span>
                  <span slot="close">{{$t('m.All')}}</span>
                </i-switch>
              </el-tooltip>
            </li>
            <li>
              <Input v-model="formFilter.username" :placeholder="$t('m.Search_Author')" @on-enter="handleQueryChange"/>
            </li>
            <li>
              <Button type="info" icon="refresh" @click="getSubmissions">{{$t('m.Refresh')}}</Button>
            </li>
          </ul>
        </div>
        <Table stripe :disabled-hover="true" :columns="columns" :data="submissions" :loading="loadingTable"></Table>
        <Pagination :total="total" :page-size="limit" @on-change="changeRoute" :current.sync="page"></Pagination>
      </Panel>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions} from 'vuex'
  import api from '@oj/api'
  import { JUDGE_STATUS, USER_TYPE } from '@/utils/constants'
  import utils from '@/utils/utils'
  import time from '@/utils/time'
  import Pagination from '@/pages/oj/components/Pagination'
  let Base64 = require('js-base64').Base64;
  export default {
    name: 'submissionList',
    components: {
      Pagination
    },
    data () {
      return {
        formFilter: {
          myself: false,
          result: '',
          username: ''
        },
        columns: [
          {
            title: this.$i18n.t('m.When'),
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.crtTs)
            }
          },
          {
            title: this.$i18n.t('m.Status'),
            align: 'center',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  color: JUDGE_STATUS[params.row.submitStatus].color
                }
              }, this.$t('m.' + this.statusName(params.row.submitStatus)))
            }
          },
          {
            title: this.$i18n.t('m.Problem'),
            align: 'center',
            render: (h, params) => {
              return h('span',
                {
                  style: {
                    color: 'var(--font-status-problemid)',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      if (this.contestID) {
                        this.$router.push(
                          {
                            name: 'contest-problem-details',
                            params: {problemID: params.row.problemId, contestID: this.contestID}
                          })
                      } else {
                        this.$router.push({name: 'problem-details', params: {problemID: params.row.problemId}})
                      }
                    }
                  }
                },
                params.row.problemId)
            }
          },
          {
            title: this.$i18n.t('m.Time'),
            align: 'center',
            render: (h, params) => {
              return h('span', utils.submissionTimeFormat(params.row.time))
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
            title: this.$i18n.t('m.Language'),
            align: 'center',
            render: (h, params) => {
              if (params.row.show_link && JUDGE_STATUS[params.row.submitStatus].isResult) {
                return h('span', {
                  style: {
                    color: '#57a3f3',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.$router.push('/status/' + Base64.encode(JSON.stringify(params.row)))
                    }
                  }
                }, params.row.language)
              } else {
                return h('span', params.row.language)
              } 
            }
          },
          {
            title: this.$i18n.t('m.Author'),
            align: 'center',
            render: (h, params) => {
              return h('a', {
                style: {
                  'display': 'inline-block',
                  'max-width': '150px'
                },
                on: {
                  click: () => {
                    this.$router.push(
                      {
                        name: 'user-home',
                        query: {id: params.row.creatorId}
                      })
                  }
                }
              }, params.row.creator)
            }
          }
        ],
        loadingTable: false,
        submissions: [],
        total: 30,
        limit: 12,
        page: 1,
        contestID: '',
        problemID: '',
        routeName: '',
        JUDGE_STATUS: '',
        rejudge_column: false
      }
    },
    mounted () {
      this.init()
      this.JUDGE_STATUS = Object.assign({}, JUDGE_STATUS)
      // 去除submitting的状态 和 两个
      delete this.JUDGE_STATUS['Submitting']
    },
    methods: {
      ...mapActions(['changeModalStatus']),
      init () {
        this.contestID = this.$route.params.contestID
        let query = this.$route.query
        this.problemID = query.problemID
        this.formFilter.result = query.submitStatus || null
        this.formFilter.username = query.creatorKey || null
        this.page = query.pageModel && parseInt(query.pageModel.offset) || 1
        this.routeName = this.$route.name
        this.getSubmissions()
      },
      buildQuery () {
        if (!this.contestID) {
          return {
            creatorKey: this.formFilter.username,
            pageModel: {
              limit: this.limit,
              offset: this.page,
              paramData: null
            },
            problemId: this.problemID,
            submitStatus: this.formFilter.result
          }
        } else {
          return {
            limit: this.limit,
            offset: this.page,
            paramData: null,
            contestId: this.contestID
          }
        }
      },
      getSubmissions () {
        let params = this.buildQuery()
        let func = this.contestID ? 'getContestSubmissionList' : 'getSubmissionList'
        this.loadingTable = true
        api[func](params).then(res => {
          let data = res.data.data.records
          for (let i = 0; i < data.length; ++i) {
            data[i].show_link = this.profile.username === data[i].creator
          }
          // this.adjustRejudgeColumn()
          this.loadingTable = false
          this.submissions = data
          this.total = res.data.data.total
        }).catch(() => {
          this.loadingTable = false
        })
      },
      statusName (status) {
        let length = status.length, res = []
        for (let i = 0; i < length; ++i) {
          if (i && /[A-Z]/.test(status[i])) {
            res.push('_')
          } 
          res.push(status[i])
        }
        return res.toString().replace(/,/g, '')
      },
      // 改变route， 通过监听route变化请求数据，这样可以产生route history， 用户返回时就会保存之前的状态
      changeRoute () {
        let query = this.buildQuery()
        query.contestID = this.contestID
        query.problemID = this.problemID
        let routeName = query.contestID ? 'contest-submission-list' : 'submission-list'
        this.$router.push({
          name: routeName,
          query
        })
      },
      goRoute (route) {
        this.$router.push(route)
      },
      adjustRejudgeColumn () {
        if (!this.rejudgeColumnVisible || this.rejudge_column) {
          return
        }
        const judgeColumn = {
          title: this.$i18n.t('m.Option'),
          fixed: 'right',
          align: 'center',
          width: 90,
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'primary',
                size: 'small',
                loading: params.row.loading
              },
              on: {
                click: () => {
                  this.handleRejudge(params.row.id, params.index)
                }
              }
            }, this.$i18n.t('m.Rejudge'))
          }
        }
        this.columns.push(judgeColumn)
        this.rejudge_column = true
      },
      handleResultChange (status) {
        this.page = 1
        this.formFilter.result = status
        this.changeRoute()
      },
      handleQueryChange () {
        this.page = 1
        if (this.formFilter.myself) {
          if (this.profile.id) {
            this.formFilter.username = this.profile.username
          } else {
            this.changeModalStatus({
              visible: true,
              mode: 'login'
            })
          }
        }
        this.changeRoute() 
      },
      handleRejudge (id, index) {
        this.submissions[index].loading = true
        api.submissionRejudge(id).then(res => {
          this.submissions[index].loading = false
          this.$success('Succeeded')
          this.getSubmissions()
        }, () => {
          this.submissions[index].loading = false
        })
      }
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'user/isAuthenticated',
        profile: 'user/profile'
      }),
      title () {
        if (!this.contestID) {
          return this.$i18n.t('m.Status')
        } else if (this.problemID) {
          return this.$i18n.t('m.Problem_Submissions')
        } else {
          return this.$i18n.t('m.Submissions')
        }
      },
      status () {
        return !this.formFilter.result ? this.$i18n.t('m.Status') : this.$i18n.t('m.' + JUDGE_STATUS[this.formFilter.result].name.replace(/ /g, '_'))
      },
      rejudgeColumnVisible () {
        return !this.contestID && this.profile.admin_type === USER_TYPE.SUPER_ADMIN
      }
    },
    watch: {
      '$route' (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.init()
        }
      },
      'rejudgeColumnVisible' () {
        this.adjustRejudgeColumn()
      },
      'isAuthenticated' () {
        this.init()
      }
    }
  }
</script>

<style scoped lang="less">
  .ivu-btn-text {
    color: #57a3f3;
  }
  /deep/.ivu-card {
    background: var(--table-card-top);
    color: var(--font-color-white);
  }
  /deep/.ivu-table th {
    color: var(--font-color-origin);
    background: var(--table-card-head);
  }
  /deep/.ivu-table td {
    color: var(--font-color-origin);
    background: var(--table-card-body) !important;
  }
  /deep/.ivu-select-dropdown {
    background: var(--dropdown-diff-bg-color);
  }
  /deep/.ivu-dropdown-item {
    color: var(--font-color-white);
  }
  /deep/.ivu-dropdown-item:hover {
    color: var(--dropdown-status-bg-color);
  }
  .flex-container {
    color: var(--font-color-white);
    #main {
      flex: auto;
      margin-right: 18px;
      .filter {
        margin-right: -10px;
      }
    }
    #contest-menu {
      flex: none;
      width: 210px;
    }
  }
</style>
