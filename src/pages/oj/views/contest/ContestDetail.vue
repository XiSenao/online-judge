<template>
  <div class="flex-container">
    <div id="contest-main">
      <!--children-->
      <transition name="fadeInUp">
        <router-view></router-view>
      </transition>
      <!--children end-->
      <div v-if="route_name === 'contest-details'" class="flex-container">
        <template>
          <div id="contest-desc">
            <Panel :padding="20" shadow>
              <div slot="title">
                {{ contest.title }}
              </div>
              <div slot="extra">
                <Tag :color="countdownColor" type="dot">
                  <span id="countdown">{{ countdown }}</span>
                </Tag>
              </div>
              <div class="markdown-body" v-html="contest.description"></div>
              <div class="contest-password">
                <Input v-if="passwordFormVisible && !currentStatus"
                       v-model="contestPassword"
                       :disabled="currentStatus"
                       class="contest-password-input"
                       type="password"
                       placeholder="contest password"
                       @on-enter="checkPassword" />
                <Button :disabled="contest_table[0].permission || currentStatus" type="info" @click="checkPassword">{{ enrollmentStatus }}</Button>
              </div>
            </Panel>
            <Table :columns="columns" :data="contest_table" disabled-hover style="margin-bottom: 40px;" />
          </div>
        </template>
      </div>

    </div>
    <div v-show="showMenu" id="contest-menu">
      <VerticalMenu @on-click="handleRoute">
        <VerticalMenu-item :route="{name: 'contest-details', params: {contestID: contestID}}">
          <Icon type="home" />
          {{ $t('m.Overview') }}
        </VerticalMenu-item>

        <VerticalMenu-item :disabled="contestMenuDisabled"
                           :route="{name: 'contest-announcement-list', params: {contestID: contestID}}">
          <Icon type="chatbubble-working" />
          {{ $t('m.Announcements') }}
        </VerticalMenu-item>

        <VerticalMenu-item :disabled="contestMenuDisabled"
                           :route="{name: 'contest-problem-list', params: {contestID: contestID}}">
          <Icon type="ios-photos" />
          {{ $t('m.Problems') }}
        </VerticalMenu-item>

        <VerticalMenu-item v-if="OIContestRealTimePermission"
                           :disabled="contestMenuDisabled"
                           :route="{name: 'contest-submission-list'}">
          <Icon type="navicon-round" />
          {{ $t('m.Submissions') }}
        </VerticalMenu-item>

        <VerticalMenu-item v-if="OIContestRealTimePermission"
                           :disabled="contestMenuDisabled"
                           :route="{name: 'contest-rank', params: {contestID: contestID}}">
          <Icon type="stats-bars" />
          {{ $t('m.Rankings') }}
        </VerticalMenu-item>
      </VerticalMenu>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import api from '@oj/api'
  import { mapState, mapGetters, mapActions } from 'vuex'
  import { types } from '@/store'
  import { CONTEST_STATUS_REVERSE, CONTEST_STATUS } from '@/utils/constants'
  import { NormalMixin } from '@oj/components/mixins'

  export default {
    name: 'ContestDetail',
    components: {},
    mixins: [NormalMixin],
    data () {
      return {
        CONTEST_STATUS: CONTEST_STATUS,
        route_name: '',
        btnLoading: false,
        contestID: '',
        contestPassword: '',
        columns: [
          {
            title: this.$i18n.t('m.StartAt'),
            render: (h, params) => {
              return h('span', params.row.startTime)
            }
          },
          {
            title: this.$i18n.t('m.EndAt'),
            render: (h, params) => {
              return h('span', params.row.endTime)
            }
          },
          {
            title: this.$i18n.t('m.Title'),
            render: (h, params) => {
              return h('span', params.row.title)
            }
          },
          {
            title: this.$i18n.t('m.ContestType'),
            render: (h, params) => {
              return h('span', this.ruleTypeName(params.row.rankModel))
            }
          },
          {
            title: this.$i18n.t('m.Rule'),
            render: (h, params) => {
              return h('span', this.signUpRuleName(params.row.signUpRule))
            }
          }
        ],
        timer: null,
        currentStatus: false,
        currentTime: ''
      }
    },
    computed: {
      ...mapState({
        showMenu: state => state.contest.itemVisible.menu,
        contest: state => state.contest.contest,
        contest_table: state => [state.contest.contest],
        now: state => state.contest.now,
        profile: state => state.user.profile
      }),
      ...mapGetters({
        contestMenuDisabled: 'contest/contestMenuDisabled',
        contestRuleType: 'contest/contestRuleType',
        contestStatus: 'contest/contestStatus',
        countdown: 'contest/countdown',
        isContestAdmin: 'contest/isContestAdmin',
        OIContestRealTimePermission: 'contest/OIContestRealTimePermission',
        passwordFormVisible: 'contest/passwordFormVisible'
      }),
      enrollmentStatus () {
        const nowContest = this.contest_table[0]
        const starTime = new Date(nowContest.startTime).getTime()
        const endTime = new Date(nowContest.endTime).getTime()
        const now = new Date(this.currentTime).getTime()
        if (now > starTime && now < endTime) {
          this.setStatus(true)
          return this.$t('m.Underway')
        } else if (now > endTime) {
          this.setStatus(true)
          return this.$t('m.Ended')
        }
        if (nowContest.permission) {
          return this.$t('m.Sign_Up_Successfully')
        } else {
          if (nowContest.signUpRule === '公开') {
            if (this.currentStatus) {
              return this.$t('m.Join_Successfully')
            } else {
              return this.$t('m.Join')
            }
          } else if (nowContest.signUpRule === '认证') {
            if (this.currentStatus) {
              return this.$t('m.Sign_Up_Pedding')
            }
            return this.$t('m.Contest_Certification')
          } else {
            if (this.currentStatus) {
              return this.$t('m.Sign_Up_Successfully')
            }
            return this.$t('m.Sign_Up')
          }
        }
      },
      countdownColor () {
        if (this.contestStatus) {
          return CONTEST_STATUS_REVERSE[this.contestStatus].color
        }
        return null
      },
      showAdminHelper () {
        return this.isContestAdmin && this.contestRuleType === 'ACM'
      }
    },
    watch: {
      '$route' (newVal) {
        this.route_name = newVal.name
        this.contestID = newVal.params.contestID
      }
    },
    mounted () {
      this.contestID = this.$route.params.contestID
      this.route_name = this.$route.name
      this.timer ? clearInterval(this.timer) : ''
      this.$store.dispatch('contest/getContest')
        .then(res => {
          this.changeDomTitle({ title: res.data.data.title })
          const data = res.data.data
          const endTime = moment(data.endTime)
          const now = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss')
          this.currentTime = res.headers.date
          if (endTime.isAfter(moment(now))) {
            this.timer = setInterval(() => {
              this.$store.commit(`contest/${types.NOW_ADD_1S}`)
            }, 1000)
          }
        })
        .catch(_ => {
          this.$router.go(-1)
        })
    },
    beforeDestroy () {
      clearInterval(this.timer)
      this.$store.commit(`contest/${types.CLEAR_CONTEST}`)
    },
    methods: {
      ...mapActions(['changeDomTitle']),
      handleRoute (route) {
        this.$router.push(route)
      },
      setStatus (status) {
        this.currentStatus = status
      },
      checkPassword () {
        if (!this.passwordFormVisible) {
          const requestQueue = []
          const isPublic = this.contest_table[0].signUpRule === '公开'
          if (!isPublic) {
            requestQueue.push(api.getOwnCertType())
          }
          Promise.all(requestQueue).then(res => {
            if (!isPublic) {
              if (!res[0].data.data) {
                this.$Message.info('您还未认证, 请前往认证!')
                this.$router.push({ name: 'certification-setting' })
                return
              } else if (!res[0].data.data.status) {
                this.$Message.info('您的认证还未审批通过')
                return
              }
            }
            api.checkContestPassword(this.contestID, null).then(res => {
              this.$Message.info('报名成功!')
              this.currentStatus = true
            })
          })
          return
        }
        if (this.contestPassword === '') {
          this.$error('Password can\'t be empty')
          return
        }
        this.btnLoading = true
        api.checkContestPassword(this.contestID, this.contestPassword).then((res) => {
          this.$success('Succeeded')
          this.currentStatus = true
          this.$store.commit(types.CONTEST_ACCESS, { access: true })
          this.btnLoading = false
        }, (_) => {
          this.btnLoading = false
        })
      }
    }
  }
</script>

<style scoped lang="less">
  pre {
    display: inline-block;
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
    background: var(--table-card-body);
  }
  /deep/.ivu-card-body li {
    color: var(--font-color-white);
  }
  /deep/.ivu-tag-dot {
    background: var(--tag-dot-bg-color) !important;
  }
  /deep/.ivu-tag-text {
    color: var(--font-color-white);
  }
  #countdown {
    font-size: 16px;
  }

  .flex-container {
    #contest-main {
      flex: 1 1;
      #contest-desc {
        flex: auto;
      }
    }
    #contest-menu {
      flex: none;
      width: 210px;
      margin-left: 20px;
    }
    .contest-password {
      margin-top: 20px;
      margin-bottom: -10px;
      &-input {
        width: 200px;
        margin-right: 10px;
      }
    }
  }
</style>
