<template>
  <div class="problem spin">
		<Spin size="large" fix v-if="utilSpin"></Spin>
    <Panel :title="title">
      <el-form ref="form" :model="problem" :rules="rules" label-position="top" label-width="70px">
        <el-row :gutter="20">
         <el-col :span="6" class="spin">
					 	<Spin size="large" fix v-if="utilProblemSpin"></Spin>
            <el-form-item label="Judge Server" required>
              <el-autocomplete
                class="inline-input"
                v-model="problem.judgeType"
                :fetch-suggestions="queryjudgeType"
                :trigger-on-focus="true"
                placeholder="请输入内容"
                @keyup.enter.native="handleJudgeTypeSelect(problem)"
                @select="handleJudgeTypeSelect(problem)"
								@blur="handleJudgeTypeSelect(problem)"/>
            </el-form-item>
          </el-col>   
          <el-col :span="18">
            <el-form-item prop="title" :label="$t('m.Title')" required>
              <el-input :placeholder="$t('m.Title')" v-model="problem.title"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item prop="description" :label="$t('m.Description')" required>
              <Simditor v-model="problem.description"></Simditor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item prop="input_description" :label="$t('m.Input_Description')" required>
              <Simditor v-model="problem.input_description"></Simditor>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="output_description" :label="$t('m.Output_Description')" required>
              <Simditor v-model="problem.output_description"></Simditor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('m.Time_Limit') + ' (ms)' " required>
              <el-input type="Number" :placeholder="$t('m.Time_Limit')" v-model="problem.time_limit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Memory_limit') + ' (MB)' " required>
              <el-input type="Number" :placeholder="$t('m.Memory_limit')" v-model="problem.memory_limit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Difficulty')">
              <el-select class="difficulty-select" size="small" :placeholder="$t('m.Difficulty')" v-model="problem.difficulty">
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
                v-model="problem.visible"
                active-text=""
                inactive-text="">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="spin">
						<Spin size="large" fix v-if="utilProblemSpin"></Spin>
            <el-form-item :label="$t('m.Tag')" :error="error.tags" required>
              <span class="tags">
                <el-tag
                  v-for="tag in problem.tags"
                  :closable="true"
                  :close-transition="false"
                  :key="tag.id"
                  type="success"
                  @close="closeTag(tag, problem)"
                >{{tag.value}}</el-tag>
              </span>
              <el-autocomplete
                v-if="inputVisible"
                size="mini"
                class="input-new-tag"
                v-model="tagInput"
                :trigger-on-focus="true"
                @keyup.enter.native="addTag(tagInput, problem)"
                @blur="addTag(tagInput, problem)"
                @select="addTag(tagInput, problem)"
                :fetch-suggestions="querySearch"/>
              <el-button class="button-new-tag" v-else size="small" @click="inputVisible = true">+ {{$t('m.New_Tag')}}</el-button>
            </el-form-item>
          </el-col>
					<el-col :span="8">
            <el-form-item :label="$t('m.Languages')" :error="error.languages" required>
              <el-checkbox-group v-model="problem.languages" :min="1">
                <el-tooltip class="spj-radio" v-for="lang in allLanguage.languages" :key="lang.name" effect="dark"
                            :content="lang.description" placement="top-start"> 
                  <el-checkbox :label="lang.name"></el-checkbox>
                </el-tooltip>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <div>
          <el-form-item v-for="(sample, index) in problem.samples" :key="'sample'+index">
            <Accordion :title="'Sample' + (index + 1)">
              <el-button v-if="!spiderFlag" type="warning" size="small" icon="el-icon-delete" slot="header" @click="deleteSample(index)">
                Delete
              </el-button>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item :label="$t('m.Input_Samples')" required>
                    <el-input
                      :rows="5"
                      type="textarea"
                      :placeholder="$t('m.Input_Samples')"
                      v-model="sample.input">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('m.Output_Samples')" required>
                    <el-input
                      :rows="5"
                      type="textarea"
                      :placeholder="$t('m.Output_Samples')"
                      v-model="sample.output">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </Accordion>
          </el-form-item>
        </div>
        <div class="add-sample-btn" v-if="!spiderFlag">
          <button type="button" class="add-samples" @click="addSample()"><i class="el-icon-plus"></i>{{$t('m.Add_Sample')}}
          </button>
        </div>
        <el-form-item style="margin-top: 20px" :label="$t('m.Hint')">
          <Simditor v-model="problem.hint" placeholder=""></Simditor>
        </el-form-item>
        <el-form-item :label="$t('m.Code_Template')">
          <el-row>
            <el-col :span="24" v-for="(v, k) in template" :key="'template'+k">
              <el-form-item>
                <el-checkbox v-model="v.checked">{{ k }}</el-checkbox>
                <div v-if="v.checked">
                  <code-mirror v-model="v.code" :mode="v.mode"></code-mirror>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('m.Special_Judge')" :error="error.spj">
          <el-col :span="24">
            <el-checkbox v-model="problem.spj" @click.native.prevent="switchSpj()">{{$t('m.Use_Special_Judge')}}</el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item v-if="problem.spj">
          <Accordion :title="$t('m.Special_Judge_Code')">
            <template slot="header">
              <span>{{$t('m.SPJ_language')}}</span>
              <el-radio-group v-model="problem.spj_language">
                <el-tooltip class="spj-radio" v-for="lang in allLanguage.spj_languages" :key="lang.name" effect="dark"
                            :content="lang.description" placement="top-start">
                  <el-radio :label="lang.name">{{ lang.name }}</el-radio>
                </el-tooltip>
              </el-radio-group>
              <el-button :type="compileSuccess ? 'success' : 'primary'" size="small" :icon="compileSuccess ? 'el-icon-check' : 'el-icon-fa-random'" @click="compileSPJ" :disabled="compileSuccess"
                         :loading="loadingCompile">
                {{$t('m.Compile')}}
              </el-button>
            </template>
            <code-mirror v-model="problem.spj_code" :mode="spjMode"></code-mirror>
          </Accordion>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('m.TestCase')">
							<UploadDemo 
                ref="uploadZipDemo"
                button-name="Upload"
                file-name="file"
                tip-content="Upload test samples"
                tip-position="top"
                :show-button="false"
                :format-suffix="['zip']"
                :isSpj="!!problem.spj"
                :limitNumber="1"
                :disabled="spiderFlag"
                :get-zip-file-value-lists="getZIPFileValueLists"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item :label="$t('m.IOMode')">
              <el-radio-group v-model="problem.io_mode">
                <el-radio label="Standard IO" checked>Standard IO</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="spin">
						<Spin size="large" fix v-if="utilProblemSpin"></Spin>
						<el-table
						:data="zipFileLists"
						style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form class="demo-table-expand">
                    <el-row :gutter="20" type="flex">
                      <el-col :span="12" style="position: relative;">
                        <icon-btn icon="clipboard" name="Copy"
                        class="sample-read" 
                        :data-clipboard-text="props.row.inputFile.fileValue"
                        @click.native="copySamples"></icon-btn>
                        <el-form-item :label="$t('m.Input_Samples')">
                          <el-input
                            :rows="7"
                            type="textarea"
                            disabled
                            :placeholder="$t('m.Input_Samples')"
                            v-model="props.row.inputFile.fileValue">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" style="position: relative;">
                        <icon-btn icon="clipboard" name="Copy"
                        class="sample-read" 
                        :data-clipboard-text="props.row.outputFile.fileValue"
                        @click.native="copySamples"></icon-btn>
                        <el-form-item :label="!problem.spj ? $t('m.Output_Samples') : $t('m.Input_Samples')">
                          <el-input
                            :rows="7"
                            type="textarea"
                            disabled
                            :placeholder="$t('m.Output_Samples')"
                            v-model="props.row.outputFile.fileValue">
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('m.Input')"
                prop="inputFile.fileName">
              </el-table-column>
              <el-table-column
                :label="!problem.spj ? $t('m.Output') : $t('m.Input')"
                prop="outputFile.fileName">
              </el-table-column>
					  </el-table>
				  </el-col>

          <el-col>
            <el-form-item :label="$t('m.Source')">
              <el-input :placeholder="$t('m.Source')" v-model="problem.source" :disabled="!!problem.contest_id"></el-input>
            </el-form-item>
          </el-col>
				</el-row>
        <save @click.native="submit()">Save</save>
      </el-form>
    </Panel>
  </div>
