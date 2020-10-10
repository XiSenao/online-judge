<template>
  <div class="view">
    <Panel title="Contest List">
      <div slot="header">
        <el-input
          v-model="keyword"
          prefix-icon="el-icon-search"
          placeholder="Keywords" />
      </div>
      <el-table
        v-loading="loading"
        ref="table"
        :data="contestList"
        element-loading-text="loading"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <p>Creator: {{ props.row.creator }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          width="80"
          label="ID" />
        <el-table-column
          prop="title"
          label="Title" />
        <el-table-column
          label="Rank Rule"
          width="130">
          <template slot-scope="scope">
            <el-tag type="gray">{{ scope.row.rankModel }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="Sign Up Rule"
          width="180">
          <template slot-scope="scope">
            <el-tag :type="scope.row.signUpRule === CONTEST_QUERY_VALUE.PUBLIC ? 'success' : 'primary'">
              {{ scope.row.signUpRule }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="Status"
          width="130">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === -1 ? 'danger' : scope.row.status === 1 ? 'success' : 'primary'">
              {{ scope.row.status | contestStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          label="Ended">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status === 0 ? true : false"
              active-text=""
              inactive-text=""
              @change="handleEndedSwitch(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          width="280"
          label="Operation">
          <div slot-scope="scope">
            <icon-btn name="Edit" icon="edit" @click.native="goEdit(scope.row.id)" />
            <icon-btn name="Problem" icon="list-ol" @click.native="goContestProblemList(scope.row)" />
            <icon-btn name="Announcement" icon="info-circle" @click.native="goContestAnnouncement(scope.row.id)" />
            <icon-btn name="Authenticated user" icon="users" @click.native="goContestAuthenticatedUser(scope.row.id)" />
          </div>
        </el-table-column>
      </el-table>
      <div class="panel-options">
        <el-pagination
          :page-size="pageSize"
          :total="total"
          class="page"
          layout="prev, pager, next"
          @current-change="currentChange" />
      </div>
    </Panel>
  </div>
</template>

<script>
  import api from '../../api.js'
  import { CONTEST_STATUS_REVERSE, CONTEST_QUERY_VALUE } from '@/utils/constants'

  export default {
    name: 'ContestList',
    filters: {
      contestStatus (value) {
        return CONTEST_STATUS_REVERSE[value].name
      }
    },
    data () {
      return {
        pageSize: 10,
        total: 0,
        contestList: [],
        keyword: '',
        loading: false,
        excludeAdmin: true,
        currentPage: 1,
        currentId: 1,
        downloadDialogVisible: false,
        CONTEST_QUERY_VALUE
      }
    },
    watch: {
      'keyword' () {
        this.currentChange(1)
      }
    },
    mounted () {
      this.getContestList(this.currentPage)
    },
    methods: {
      // 切换页码回调
      currentChange (page) {
        this.currentPage = page
        this.getContestList(page)
      },
      getContestList (page) {
        this.loading = true
        api.getContestList(page, this.pageSize, this.keyword).then(res => {
          this.loading = false
          this.total = res.data.data.total
          this.contestList = res.data.data.records
        }, res => {
          this.loading = false
        })
      },
      goEdit (contestId) {
        this.$router.push({ name: 'EditContest', params: { contestId }})
      },
      goContestAuthenticatedUser (contestId) {
        this.$router.push({ name: 'ContestAuthenticatedUser', params: { contestId }})
      },
      goContestAnnouncement (contestId) {
        this.$router.push({ name: 'ContestAnnouncement', params: { contestId }})
      },
      goContestProblemList (scope) {
        let contestData = {
          contestId: scope.id,
          title: scope.title
        }
        const Base64 = require('js-base64').Base64
        contestData = Base64.encode(JSON.stringify(contestData))
        this.$router.push({ name: 'ContestProblemList', params: { contestData }})
      },
      handleEndedSwitch (row) {
        if (row.status !== 1) {
          this.$Message.error('已经封榜')
          return
        }
        api.changeContestStatus(row.id).then(res => {
          this.getContestList(this.currentPage)
        })
      }
    }
  }
</script>
