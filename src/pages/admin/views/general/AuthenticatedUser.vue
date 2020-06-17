<template>
	<div class="authenticated-user">
		<Panel :title="!contestID ? 'Authenticated User' : 'Authenticated Contest User'">
			<div slot="header" v-if="!contestID">
				<icon-btn name="Add a new authentication type" icon="plus" @click.native="addNewAuthenticationType"></icon-btn>
			</div>
      <div class="list">
        <el-table
          v-loading="loading"
          element-loading-text="loading"
          ref="table"
          :data="contestID ? contestAuthUserList : authenticatedUserList"
          style="width: 100%">
					<template v-if="!contestID">
						<el-table-column
							type="expand">
							<template slot-scope="props">
								<el-form label-position="left" inline class="demo-table-expand">
									<el-form-item label="学校:">
										<span>{{ props.row.school }}</span>
									</el-form-item>
									<el-form-item label="专业:">
										<span>{{ props.row.major }}</span>
									</el-form-item>
									<el-form-item label="班级:">
										<span>{{ props.row.faculty }}</span>
									</el-form-item>
									<el-form-item label="真实姓名:">
										<span>{{ props.row.realName }}</span>
									</el-form-item>
									<el-form-item label="学号:">
										<span>{{ props.row.stuId }}</span>
									</el-form-item>
									<el-form-item label="手机号:">
										<span>{{ props.row.phone }}</span>
									</el-form-item>
									<el-form-item label="毕业时间:">
										<span>{{ props.row.graduationTime | localtime }}</span>
									</el-form-item>
								</el-form>
							</template>
						</el-table-column>
					</template>
          <el-table-column
            :prop="!contestID ? 'username' : 'contestId'"
            :label="!contestID ? 'Username' : 'Contest ID'">
          </el-table-column>
          <el-table-column
            :label="!contestID ? 'Gender' : 'Real Name'">
						<template slot-scope="scope">
							{{!contestID ? scope.row.sex : scope.row.detailMsg.realName ? scope.row.detailMsg.realName : '-' }}
						</template>
          </el-table-column>
					<el-table-column
						v-if="contestID"
            label="Phone">
						<template slot-scope="scope">
							{{scope.row.detailMsg.phone ? scope.row.detailMsg.phone : '-' }}
						</template>
          </el-table-column>
					<el-table-column
						v-if="contestID"
            label="School">
						<template slot-scope="scope">
							{{scope.row.detailMsg.school ? scope.row.detailMsg.school : '-' }}
						</template>
          </el-table-column>
					<el-table-column
						v-if="contestID"
            label="Major">
						<template slot-scope="scope">
							{{scope.row.detailMsg.major ? scope.row.detailMsg.major : '-' }}
						</template>
          </el-table-column>
          <el-table-column
            prop="crtTs"
            label="Create Time">
            <template slot-scope="scope">
              {{ scope.row.crtTs }}
            </template>
          </el-table-column>
					<el-table-column
            prop="lmTs"
            label="Last Modify Time">
            <template slot-scope="scope">
              {{ scope.row.lmTs }}
            </template>
          </el-table-column>
					<el-table-column
						v-if="!contestID"
            prop="lmTs"
            label="Application Type">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
					<el-table-column 
						v-if="!contestID"
						fixed="right"
						width="220"
						label="Operation">
						<template slot-scope="scope">
							<icon-btn name="同意" icon="check-square-o" v-show="scope.row.status === 0 || scope.row.status === -1" @click.native="handleExchangeStatus(scope.row, 1)"></icon-btn>
            	<icon-btn name="拒绝" icon="times" v-show="scope.row.status === 0 || scope.row.status === 1" @click.native="handleExchangeStatus(scope.row, -1)"></icon-btn>
						</template>
					</el-table-column>
					<el-table-column
						v-if="contestID"
						fixed="right"
						width="180"
						label="Operation">
						<template slot-scope="scope">
							<icon-btn name="同意" icon="check" @click.native="exStatus(scope.row.id, 1)" v-show="!scope.row.status || scope.row.status === -1"></icon-btn>
            	<icon-btn name="拒绝" icon="times" @click.native="exStatus(scope.row.id, -1)" v-show="!scope.row.status || scope.row.status === 1"></icon-btn>
						</template>
					</el-table-column>
        </el-table>
        <div class="panel-options">
          <el-pagination
            class="page"
            layout="prev, pager, next"
            @current-change="currentChange"
            :page-size="pageSize"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </Panel>
		<el-dialog 
			class="s-dialog" 
			title="Authentication Type" 
			:visible.sync="showAuthenticationTypeDialog" 
			@open="onOpenEditDialog" 
			:close-on-click-modal="false">
			<Spin size="large" fix v-show="spinShow"></Spin>
			<p class="a-tip">已使用认证标签<i class="el-icon-circle-check" style="margin-left: 4px; color: green;"></i></p>
			<star-input-tag 
				v-model="authenticationTypeList"
				:check-r="1" 
				:saveList="typeSavaList"
				theme="+ New Type" />
			<div class="a-tip">未使用认证标签<i class="el-icon-error" style="margin-left: 4px; color: red;"></i></div>
			<star-input-tag 
				v-model="authenticationTypeList"
				:check-r="0"
				:saveList="typeSavaList"/>
		</el-dialog>
	</div>