</template>

<script>
  import Simditor from '../../components/Simditor'
  import Accordion from '../../components/Accordion'
	import CodeMirror from '../../components/CodeMirror'
	import UploadDemo from '../../components/Upload' 
	import Clipboard from 'clipboard'
  import { CONSTANTS_TEMPLATE, CONSTANTS_SPJ_TEMPLATE, LANGUAGES } from '@/utils/constants'
  import { exFormatText } from '@/utils/JudgeServer/poj'
  import api from '../../api'
  import ProblemMixin from './problemMixin'
  const Base64 = require('js-base64').Base64
  export default {
    name: 'Problem',
    mixins: [ProblemMixin],
    components: {
      Simditor,
      Accordion,
			CodeMirror,
			UploadDemo
    },
    data () {
      return {
        rules: {
          _id: {required: true, message: 'Display ID is required', trigger: 'blur'},
          title: {required: true, message: 'Title is required', trigger: 'blur'},
          input_description: {required: true, message: 'Input Description is required', trigger: 'blur'},
          output_description: {required: true, message: 'Output Description is required', trigger: 'blur'}
        },
				loadingCompile: false,
				spinShow: true,
				utilSpin: true,
        utilProblemSpin: true,
        spiderFlag: false,
        contestData: {
          contestID: '',
          title: ''
        },
        mode: '',
        contest: {},
        problem: {
          _id: '',
          contest_id: null,
          title: '',
          description: '',
          input_description: '',
          output_description: '',
          time_limit: 1000,
          memory_limit: 256,
          difficulty: 'easy',
          status: true,
          share_submission: false,
          visible: true,
          tags: [],
          languages: [],
          template: {},
          samples: [{input: '', output: ''}],
          spj: false,
          spj_language: 'C',
          spj_code: '',
          spj_compile_ok: false,
          test_case_id: '',
          test_case_score: [],
          rule_type: 0,
          hint: '',
          source: '',
          judgeType: '',
          io_mode: 'Standard IO'
        },
        currentSpj: false,
				inputJudgeTypeVisible: false,
        testCaseUploaded: false,
        compileSuccess: false,
        allLanguage: {
					languages: []
        },
        contestTitle: '',
        inputVisible: false,
        tagInput: '',
        template: {},
        title: '',
        spjMode: 'text/x-csrc',
				disableRuleType: false,
				zipFileLists: [],
        routeName: '',
        error: {
          tags: '',
          spj: '',
          languages: '',
          testCase: ''
        }
      }
    },
    mounted () {
      this.routeName = this.$route.name
      if (this.routeName === 'edit-problem' || this.routeName === 'edit-contest-problem') {
        this.mode = 'edit'
      } else {
				this.mode = 'add'
      }
      this.allLanguage = LANGUAGES
      if (this.mode === 'edit') {
        this.title = this.$i18n.t('m.Edit_Problem')
        // 获取爬虫或评测机题目信息(共享同一个接口)
        api.getProblem(this.$route.params.problemId).then(problemRes => {
          let data = problemRes.data.data
          if (!data.spjCode) { data.spjCode = '' }
          data.spjLanguage = data.spjLanguage || 'C'
          this.changeServerToData(data)
        })
      } else {
        this.title = this.$i18n.t('m.Add_Problem')
        this.contestData = this.$route.params.contestData 
        try {
          // 创建比赛题目的时候需要contestID和title分别作为sourceId(contest_id)和sourceName(source)
          if (this.contestData) {
            this.contestData = JSON.parse(Base64.decode(this.contestData))
            this.problem.source = this.contestData.title
            this.problem.contest_id = this.contestData.contestId
            this.disableRuleType = true
          }
          this.utilProblemSpin = false
          this.utilSpin = false
        } catch (_) { 
          this.$error('Error!')
          return 
        }
        for (let item of this.allLanguage.languages) {
          this.problem.languages.push(item.name)
        }
      }
    },
    watch: {
      '$route' () {
        // 通用组件间路由切换, 重置显示信息
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      },
      'problem.spj_code' () {
        this.compileSuccess = false
      },
      'problem.languages' (newVal) {
				if (!newVal) {
					return
        }
        let data = {}
        // use deep copy to avoid infinite loop
				let languages = JSON.parse(JSON.stringify(newVal)).sort()
        for (let item of languages) {
          if (this.template[item] === undefined) {
            let langConfig = this.allLanguage.languages.find(lang => {
              return lang.name === item
						})
						data[item] = {checked: false, code: langConfig.config.template, mode: langConfig.content_type}
          } else {
            data[item] = this.template[item]
          }
        }
        this.template = data
      },
      'problem.spj_language' (newVal) {
				if (!newVal) {
					return
        }
        this.compileSuccess = false
        this.spjMode = this.allLanguage.spj_languages.find(item => {
          return item.name === this.problem.spj_language
        }).content_type
			}
    },
    methods: {
      compileSPJ () {
        if (!this.problem.spj_code || !this.problem.judgeType) {
          this.$error('未填写特判代码或未选择评测机')
          return
        }
        let data = {
          spjCode: Base64.encode(this.problem.spj_code),
          spjLanguage: this.problem.spj_language,
          judgeServerName: this.problem.judgeType
        }
        this.loadingCompile = true
        api.compileSpj(data).then(res => {
          this.loadingCompile = false
          if (res.data.data) {
            this.compileSuccess = true
            this.$success('编译成功')
          } else {
            this.compileSuccess = false
            this.$error('编译失败')
          }
        }).catch(_ => {
          this.compileSuccess = false
          this.loadingCompile = false
        })
      },
			copySamples () {
				var clipboard = new Clipboard('.sample-read')  
				clipboard.on('success', e => {  
					this.$success('Copy Success')
					clipboard.destroy()  
				})  
				clipboard.on('error', e => {  
					clipboard.destroy()  
				})  
			},
			getZIPFileValueLists (zipFileLists) {
        let newZipFileLists = []
        this.testCaseUploaded = true
				for (let i = 0; i < zipFileLists.length; ++i) {
					newZipFileLists.push({
						inputFile: zipFileLists[i],
						outputFile: i + 1 < zipFileLists.length ? zipFileLists[i + 1] : '-'
					})
					i++
				}
				this.zipFileLists = newZipFileLists
			},
      switchSpj () {
        const spjTemplate = CONSTANTS_SPJ_TEMPLATE
        // 编辑问题处理
        if (this.testCaseUploaded) {
          this.$confirm('If you change problem judge method, you need to re-upload test cases', 'Warning', {
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
						this.problem.spj = !this.problem.spj
						this.$refs.uploadZipDemo.cleanUploadQueue(1)
            this.zipFileLists = []
            this.problem.spj_code = spjTemplate.template
            this.problem.spjMode = spjTemplate.content_type
            this.testCaseUploaded = false
          }).catch(() => {
            this.problem.spj_code = ''
          })
        } else {
          this.problem.spj = !this.problem.spj
        }
        // 创建问题处理
        if (this.problem.spj) {
          this.problem.spj_code = spjTemplate.template
          this.problem.spjMode = spjTemplate.content_type
        } else {
          this.problem.spj_code = ''
        }
			},
      addSample () {
        this.problem.samples.push({ input: '', output: '' })
      },
      deleteSample (index) {
        this.problem.samples.splice(index, 1)
      },
			changeServerToData (data) {
        let inputSamples = data.inputSamples, outputSamples = data.outputSamples, funcName = '', excutePromiseQueue = []
        excutePromiseQueue.push(api.getSpiderServer(), api.getJudgeServer())
        if (this.spiderFlag) { excutePromiseQueue.pop() }
        Promise.all(excutePromiseQueue).then(judgeServer => {
          let spiderServer = judgeServer[0].data.data, normalJudgeServer = judgeServer[1].data.data
          let currentStatus = [spiderServer, normalJudgeServer]
          for (let valueArr of currentStatus) {
            if (valueArr.some(res => res.id === data.judgeTypeId)) {
              data.judgeType = valueArr.find(res => res.id === data.judgeTypeId).name
              this.spiderFlag = !currentStatus.indexOf(valueArr)
            }
          }
          let currentPromiseQueue = []
          currentPromiseQueue.push(api.getProblemTags(data.id))
          if (this.spiderFlag) {
            inputSamples = [inputSamples]
            outputSamples = [outputSamples]
          } else {
            inputSamples = JSON.parse(inputSamples)
            outputSamples = JSON.parse(outputSamples)
            currentPromiseQueue.push(api.getZipFile(data.id))
          }
          Promise.all(currentPromiseQueue).then(res => {
            let nowTags = res[0].data.data, exTags = [], zipFile = [], Sample = []
            let length = Math.min(inputSamples.length, outputSamples.length)
            var JSZip = require("jszip")
            var new_zip = new JSZip()
            if (!this.spiderFlag) {
              zipFile = res[1].data
              new_zip.loadAsync(zipFile).then(file => {
                let promiseQueue = [], contentValue = [], fileNameLists = []
                Object.keys(file.files).forEach(fileName => {
                  fileNameLists.push(fileName)
                  promiseQueue.push(new_zip.file(fileName).async("string"))
                })
                Promise.all(promiseQueue).then(res => {
                  for (let i = 0; i < res.length; ++i) {
                    contentValue.push({
                      fileName: fileNameLists[i],
                      fileValue: res[i]
                    })
                  }
                  this.getZIPFileValueLists(contentValue)
                })
              }).catch(_ => {
                this.$error('Failed to parse file')
              })
            }
            for (let i = 0; i < length; ++i) {
              Sample.push({
                input: inputSamples[i],
                output: outputSamples[i]
              })
            }
            Object.keys(nowTags).forEach(res => {
              let now = nowTags[res]
              exTags.push({
                id: now.tagId,
                value: now.name
              })
            }) 
            let template = data.codeTemplate ? JSON.parse(Base64.decode(data.codeTemplate)) : {}, templateLists = {}
            Object.keys(template).forEach(res => {
              let nowValue = template[res]
              let nowName = template[res].key, mode = ''
              Object.keys(CONSTANTS_TEMPLATE).forEach(res => {
                let now = CONSTANTS_TEMPLATE[res]
                if (now.name === nowName) {
                  mode = now.content_type
                }
              })
              templateLists[nowName] = {
                checked: false,
                code: nowValue.value,
                mode
              }
            })
            this.template = templateLists
            if (data.sourceName.indexOf('@') === 0) {
              data.sourceName = data.sourceName.substring(1)
            }
            data.description = exFormatText(data.description)
            data.output_description = exFormatText(data.output_description)
            data.input_description = exFormatText(data.input_description)
            this.problem = {
              description: data.description,
              hint: data.hint,
              _id: data.id,
              samples: Sample,
              inputSamples: Sample,
              io_mode: data.ioMode,
              judgeTypeId: data.judgeTypeId,
              languages: data.language.split(','),
              difficulty: data.level,
              memory_limit: data.memoryLimit,
              output_description: data.outputDescription,
              input_description: data.inputDescription,
              contest_id: data.sourceId || 0,
              source: data.sourceName,
              spj: data.spj ? true : false,
              visible: data.status > -1 ? true : false,
              tags: exTags,  
              time_limit: data.timeLimit,
              title: data.title,
              judgeType: data.judgeType,
              spj_language: data.spjLanguage,
              spj_code: data.spjCode
            }
            this.currentSpj = this.problem.spj
            this.utilProblemSpin = false
            this.utilSpin = false
          })
        })
			},
			changeDataToServer (data, create) {
				let template = []
				Object.keys(this.template).forEach(key => {
					let nowValue = this.template[key]
					template.push({
						key,
						value: nowValue.code
					})
				})
				template = JSON.stringify(template)
        template = Base64.encode(template)
        let input = [], output = []
				Object.keys(data.samples).forEach(res => {
					let nowValue = data.samples[res]
					input.push(nowValue.input)
					output.push(nowValue.output)
				})
				if (!this.problem.contest_id && data.source && data.source.search(/@/) !== 0) {
          data.source = '@' + data.source
        } else if (this.problem.contest_id) {
          data.source = data.source || 'Empty'
        }
				this.querySearch(null, null, res => {
					let executeQueue = []
					for (let i = 0; i < this.problem.tags.length; ++i) {
						let nowValue = this.problem.tags[i]
						let available = res.some(resp => resp.value === nowValue.value)
						// 标签不存在的时候自动创建
						if (!available) {
							executeQueue.push(api.addNewTag(nowValue.value))
						}
					}
					Promise.all(executeQueue).then(res => {
            // 重新获取标签
						this.querySearch(null, null, res => {
							let tagId = []
							for (let i = 0; i < this.problem.tags.length; ++i) {
								let nowValue = this.problem.tags[i]
								let available = res.find(resp => resp.value === nowValue.value)
								available && tagId.push(available.id)
							}
							let exProblem = {
								codeTemplate: template,
								description: data.description,
								hint: data.hint,
								id: data._id || null,
								inputDescription: data.input_description,
								inputSamples: !this.spiderFlag ? JSON.stringify(input) : input[0],
								ioMode: data.io_mode,
								judgeTypeId: data.judgeTypeId,
								language: data.languages.toString(),
								level: data.difficulty,
								memoryLimit: data.memory_limit,
								outputDescription: data.output_description,
								outputSamples: !this.spiderFlag ? JSON.stringify(output) : output[0],
								sourceId: data.contest_id || 0,
								sourceName: data.source,
								spj: data.spj ? 1 : 0,
								spjCode: data.spj_code,
								spjLanguage: data.spj_language,
								status: data.contest_id ? data.visible ? 0 : -1 : data.visible ? 1 : -1,
								tagId: tagId,  
								timeLimit: data.time_limit,
								title: data.title
              }
              // 解决处理数据同步
							create && create(exProblem)
						})
					})
				})
			},
			submit () {
        if (!this.problem.samples.length) {
          this.$error('Sample is required')
          return
        }
        for (let sample of this.problem.samples) {
          if (!sample.input || !sample.output) {
            this.$error('Sample input and output is required')
            return
          }
        }
        if (!this.problem.tags.length) {
          this.error.tags = 'Please add at least one tag'
          this.$error(this.error.tags)
          return
        }
        if (this.problem.spj) {
          if (!this.problem.spj_code) {
            this.error.spj = 'Spj code is required'
            this.$error(this.error.spj)
          } 
          if (this.error.spj) {
            this.$error(this.error.spj)
            return
          }
          if (!this.compileSuccess) {
            this.$error('SPJ code did not compile successfully')
          }
        } else {
          // 第二次清除
          this.problem.spj_code = ''
        }
        let uploadNumber = this.$refs.uploadZipDemo.currentFilesNumber
        if (this.problem.spj !== this.currentSpj && uploadNumber !== 1) {
          this.error.testcase = 'Test files is required'
          this.$error(this.error.testcase)
          return
        }
        if (!this.problem.languages.length) {
          this.error.languages = 'Please choose at least one language for problem'
          this.$error(this.error.languages)
          return
        }
				if (this.mode !== 'edit' && this.$refs.uploadZipDemo.currentFilesNumber !== 1 || 
				this.mode === 'edit' && this.$refs.uploadZipDemo.currentFilesNumber > 1) {
					this.error.testCase = 'Test case is wrong'
          this.$error(this.error.testCase)
          return
				} 
        if (this.problem.rule_type === 'OI') {
          for (let item of this.problem.test_case_score) {
            try {
              if (parseInt(item.score) <= 0) {
                this.$error('Invalid test case score')
                return
              }
            } catch (e) {
              this.$error('Test case score must be an integer')
              return
            }
          }
        }
        this.problem.languages = this.problem.languages.sort()
        let funcName = {
          'create-problem': 'createProblem',
          'edit-problem': 'editProblem',
          'create-contest-problem': 'createContestProblem',
          'edit-contest-problem': 'editContestProblem'
        }[this.routeName]
        // edit contest problem 时, contest_id会被后来的请求覆盖掉
        if (funcName === 'editContestProblem') {
          this.problem.sourceId = this.contest.id
        }
				this.utilSpin = true
				this.changeDataToServer(this.problem, problem => {
					api[funcName]({ ...problem }).then(res => {
						// edit or create
						let problemId = problem.id || res.data.data, 
            spj = problem.spj ? true : false
            // 上传文件
            let executeQueue = []
            if (!(this.mode === 'edit' && !this.$refs.uploadZipDemo.currentFilesNumber)) {
              let formData = this.$refs.uploadZipDemo.upload("problemId", problemId, 1, 'test.zip')
              formData.append('spj', spj)
              executeQueue.push(api.uploadZipFile(formData))
            }
            Promise.all(executeQueue).then(res => {
              this.utilSpin = false
              if (this.routeName === 'create-contest-problem' || this.routeName === 'edit-contest-problem') {
                let data = {
                  contestId: problem.sourceId,
                  title: problem.sourceName
                }
                let contestData = Base64.encode(JSON.stringify(data))
                this.$router.push({name: 'contest-problem-list', params: { contestData }})
              } else {
                this.$router.push({name: 'problem-list'})
              }
            }).catch(_ => this.$error('上传文件失败'))
					}).catch(_ => {
            this.$error('题目存在异常')
					})
				})
      }
    }
  }
</script>

<style lang="less" scoped>
  .problem {
		.sample-read {
			position: absolute;
			top: 6px;
			left: 120px;
		}
    .difficulty-select {
      width: 120px;
    }
    .spj-radio {
      margin-left: 10px;
      &:last-child {
        margin-right: 20px;
      }
    }
    .input-new-tag {
      width: 78px;
    }
    .button-new-tag {
      height: 24px;
      line-height: 22px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .tags {
      .el-tag {
        margin-right: 10px;
      }
    }
    .accordion {
      margin-bottom: 10px;
    }
    .add-samples {
      width: 100%;
      background-color: #fff;
      border: 1px dashed #aaa;
      outline: none;
      cursor: pointer;
      color: #666;
      height: 35px;
      font-size: 14px;
      &:hover {
        background-color: #f9fafc;
      }
      i {
        margin-right: 10px;
      }
    }
    .add-sample-btn {
      margin-bottom: 10px;
    }
  }
</style>

<style>
  .dialog-compile-error {
    width: auto;
    max-width: 80%;
    overflow-x: scroll;
  }
	.spin {
		position: relative;
	}
</style>