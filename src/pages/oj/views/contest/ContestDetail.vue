<template>
  <div class="flex-container">
    <div id="contest-main">
      <!--children-->
      <transition name="fadeInUp">
        <router-view></router-view>
      </transition>
      <!--children end-->
      <div class="flex-container" v-if="route_name === 'contest-details'">
        <template>
          <div id="contest-desc">
            <Panel :padding="20" shadow>
              <div slot="title">
                {{contest.title}}
              </div>
              <div slot="extra">
                <Tag type="dot" :color="countdownColor">  
                  <span id="countdown">{{countdown}}</span>
                </Tag>
              </div>
              <div v-html="contest.description" class="markdown-body"></div>
              <div class="contest-password">
                <Input v-model="contestPassword" type="password"
                       v-if="passwordFormVisible && !currentStatus"
                       :disabled="currentStatus"
                       placeholder="contest password" class="contest-password-input"
                       @on-enter="checkPassword"/>
                <Button type="info" @click="checkPassword" :disabled="contest_table[0].permission || currentStatus">{{ enrollmentStatus }}</Button>
              </div>
            </Panel>
            <Table :columns="columns" :data="contest_table" disabled-hover style="margin-bottom: 40px;"></Table>
          </div>
        </template>
      </div>

    </div>
    <div v-show="showMenu" id="contest-menu">
      <VerticalMenu @on-click="handleRoute">
        <VerticalMenu-item :route="{name: 'contest-details', params: {contestID: contestID}}">
          <Icon type="home"></Icon>
          {{$t('m.Overview')}}
        </VerticalMenu-item>

        <VerticalMenu-item :disabled="contestMenuDisabled"
                           :route="{name: 'contest-announcement-list', params: {contestID: contestID}}">
          <Icon type="chatbubble-working"></Icon>
          {{$t('m.Announcements')}}
        </VerticalMenu-item>

        <VerticalMenu-item :disabled="contestMenuDisabled"
                           :route="{name: 'contest-problem-list', params: {contestID: contestID}}">
          <Icon type="ios-photos"></Icon>
          {{$t('m.Problems')}}
        </VerticalMenu-item>

        <VerticalMenu-item v-if="OIContestRealTimePermission"
                           :disabled="contestMenuDisabled"
                           :route="{name: 'contest-submission-list'}">
          <Icon type="navicon-round"></Icon>
          {{$t('m.Submissions')}}
        </VerticalMenu-item>

        <VerticalMenu-item v-if="OIContestRealTimePermission"
                           :disabled="contestMenuDisabled"
                           :route="{name: 'contest-rank', params: {contestID: contestID}}">
          <Icon type="stats-bars"></Icon>
          {{$t('m.Rankings')}}
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
  import time from '@/utils/time'
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
    mounted () {
      this.contestID = this.$route.params.contestID
      this.route_name = this.$route.name
      this.timer ? clearInterval(this.timer) : ''
      this.$store.dispatch('contest/getContest')
        .then(res => {
          this.changeDomTitle({title: res.data.data.title})
          let data = res.data.data
          let endTime = moment(data.endTime)
          let now = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss')
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
    methods: {
      ...mapActions(['changeDomTitle']),
      handleRoute (route) {
        this.$router.push(route)
      },
      checkPassword () {
        if (!this.passwordFormVisible) {
          api.getOwnCertType().then(res => {
            console.log(res)
            if (!res.data.data) {
              this.$Message.info("您还未认证, 请前往认证!");
              this.$router.push({name: 'certification-setting'})
            } else if (!res.data.data.status) {
              this.$Message.info("您的认证还未审批通过");
            } else {
              api.checkContestPassword(this.contestID, null).then(res => {
                this.$Message.info("报名成功!");
                this.currentStatus = true
              })
            }
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
          this.passwordFormVisible = false
          this.currentStatus = true
          this.$store.commit(types.CONTEST_ACCESS, {access: true})
          this.btnLoading = false
        }, (res) => {
          this.btnLoading = false
        })
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
        let nowContest = this.contest_table[0]
        let starTime = new Date(nowContest.startTime).getTime()
        let endTime = new Date(nowContest.endTime).getTime()
        let now = new Date(this.currentTime).getTime()
        if (now > starTime && now < endTime) {
          this.currentStatus = true
          return this.$t('m.Underway')
        } else if (now > endTime) {
          this.currentStatus = true
          return this.$t('m.Ended')
        }
        if (nowContest.permission) {
          return this.$t('m.Sign_Up_Successfully')
        } else {
          if (nowContest.signUpRule === '认证') {
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
    beforeDestroy () {
      clearInterval(this.timer)
      this.$store.commit(`contest/${types.CLEAR_CONTEST}`)
    }
  }
</script>

<style scoped lang="less">
  pre {
    display: inline-block;
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