</template>

<script>
	import api from '../../api.js'
	import starInputTag from '../../components/Tag'
	export default {
		name: 'AuthenticatedUser',
		components: {
			starInputTag
		},
		data () {
			return {
				authenticatedUserList: [],
				pageSize: 10,
				currentPage: 1,
				contestID: 0,
				total: 0,
				loading: true,
				showAuthenticationTypeDialog: false,
				authenticationTypeVisible: false,
				authenticationTypeList: [],
				authenticationType: '',
				contestAuthUserList: [],
				typeSavaList: [],
				spinShow: true
			}
		},
		created () {
			this.contestID = this.$route.params.contestId
		},
		mounted () {
			if (this.contestID) {
				this.getContestAuthenticatedUserList()
			} else {
				this.getAuthenticatedUserList()
			}
		},
		methods: {
			// 改变审核比赛用户状态
			exStatus (id, status) {
				if (this.contestID) {
					let params = {
						id, 
						status,
						contestId: this.contestID
					}
					api.exchangeAuthUser(params).then(res => {
						this.getContestAuthenticatedUserList()
					})
				}
			},
			onOpenEditDialog () {
				setTimeout(() => {
          if (document.createEvent) {
            let event = document.createEvent('HTMLEvents')
            event.initEvent('resize', true, true)
            window.dispatchEvent(event)
          } else if (document.createEventObject) {
            window.fireEvent('onresize')
          }
        }, 0)
			},
			addNewAuthenticationType () {
				this.showAuthenticationTypeDialog = true
				this.spinShow = true
				this.getAuthenticationType()
			},
			getAuthenticationType () {
				api.getAuthenticationType().then(res => {
					this.spinShow = false
					this.authenticationTypeList = res.data.data
				})
			},
			currentChange (page) {
				this.currentPage = page
				this.getAuthenticatedUserList(this.currentPage)
			},
			handleExchangeStatus (row, check) {
				let userId = row.userId
				api.exchangeAuthenticatedStatus(userId, check).then(res => {
					this.authenticatedUserList = res.data.data.records
					this.getAuthenticatedUserList(this.currentPage)
				})
			},
			getContestAuthenticatedUserList () {
				this.loading = true
				let params = {
					contestId: this.contestID
				}
				let data = {
					limit: this.pageSize,
					offset: this.currentPage,
					paramData: null
				}
				api.getContestAuthenticatedUserList(params, data).then(res => {
					this.loading = false
					let nowValue = res.data.data.records
					for (let value of nowValue) {
						value.detailMsg = value.detailMsg && value.detailMsg !== 'null' ? JSON.parse(value.detailMsg) : {}
					}
					this.contestAuthUserList = nowValue
				}).catch(e => {
					this.loading = false
				}) 
			},
			getAuthenticatedUserList () {
				this.loading = true
				api.getAuthenticatedUserList(this.currentPage, this.pageSize).then(res => {
					this.loading = false
					let records = res.data.data.records
					this.authenticatedUserList = []
					Object.keys(records).forEach(res => {
						let now = records[res]
						this.authenticatedUserList.push(now)
					})
					this.total = res.data.data.total
				})
			}
		},
		watch: {
			'showAuthenticationTypeDialog' (newValue) {
				if (!newValue) {
					this.$confirm('Are you sure you want to save these tags?', 'Warning', {
						confirmButtonText: 'Save',
						cancelButtonText: 'Cancel',
						type: 'warning'
					}).then(_ => {
						let updateTypeNameQueue = []
						for (let i = 0; i < this.typeSavaList.length; ++i) {
							let nowValue = this.typeSavaList[i]
							let data = {
								id: nowValue.id,
								name: nowValue.name
							}
							updateTypeNameQueue.push(api.updateTypeName(data))
						}
						Promise.all(updateTypeNameQueue).then(res => {
							let saveList = this.authenticationTypeList.filter(res => res.status === 1).map(res => res.name)
							api.saveAuthenticationType(saveList).then(res => {
								this.$Message.info('保存标签成功')
							}).catch(_ => {
								this.$Message.info('保存标签失败')
							})
						})
					}).catch(_ => {})
				}
			}
		}
	}
</script>

<style>
	.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
	}
	.s-dialog {
		position: absolute;
	}
	.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
	.a-tip {
		color: #464c5b; 
		font-size: 12px; 
		font-weight: 700; 
		font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif; 
		margin: 15px 6px;
	}
	.el-tag {
		margin: 3px;
	}
</style>