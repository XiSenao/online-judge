<template>
  <div class="view">
    <Panel :title="contestId ? this.$i18n.t('m.Contest_Problem_List') : this.$i18n.t('m.Problem_List')">
      <div slot="header">
        <el-input
          v-model="keyword"
          prefix-icon="el-icon-search"
          placeholder="Keywords">
        </el-input>
      </div>
      <el-table
        v-loading="loading"
        element-loading-text="loading"
        ref="table"
        :data="problemList"
        @row-dblclick="handleDblclick"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID">
        </el-table-column>
        <!-- <el-table-column
          width="150"
          label="Display ID">
          <template slot-scope="{row}">
            <span v-show="!row.isEditing">{{row._id}}</span>
            <el-input v-show="row.isEditing" v-model="row._id"
                      @keyup.enter.native="handleInlineEdit(row)">

            </el-input>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="title"
          label="Title">
          <template slot-scope="{row}">
            <span v-show="!row.isEditing">{{row.title}}</span>
            <el-input v-show="row.isEditing" v-model="row.title"
                      @keyup.enter.native="handleInlineEdit(row)">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="creator"
          label="Author">
        </el-table-column>
        <el-table-column
          width="200"
          prop="crtTs"
          label="Create Time">
          <template slot-scope="scope">
            {{scope.row.create_time | localtime }}
          </template>
        </el-table-column>
        <el-table-column
          label=" None | Contest | Normal ">
          <template slot-scope="scope">
            <Slider v-model="scope.row.status + 1" @on-change="updateProblemStatus(scope.row)" :step="1" :max="2" :tip-format="showTipInfo" style="z-index: 999;"></Slider>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :push="15"
          :span="15"
          label="Operation">
          <div slot-scope="scope">
            <icon-btn name="Edit" icon="edit" @click.native="goEdit(scope.row.id)"></icon-btn>
            <icon-btn icon="download" name="Download TestCase"
                      @click.native="downloadTestCase(scope.row.id)"></icon-btn>
            <icon-btn icon="trash" name="Delete Problem"
                      @click.native="deleteProblem(scope.row.id)"></icon-btn>
          </div>
        </el-table-column>
      </el-table>
      <div class="panel-options">
        <el-button type="primary" size="small"
                   @click="goCreateProblem" icon="el-icon-plus">Create
        </el-button>
        <el-button v-if="contestId" type="primary"
                   size="small" icon="el-icon-plus"
                   @click="addProblemDialogVisible = true">Add From Public Problem
        </el-button>
        <el-pagination
          class="page"
          layout="prev, pager, next"
          @current-change="currentChange"
          :page-size="pageSize"
          :total="total">
        </el-pagination>
      </div>
    </Panel>
    <el-dialog title="Sure to update the problem? "
               width="20%"
               :visible.sync="InlineEditDialogVisible"
               @close-on-click-modal="false">
      <div>
        <p>DisplayID: {{currentRow._id}}</p>
        <p>Title: {{currentRow.title}}</p>
      </div>
      <span slot="footer">
        <cancel @click.native="InlineEditDialogVisible = false; getProblemList(currentPage)"></cancel>
        <save @click.native="updateProblem(currentRow)"></save>
      </span>
    </el-dialog>
    <el-dialog title="Add Contest Problem"
               v-if="contestId"
               width="80%"
               :visible.sync="addProblemDialogVisible"
               @close-on-click-modal="false">
      <add-problem-component :contestID="contestId" @on-change="getProblemList"></add-problem-component>
    </el-dialog>
  </div>
</template>

