<template>
  <Panel shadow :padding="10">
    <div slot="title">
      {{title}}
    </div>
    <div slot="extra">
      <Button v-if="listVisible" type="info" @click="init" :loading="btnLoading">{{$t('m.Refresh')}}</Button>
      <Button v-else type="ghost" icon="ios-undo" @click="goBack">{{$t('m.Back')}}</Button>
    </div>

    <transition-group name="announcement-animate" mode="in-out">
      <div class="no-announcement" v-if="!announcements.length" key="no-announcement">
        <p>{{$t('m.No_Announcements')}}</p>
      </div>
      <template v-if="listVisible">
        <ul class="announcements-container" key="list">
          <li v-for="announcement in announcements" :key="announcement.id">
            <div class="flex-container">
              <div class="title"><a :class="[showMyMessage && !announcement.status ? 'add-blue' : '', 'entry']" @click="goAnnouncement(announcement)">
                {{announcement.title}}</a></div>
              <div :class="[showMyMessage && !announcement.status ? 'add-blue' : '', 'date']">{{announcement.crtTs | localtime }}</div>
              <div :class="[showMyMessage && !announcement.status ? 'add-blue' : '', 'creator']"> {{$t('m.By')}} {{announcement.creator}}</div>
            </div>
          </li>
        </ul>
        <Pagination v-if="!isContest"
                    key="page"
                    :total="total"
                    :page-size="limit"
                    @on-change="getAnnouncementList">
        </Pagination>
      </template>

      <template v-else>
        <div v-katex v-html="announcement.content" key="content" class="content-container markdown-body"></div>
      </template>
    </transition-group>
  </Panel>
</template>

<script>
  import api from '@oj/api'
  import Pagination from '@oj/components/Pagination'

  export default {
    name: 'Announcement',
    components: {
      Pagination
    },
    data () {
      return {
        limit: 10,
        total: 10,
        btnLoading: false,
        announcements: [],
        announcement: '',
        listVisible: true,
        showMyMessage: false
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        if (this.$route.name === 'user-massage') {
          this.showMyMessage = true
          this.getAnnouncementList()
        } else if (this.isContest) {
          this.getContestAnnouncementList()
        } else {
          this.getAnnouncementList()
        }
      },
      getAnnouncementList (page = 1) {
        this.btnLoading = true
        api.getAnnouncementList(page, this.limit, this.showMyMessage).then(res => {
          this.btnLoading = false
          this.announcements = res.data.data.records
          this.total = res.data.data.total
        }, () => {
          this.btnLoading = false
        })
      },
      getContestAnnouncementList () {
        this.btnLoading = true
        api.getContestAnnouncementList(this.$route.params.contestID).then(res => {
          this.btnLoading = false
          this.announcements = res.data.data
        }, () => {
          this.btnLoading = false
        })
      },
      goAnnouncement (announcement) {
        if (this.showMyMessage && announcement.status === 0) {
          api.hasReadMessage(announcement.id).then(res => {
            announcement.status = 1
            this.announcement = announcement
            this.listVisible = false   
          }).catch(_ => {
            this.listVisible = false
          })
        } else {
          this.announcement = announcement
          this.listVisible = false 
        }
      },
      goBack () {
        this.listVisible = true
        this.announcement = ''
      }
    },
    computed: {
      title () {
        if (this.showMyMessage) {
          return this.$i18n.t('m.Message')
        } else if (this.listVisible) {
          return this.isContest ? this.$i18n.t('m.Contest_Announcements') : this.$i18n.t('m.Announcements')
        } else {
          return this.announcement.title
        }
      },
      isContest () {
        return !!this.$route.params.contestID
      }
    }
  }
</script>

<style scoped lang="less">
  .announcement {
    background: var(--table-card-top);
    color: var(--font-color-white);
  }
  .ivu-card {
    color: var(--font-color-white);
    background: var(--table-card-top);
  }
  /deep/.ivu-btn-ghost {
    color: var(--font-color-white);
  }
  .announcements-container {
    margin-top: -10px;
    margin-bottom: 10px;
    li {
      padding-top: 15px;
      list-style: none;
      padding-bottom: 15px;
      margin-left: 20px;
      font-size: 16px;
      border-bottom: 1px solid rgba(187, 187, 187, 0.5);
      &:last-child {
        border-bottom: none;
      }
      .flex-container {
        .title {
          flex: 1 1;
          text-align: left;
          padding-left: 10px;
          a.entry {
            color: var(--font-color-white);
            &:hover {
              color: #2d8cf0;
              border-bottom: 1px solid #2d8cf0;
            }
          }
        }
        .creator {
          flex: none;
          width: 200px;
          text-align: center;
        }
        .date {
          flex: none;
          width: 200px;
          text-align: center;
        }
      }
    }
  }

  .content-container {
    padding: 0 20px 20px 20px;
  }

  .no-announcement {
    text-align: center;
    font-size: 16px;
  }changeLocale

  .announcement-animate-enter-active {
    animation: fadeIn 1s;
  }
</style>
<style>
  .add-blue {
    color: #08c !important;
  }
</style>
