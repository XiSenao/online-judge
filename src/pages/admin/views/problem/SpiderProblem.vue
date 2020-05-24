<template>
	<div class="spider-problem spin">
		<Spin size="large" fix v-show="showSpin"></Spin>
		<Panel :title="'Add_Spider_Problem'">
			<el-form ref="form" :model="spiderProblem" :rules="spiderProblemRules" label-position="top" label-width="70px">
				<el-row type="flex" justify="center">
					<el-col :span="6">
						<el-form :model="spiderProblem">
							<el-tooltip effect="dark" :content="spiderProblem.tipDescription" placement="top-start"> 
								<el-form-item prop="title">
									<md-input v-model="spiderProblem.title" icon="el-icon-search" name="title" placeholder="输入标题">
										Title
									</md-input>
								</el-form-item>
							</el-tooltip>
						</el-form>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="Judge Server" required>
							<el-autocomplete
								class="inline-input"
								v-model="spiderProblem.judgeType"
								:fetch-suggestions="queryjudgeType"
								:trigger-on-focus="true"
								placeholder="请输入内容"
								@keyup="handleJudgeTypeSelect(spiderProblem.judgeType)"
								@select="handleJudgeTypeSelect(spiderProblem.judgeType)"
								@blur="handleJudgeTypeSelect(spiderProblem.judgeType)"
							></el-autocomplete>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="Problem ID" prop="problemID">
							<Input-number v-model="spiderProblem.problemID" ></Input-number>
						</el-form-item>
					</el-col>
					<el-col :span="8">
            <el-form-item :label="$t('m.Difficulty')" prop="difficulty">
              <el-select class="difficulty-select" size="small" :placeholder="$t('m.Difficulty')" v-model="spiderProblem.difficulty">
                <el-option :label="$t('m.Low')" value="easy"></el-option>
                <el-option :label="$t('m.Mid')" value="medium"></el-option>
                <el-option :label="$t('m.High')" value="hard"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item :label="$t('m.Visible')">
							<el-switch
								v-model="spiderProblem.visible"
								active-text=""
								inactive-text="">
							</el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item :label="$t('m.Tag')" required>
							<span class="tags">
								<el-tag
									v-for="tag in spiderProblem.tags"
									:closable="true"
									:close-transition="false"
									:key="tag.id"
									type="success"
									@close="closeTag(tag)"
								>{{tag.value}}</el-tag>
							</span>
							<el-autocomplete
								v-if="inputVisible"
								size="mini"
								class="input-new-tag"
								v-model="tagInput"
								:trigger-on-focus="true"
								@keyup.enter.native="addTag(tagInput)"
								@select="addTag(tagInput)"
								@blur="addTag(tagInput)"
								:fetch-suggestions="querySearch">
							</el-autocomplete>
							<el-button class="button-new-tag" v-else size="small" @click="inputVisible = true">+ {{$t('m.New_Tag')}}</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item :label="$t('m.Source')" required>
							<el-input :placeholder="$t('m.Source')" v-model="spiderProblem.sourceName" :disabled="!!contest.id"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<save @click.native="submit()">Save</save>
			</el-form>
		</Panel>
	</div>
</template>