<script>
  import api from '../../api.js'
  import utils from '@/utils/utils'
  import AddProblemComponent from './AddPublicProblem.vue'

  export default {
    name: 'wProblemList',
    components: {
      AddProblemComponent
    },
    data () {
      return {
        pageSize: 10,
        total: 0,
        problemList: [],
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
    mounted () {
      this.routeName = this.$route.name
      this.contestId = this.$route.params.contestId
      this.getProblemList(this.currentPage)
    },
    methods: {
      showTipInfo (value) {
        if (value === 0) {
          return '停用'
        } else if (value === 1) {
          return '比赛'
        } else {
          return '习题'
        }
      },
      handleDblclick (row) {
        row.isEditing = true
      },
      goEdit (problemId) {
        if (this.routeName === 'problem-list') {
          this.$router.push({name: 'edit-problem', params: {problemId}})
        } else if (this.routeName === 'contest-problem-list') {
          this.$router.push({name: 'edit-contest-problem', params: {problemId: problemId, contestId: this.contestId}})
        }
      },
      goCreateProblem () {
        if (this.routeName === 'problem-list') {
          this.$router.push({name: 'create-problem'})
        } else if (this.routeName === 'contest-problem-list') {
          this.$router.push({name: 'create-contest-problem', params: {contestId: this.contestId}})
        }
      },
      // 切换页码回调
      currentChange (page) {
        this.currentPage = page
        this.getProblemList(page)
      },
      getProblemList (page = 1) {
        this.loading = true
        let funcName = this.routeName === 'problem-list' ? 'getProblemList' : 'getContestProblemList'
        // let params = {
        //   limit: this.pageSize,
        //   offset: page,
        //   keyword: this.keyword,
        //   contest_id: this.contestId
        // }
        let params = {
          limit: this.pageSize,
          offset: page,
          paramData: this.keyword
        }
        api['getProblemList'](params).then(res => {
          this.loading = false
          this.total = res.data.data.total
          // for (let problem of res.data.data.records) {
          //   problem.isEditing = false
          // }
          this.problemList = res.data.data.records
          if (funcName === 'getProblemList') {
            this.problemList.filter(res => res.status === 1)
          } else if (funcName === 'getContestProblemList') {
            this.problemList.filter(res => res.status === 0)
          }
        }, res => {
          this.loading = false
        })
      },
      deleteProblem (id) {
        this.$confirm('Sure to delete this problem? The associated submissions will be deleted as well.', 'Delete Problem', {
          type: 'warning'
        }).then(() => {
          let funcName = this.routeName === 'problem-list' ? 'deleteProblem' : 'deleteContestProblem'
          api[funcName](id).then(() => [
            this.getProblemList(this.currentPage - 1)
          ]).catch(() => {
          })
        }, () => {
        })
      },
      makeContestProblemPublic (problem) {
        this.$prompt('Please input display id for the public problem', 'confirm').then(({value}) => {
          api.makeContestProblemPublic({id: problemID, display_id: value}).catch()
        }, () => {
        })
      },
      updateProblemStatus (row) {
        let data = Object.assign({}, row)
        let params = {
          problemId: data.id,
          status: data['status + 1'] - 1
        }
        api.updateProblemStatus(params).then(res => {
          this.getProblemList(this.currentPage)
        })
      },
      updateProblem (row) {
        let data = Object.assign({}, row)
        let funcName = ''
        if (this.contestId) {
          data.contest_id = this.contestId
          funcName = 'editContestProblem'
        } else {
          funcName = 'editProblem'
        }
        api[funcName](data).then(res => {
          this.InlineEditDialogVisible = false
          this.getProblemList(this.currentPage)
        }).catch(() => {
          this.InlineEditDialogVisible = false
        })
      },
      handleInlineEdit (row) {
        this.currentRow = row
        this.InlineEditDialogVisible = true
      },
      downloadTestCase (problemID) {
        api.getZipFile(problemID).then(res => {
          let blob = new Blob([res.data], {type: 'application/zip'})
          let url = window.URL.createObjectURL(blob)
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
    },
    watch: {
      '$route' (newVal, oldVal) {
        this.contestId = newVal.params.contestId
        this.routeName = newVal.name
        this.getProblemList(this.currentPage)
      },
      'keyword' () {
        this.currentChange()
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/.el-table__body-wrapper {
    overflow: visible;
  }
  /deep/.cell {
    overflow: visible;
  }
</style>
