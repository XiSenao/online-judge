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
        :data="problemList.filter(res => {
					return contestId ? res.status !== -1 : true
				})"
        @row-dblclick="handleDblclick"
        style="width: 100%">
        <el-table-column
          width="100"
          prop="id"
          label="ID">
        </el-table-column>
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
          :prop="contestId ? 'level' : 'creator'"
          :label="contestId ? 'Difficulty' : 'Author'">
        </el-table-column>
        <el-table-column
					v-if="!contestId"
          width="200"
          prop="crtTs"
          label="Create Time">
          <template slot-scope="scope">
            {{scope.row.crtTs}}
          </template>
        </el-table-column>
				<el-table-column
					v-if="contestId"
          width="200"
					prop="spj"
          label="Special Judge">
          <template slot-scope="scope">
            {{scope.row.spj > 0 ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          label="Public">
          <template slot-scope="scope">
            <el-switch v-model="contestId ? scope.row.status === 1 ? true : false : scope.row.status > -1 ? true : false"
                       active-text=""
                       inactive-text=""
                       @change="updateProblem(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="Operation"
          width="250">
          <div slot-scope="scope">
            <icon-btn name="Edit" icon="edit" @click.native="goEdit(scope.row.id)"></icon-btn>
            <icon-btn icon="download" name="Download TestCase"
                      @click.native="downloadTestCase(scope.row.id)"></icon-btn>
          </div>
        </el-table-column>
      </el-table>
      <div class="panel-options">
        <el-button type="primary" size="small"
                   @click="goCreateProblem" icon="el-icon-plus">Create Machine Problem 
        </el-button>
		<el-button type="info" size="small"
                   @click="goCreateSpiderProblem" icon="el-icon-plus">Create Spider Problem
        </el-button>
        <el-button v-if="contestId" type="primary"
									 disabled
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
	mounted () {
		this.routeName = this.$route.name
		this.contestData = this.$route.params.contestData
		console.log(this.$route.params)
		if (this.contestData) {
			let Base64 = require('js-base64').Base64
			this.contestData = JSON.parse(Base64.decode(this.contestData))
			console.log(this.contestData)
			this.contestId = this.contestData.contestId
		}
		this.getProblemList(this.currentPage)
	},
	methods: {
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
				this.$router.push({name: 'create-contest-problem', params: {contestData: this.$route.params.contestData}})
			}
		},
		goCreateSpiderProblem () {
			console.log(this.routeName)
			if (this.routeName === 'problem-list') {
				this.$router.push({name: 'create-spider-problem'})
			} else if (this.routeName === 'contest-problem-list') {
				this.$router.push({name: 'create-contest-spider-problem', params: {contestData: this.$route.params.contestData}})
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
			let params = {
				limit: this.pageSize,
				offset: page,
				paramData: this.keyword,
				contestId: this.contestId
			}
			api[funcName](params).then(res => {
				if (funcName === 'getContestProblemList') {
					let { data } = res, contestLists = []
					for (let i = 0; i < data.data.length; ++i) {
						let problemId = data.data[i]
						contestLists.push(api.getContestProblem(problemId))
					}
					Promise.all(contestLists).then(res => {
						this.loading = false
						this.total = contestLists.length
						this.problemList = []
						for (let i = 0; i < res.length; ++i) {
							let problemInfo = res[i].data.data
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
			let data = Object.assign({}, row)
			let status = null
			if (this.contestId) {
				// 比赛题目列表
				status = data.status === 1 ? 0 : 1
			} else {
				// 普通题目列表
				status = data.status > -1 ? -1 : 1
			}
			let params = {
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
			this.$refs.form.resetFields()
			this.contestId = newVal.params.contestId
			this.routeName = newVal.name
			this.getProblemList(this.currentPage)
		},
		'keyword' () {
			if (!this.contestId) {
				this.currentChange()
			} else {
				let reg = new RegExp(this.keyword)
				this.problemList = this.cProblemList.filter(res => {
					return !this.keyword.trim() || reg.test(res.id + res.title)
				})
			}
		}
	}
}
</script>

<style scoped lang="less">
</style>