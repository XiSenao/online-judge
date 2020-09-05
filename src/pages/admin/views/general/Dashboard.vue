<template>
  <el-row type="flex" :gutter="20" justify="center" align="middle" style="margin-bottom: 230px;">
    <el-col :md="24" :lg="8">
      <el-card class="admin-info">
        <el-row :gutter="20">
          <el-col :span="10">
            <img class="avatar" :src="user.avatar" />
          </el-col>
          <el-col :span="14">
            <p class="admin-info-name">{{ user.username }}</p>
            <p>{{ user.admin_type }}</p>
          </el-col>
        </el-row>
        <hr />
        <div class="last-info">
          <p class="last-info-title">{{ $t('m.Last_Login') }}</p>
          <el-form label-width="80px" class="last-info-body">
            <el-form-item label="Time:">
              <span>{{ session.last_activity | localtime }}</span>
            </el-form-item>
            <el-form-item label="OS">
              <span>{{ os }}</span>
            </el-form-item>
            <el-form-item label="Browser:">
              <span>{{ browser }}</span>
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

  export default {
    name: 'Dashboard',
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
        releases: [],
        user: {}
      }
    },
    computed: {
      ...mapGetters({
        profile: 'admin/user'
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
        const b = browserDetector(this.session.user_agent)
        if (b.name && b.version) {
          return b.name + ' ' + b.version
        } else {
          return 'Unknown'
        }
      },
      os () {
        const b = browserDetector(this.session.user_agent)
        return b.os ? b.os : 'Unknown'
      }
    },
    mounted () {
      this.user = JSON.parse(JSON.stringify(this.profile))
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
      width: 130px;
      height: 100px;
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