<script>
	import api from '@/pages/admin/api'
	import MdInput from '@/pages/admin/components/MdInput'
  export default {
		name: 'SpiderProblem',
		components: {
			MdInput
		},
		data () {
			return {
				spiderProblemRules: {
					problemID: { required: true, message: 'ProblemID is required', trigger: 'blur' },
					difficulty: { required: true, message: 'Difficulty is required', trigger: 'blur' }
				},
				inputVisible: '',
				tagInput: '',
				showSpin: false,
				contest: {
					title: '',
					id: 0
				},
				spiderProblem: {
					sourceId: 0,
					difficulty: 'easy',
					visible: true,
					judgeType: '',
					title: '',
					tipDescription: 'If the title is not filled in then the automatic default title is the source title',
					problemID: 0,
					tags: []
				}
			}
		},
		mounted () {
			console.log(this.$route) // create-spider-problem|create-contest-spider-problem
			let contestData = this.$route.params.contestData
			if (contestData) {
				let Base64 = require('js-base64').Base64
				contestData = JSON.parse(Base64.decode(contestData))
				console.log(contestData)
				this.contest.id = contestData.contestId || 0
				this.contest.title = contestData.title || null
				this.spiderProblem.sourceName = this.contest.title
				this.spiderProblem.sourceId = this.contest.id
			}
		},
		methods: {
			queryjudgeType (queryString, cb, cp) {
        let judgeAvailableStyleLists = [], flag = false
        api.getSpiderServer().then(res => {
          let judgeStyleLists = res.data.data, judgeAvailableStyleLists = [], finalResult
          Object.keys(judgeStyleLists).forEach(item => {
            let now = judgeStyleLists[item]
            if (now.status) {
              judgeAvailableStyleLists.push({
                id: now.id,
                value: now.name,
                hostname: now.hostname
              })
            }
					})
					cp && cp(judgeAvailableStyleLists)
          finalResult = queryString ? judgeAvailableStyleLists.filter(res => res.value.indexOf(queryString) > -1) :
          judgeAvailableStyleLists
          this.judgeAvailableStyleLists = judgeAvailableStyleLists
          cb && cb(judgeAvailableStyleLists)
        })
			},
			addTag (tagValue) {
				tagValue = tagValue && tagValue.replace(/\s+/g, '')
				if (!tagValue) {
          return
        }
				let exitValue = this.spiderProblem.tags.find(res => {
					return res.value === tagValue
				})
				if (exitValue) {
					this.$Message.error('题目标签中已经存在')
					return
				}
				this.spiderProblem.tags.push({
					value: tagValue
				})
        this.inputVisible = false
        this.tagInput = ''
			},
			closeTag (tag) {
        this.spiderProblem.tags.splice(this.spiderProblem.tags.indexOf(tag), 1)
			},
			querySearch (queryString, cb, cp) {
        api.getProblemTagList().then(res => {
          let tagList = [], flag = false, backupTagList = []
          for (let tag of res.data.data) {
            if (!this.tagInput.replace(/(^\s*)|(\s*$)/g, '') || tag.name.indexOf(this.tagInput) !== -1) {
              flag = true
              tagList.push({id: tag.id, value: tag.name, status: tag.status})
            }
            backupTagList.push({id: tag.id, value: tag.name, status: tag.status})
          }
          if (!flag) {
            tagList = backupTagList
          }
					cb && cb(tagList)
					cp && cp(tagList) 
        }).catch(() => {
        })
			},
			buildQuery () {
				let sourceName = this.spiderProblem.sourceName
				let contestID = this.contest.id
				let contestTitle = this.contest.title
				if (!contestID && sourceName && sourceName.search(/@/) !== 0) {
					this.spiderProblem.sourceName = '@' + sourceName
				} else if (contestID) {
					this.spiderProblem.sourceName = contestTitle
				}
				return {
					judgeTypeId: this.spiderProblem.judgeTypeId,
					level: this.spiderProblem.difficulty,
					sourceId: this.spiderProblem.sourceId,
					sourceName: this.spiderProblem.sourceName,
					spiderProblemId: Math.floor(this.spiderProblem.problemID),
					status: this.spiderProblem.visible ? contestID ? 0 : 1 : -1,
					tagId: [],
					title: this.spiderProblem.title || null
				}
			},
			submit () {
				if (!this.spiderProblem.judgeType) {
					this.$error('请选择评测机')
					return	
				}
				this.$refs.form.validate((valid) => {
					if (!(this.spiderProblem.sourceName && this.spiderProblem.sourceName.trim().length > 0)) {
						this.$error('请填写完整题目来源')
						return 
					}
					if (valid && this.spiderProblem.problemID && this.spiderProblem.tags.length) {
						let data = this.buildQuery()
						this.showSpin = true
						this.querySearch(null, null, res => {
							let executeQueue = []
							for (let i = 0; i < this.spiderProblem.tags.length; ++i) {
								let nowValue = this.spiderProblem.tags[i]
								let available = res.find(resp => {
									return resp.value === nowValue.value
								})
								// 标签不存在的时候自动创建
								if (!available) {
									executeQueue.push(api.addNewTag(nowValue.value))
								}
							}
							Promise.all(executeQueue).then(res => {
								this.querySearch(null, null, res => {
									let tagId = []
									for (let i = 0; i < this.spiderProblem.tags.length; ++i) {
										let nowValue = this.spiderProblem.tags[i]
										let available = res.find(resp => {
											return resp.value === nowValue.value
										})
										available && tagId.push(available.id)
									}
									data.tagId = tagId
									api.createSpiderProblem(data).then(res => {
										this.$success('创建成功')
										this.showSpin = false
										if (this.$route.name === 'create-spider-problem') {
											this.$router.push({name: 'problem-list'})
										} else {
											console.log(this.$route.params.contestData)
											this.$router.push({name: 'contest-problem-list', params: {contestData: this.$route.params.contestData}})
										}
									})
								})
							})
						})
					} else {
						this.$error('Please check the error fields')
					}
				})
			},
			handleJudgeTypeSelect (judgeTypeValue) {
				if (!judgeTypeValue || !judgeTypeValue.replace(/\s+/g, '')) {
					return
				}
				this.queryjudgeType(null, null, judgeAvailableStyleLists => {
					let nowValue = judgeAvailableStyleLists
					let now = nowValue.find(res => {
						return res.value === judgeTypeValue
					})
					if (!now) {
						this.spiderProblem.judgeType = ''
						this.$Message.error('所填写的评测机不存在')
						return
					}
					this.inputJudgeTypeVisible = false
					this.spiderProblem.judgeTypeId = now.id
				})
			}
		},
		watch: {

		},
		computed: {

		}
	}
</script>

<style scoped>
  .dialog-compile-error {
    width: auto;
    max-width: 80%;
    overflow-x: scroll;
  }
	.spin {
		position: relative;
	}
	.input-new-tag {
		width: 78px;
	}
	.tags .el-tag { 
		margin-right: 10px;
	}
</style>