<template>
  <div class="view">
    <Panel :title="contestId ? this.$i18n.t('m.Contest_Problem_List') : this.$i18n.t('m.Problem_List')">
      <div slot="header">
        <el-input
          v-model="keyword"
          prefix-icon="el-icon-search"
          placeholder="Keywords"
        />
      </div>
      <el-table
        v-loading="loading"
        ref="table"
        :data="problemList.filter(res => {
          return contestId ? res.status !== -1 : true
        })"
        element-loading-text="loading"
        style="width: 100%"
        @row-dblclick="handleDblclick"
      >
        <el-table-column
          width="100"
          prop="id"
          label="ID"
        />
        <el-table-column
          prop="title"
          label="Title"
        >
          <template slot-scope="{row}">
            <span v-show="!row.isEditing">{{ row.title }}</span>
            <el-input v-show="row.isEditing" v-model="row.title" @keyup.enter.native="handleInlineEdit(row)" />
          </template>
        </el-table-column>
        <el-table-column
          :prop="contestId ? 'level' : 'creator'"
          :label="contestId ? 'Difficulty' : 'Author'"
        />
        <el-table-column
          v-if="!contestId"
          width="200"
          prop="crtTs"
          label="Create Time"
        >
          <template slot-scope="scope">
            {{ scope.row.crtTs }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="contestId"
          width="200"
          prop="spj"
          label="Special Judge"
        >
          <template slot-scope="scope">
            {{ scope.row.spj > 0 ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          label="Public"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="contestId ? scope.row.status === 1 ? true : false : scope.row.status > -1 ? true : false"
              active-text=""
              inactive-text=""
              @change="updateProblem(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="Operation"
          width="250"
        >
          <div slot-scope="scope">
            <icon-btn name="Edit" icon="edit" @click.native="goEdit(scope.row.id)" />
            <icon-btn icon="download" name="Download TestCase" @click.native="downloadTestCase(scope.row.id)" />
          </div>
        </el-table-column>
      </el-table>
      <div class="panel-options">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="goCreateProblem"
        >Create Machine Problem
        </el-button>
        <el-button
          type="info"
          size="small"
          icon="el-icon-plus"
          @click="goCreateSpiderProblem"
        >Create Spider Problem
        </el-button>
        <el-button
          v-if="contestId"
          type="primary"
          disabled
          icon="el-icon-plus"
          size="small"
          @click="addProblemDialogVisible = true"
        >Add From Public Problem
        </el-button>
        <el-pagination
          :page-size="pageSize"
          :total="total"
          class="page"
          layout="prev, pager, next"
          @current-change="currentChange"
        />
      </div>
    </Panel>
    <el-dialog
      :visible.sync="InlineEditDialogVisible"
      title="Sure to update the problem? "
      width="20%"
      @close-on-click-modal="false"
    >
      <div>
        <p>DisplayID: {{ currentRow._id }}</p>
        <p>Title: {{ currentRow.title }}</p>
      </div>
      <span slot="footer">
        <cancel @click.native="InlineEditDialogVisible = false; getProblemList(currentPage)" />
        <save @click.native="updateProblem(currentRow)" />
      </span>
    </el-dialog>
    <el-dialog
      v-if="contestId"
      :visible.sync="addProblemDialogVisible"
      title="Add Contest Problem"
      width="80%"
      @close-on-click-modal="false"
    >
      <add-problem-component :contest-i-d="contestId" @on-change="getProblemList" />
    </el-dialog>
  </div>
</template>

<script>
import api from '../../api.js'
import AddProblemComponent from './AddPublicProblem.vue'
export default {
  name: 'ProblemList',
  components: {
    AddProblemComponent
  },
  data () {
    return {
      pageSize: 10,
      total: 0,
      problemList: [],
      cProblemList: null,
      keyword: '',
      loading: false,
      currentPage: 1,
      routeName: '',
      contestId: '',
			// for make public use
      currentProblemID: '',
      currentRow: {},
      InlineEditDialogVisible: false,
      makePublicDialogVisible: false,
      addProblemDialogVisible: false
    }
  },
  watch: {
    '$route' (newVal, oldVal) {
      this.$refs.form.resetFields()
      this.contestId = newVal.params.contestId
      this.routeName = newVal.name
      this.getProblemList(this.currentPage)
    },
    'keyword' () {
      if (!this.contestId) {
        this.currentChange()
      } else {
        const reg = new RegExp(this.keyword)
        this.problemList = this.cProblemList.filter(res => {
          return !this.keyword.trim() || reg.test(res.id + res.title)
        })
      }
    }
  },
  mounted () {
    this.routeName = this.$route.name
    this.contestData = this.$route.params.contestData
    if (this.contestData) {
      const Base64 = require('js-base64').Base64
      this.contestData = JSON.parse(Base64.decode(this.contestData))
      this.contestId = this.contestData.contestId
    }
    this.getProblemList(this.currentPage)
  },
  methods: {
    handleDblclick (row) {
      row.isEditing = true
    },
    goEdit (problemId) {
      if (this.routeName === 'ProblemList') {
        this.$router.push({ name: 'EditProblem', params: { problemId }})
      } else if (this.routeName === 'ContestProblemList') {
        this.$router.push({ name: 'EditContestProblem', params: { problemId: problemId, contestId: this.contestId }})
      }
    },
    goCreateProblem () {
      if (this.routeName === 'ProblemList') {
        this.$router.push({ name: 'CreateMachineProblem' })
      } else if (this.routeName === 'ContestProblemList') {
        this.$router.push({ name: 'CreateContestProblem', params: { contestData: this.$route.params.contestData }})
      }
    },
    goCreateSpiderProblem () {
      if (this.routeName === 'ProblemList') {
        this.$router.push({ name: 'CreateSpiderProblem' })
      } else if (this.routeName === 'ContestProblemList') {
        this.$router.push({ name: 'CreateContestSpiderProblem', params: { contestData: this.$route.params.contestData }})
      }
    },
		// 切换页码回调
    currentChange (page) {
      this.currentPage = page
      this.getProblemList(page)
    },
    getProblemList (page = 1) {
      this.loading = true
      const funcName = this.routeName === 'ProblemList' ? 'getProblemList' : 'getContestProblemList'
      const params = {
        limit: this.pageSize,
        offset: page,
        paramData: this.keyword,
        contestId: this.contestId
      }
      api[funcName](params).then(res => {
        if (funcName === 'getContestProblemList') {
          const { data } = res
          const contestLists = []
          for (let i = 0; i < data.data.length; ++i) {
            const problemId = data.data[i]
            contestLists.push(api.getContestProblem(problemId))
          }
          Promise.all(contestLists).then(res => {
            this.loading = false
            this.total = contestLists.length
            this.problemList = []
            for (let i = 0; i < res.length; ++i) {
              const problemInfo = res[i].data.data
              this.problemList.push(problemInfo)
            }
            this.cProblemList = this.problemList
          })
        } else {
          this.loading = false
          this.total = res.data.data.total
          this.problemList = res.data.data.records
          if (funcName === 'getProblemList') {
            this.problemList.filter(res => res.status === 1 || res.status === -1)
          } else if (funcName === 'getContestProblemList') {
            this.problemList.filter(res => res.status === 0 || res.status === -1)
          }
        }
      }, res => {
        this.loading = false
      })
    },
    updateProblem (row) {
      const data = Object.assign({}, row)
      let status = null
      if (this.contestId) {
				// 比赛题目列表
        status = data.status === 1 ? 0 : 1
      } else {
				// 普通题目列表
        status = data.status > -1 ? -1 : 1
      }
      const params = {
        problemId: data.id,
        status
      }
      api.exchangeStatus(params).then(res => {
        this.InlineEditDialogVisible = false
        this.getProblemList(this.currentPage)
      }).catch(e => {
        this.InlineEditDialogVisible = false
      })
    },
    handleInlineEdit (row) {
      this.currentRow = row
      this.InlineEditDialogVisible = true
    },
    downloadTestCase (problemID) {
      api.getZipFile(problemID).then(res => {
        const blob = new Blob([res.data], { type: 'application/zip' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a') // 创建a标签
        link.href = url
				// link.download = `导出${utils.getTimeString(new Date())}` // 重命名文件
        link.click()
        URL.revokeObjectURL(url) // 释放内存
      })
    },
    getPublicProblem () {
      api.getProblemList()
    }
  }
}
</script>

