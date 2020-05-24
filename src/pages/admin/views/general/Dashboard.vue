<template>
  <el-row type="flex" :gutter="20" justify="center" align="middle" style="margin-bottom: 230px;">
    <el-col :md="24" :lg="8">
      <el-card class="admin-info">
        <el-row :gutter="20">
          <el-col :span="10">
            <img class="avatar" :src="user.avatar"/>
          </el-col>
          <el-col :span="14">
            <p class="admin-info-name">{{user.username}}</p>
            <p>{{user.admin_type}}</p>
          </el-col>
        </el-row>
        <hr/>
        <div class="last-info">
          <p class="last-info-title">{{$t('m.Last_Login')}}</p>
          <el-form label-width="80px" class="last-info-body">
            <el-form-item label="Time:">
              <span>{{session.last_activity | localtime}}</span>
            </el-form-item>
            <el-form-item label="OS">
              <span>{{os}}</span>
            </el-form-item>
            <el-form-item label="Browser:">
              <span>{{browser}}</span>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import { mapGetters } from 'vuex'
  import browserDetector from 'browser-detect'
  import InfoCard from '@admin/components/infoCard.vue'
  import api from '@admin/api'

  export default {
    name: 'dashboard',
    components: {
      InfoCard
    },
    data () {
      return {
        infoData: {
          user_count: 0,
          recent_contest_count: 0,
          today_submission_count: 0,
          judge_server_count: 0,
          env: {}
        },
        activeNames: [1],
        session: {},
        loadingReleases: true,
        releases: []
      }
    },
    mounted () {
      // api.getDashboardInfo().then(resp => {
      //   this.infoData = resp.data.data
      // }, () => {
      // })
      // api.getSessions().then(resp => {
      //   this.parseSession(resp.data.data)
      // }, () => {
      // })
      // api.getReleaseNotes().then(resp => {
      //   this.loadingReleases = false
      //   let data = resp.data.data
      //   if (!data) {
      //     return
      //   }
      //   let currentVersion = data.local_version
      //   data.update.forEach(release => {
      //     if (release.version > currentVersion) {
      //       release.new_version = true
      //     }
      //   })
      //   this.releases = data.update
      // }, () => {
      //   this.loadingReleases = false
      // })
    },
    methods: {
      // parseSession (sessions) {
      //   let session = sessions[0]
      //   if (sessions.length > 1) {
      //     session = sessions.filter(s => !s.current_session).sort((a, b) => {
      //       return a.last_activity < b.last_activity
      //     })[0]
      //   }
      //   this.session = session
      // }
    },
    computed: {
      ...mapGetters({
        user: 'admin/user'
      }),
      cdn () {
        return this.infoData.env.STATIC_CDN_HOST
      },
      https () {
        return document.URL.slice(0, 5) === 'https'
      },
      forceHttps () {
        return this.infoData.env.FORCE_HTTPS
      },
      browser () {
        let b = browserDetector(this.session.user_agent)
        if (b.name && b.version) {
          return b.name + ' ' + b.version
        } else {
          return 'Unknown'
        }
      },
      os () {
        let b = browserDetector(this.session.user_agent)
        return b.os ? b.os : 'Unknown'
      }
    }
  }
</script>

<style lang="less">
  .admin-info {
    margin-bottom: 20px;
    &-name {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 10px;
      color: #409EFF;
    }
    .avatar {
      max-width: 100%;
    }
    .last-info {
      &-title {
        font-size: 16px;
      }
      &-body {
        .el-form-item {
          margin-bottom: 5px;
        }
      }
    }
  }

  .info-container {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .info-item {
      flex: 1 0 auto;
      min-width: 200px;
      margin-bottom: 10px;
    }
  }

</style>
