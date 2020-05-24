<template>
  <div class="problem">

    <Panel :title="title">
      <el-form ref="form" :model="problem" :rules="rules" label-position="top" label-width="70px">
        <el-row :gutter="20">
          <!-- <el-col :span="6">
            <el-form-item prop="_id" :label="$t('m.Display_ID')"
                          :required="this.routeName === 'create-contest-problem' || this.routeName === 'edit-contest-problem'">
              <el-input :placeholder="$t('m.Display_ID')" v-model="problem._id"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item label="Judge Style" required>
              <el-autocomplete
                class="inline-input"
                v-model="problem.judgeType"
                :fetch-suggestions="queryjudgeType"
                :trigger-on-focus="true"
                placeholder="请输入内容"
                @keyup="handleJudgeTypeSelect"
                @change="handleJudgeTypeSelect"
                @select="handleJudgeTypeSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item prop="title" :label="$t('m.Title')">
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
                v-model="problem.status"
                active-text=""
                inactive-text="">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Tag')" :error="error.tags" required>
              <span class="tags">
                <el-tag
                  v-for="tag in problem.tags"
                  :closable="true"
                  :close-transition="false"
                  :key="tag"
                  type="success"
                  @close="closeTag(tag)"
                >{{tag.value}}</el-tag>
              </span>
              <!-- 不能使用blur事件否则效果不好 -->
              <el-autocomplete
                v-if="inputVisible"
                size="mini"
                class="input-new-tag"
                v-model="tagInput"
                :trigger-on-focus="true"
                @keyup.enter.native="addTag"
                @select="addTag"
                :fetch-suggestions="querySearch">
              </el-autocomplete>
              <el-button class="button-new-tag" v-else size="small" @click="inputVisible = true">+ {{$t('m.New_Tag')}}</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6">
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
              <el-button type="warning" size="small" icon="el-icon-delete" slot="header" @click="deleteSample(index)">
                Delete
              </el-button>
              <el-row :gutter="20" justify="center" type="flex">
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
        <div class="add-sample-btn">
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
                <Icon type="android-cancel" class="icon-style" v-if="v.checked" @click="deleteNewTemplate(v)"></Icon>
                <div v-if="v.checked">
                  <code-mirror v-model="v.code" :mode="v.mode"></code-mirror>
                </div>
              </el-form-item>
            </el-col>
            <!-- todo: 存在禁用无效问题 -->
            <icon-btn name="Add New Template" icon="plus" @click.native="addNewTemplate" :disabled="!problem.rule_type"></icon-btn>
          </el-row>
          <UploadDemo 
          ref="uploadFQDemo"
          button-name="Upload"
          file-name="file"
          tip-content="Before uploading you must select 'FQ'"
          tip-position="top-start"
          :disabled="!problem.rule_type" 
          :show-button="false"
          :format-suffix="['cpp']"
          :get-file-lists="getFQFileLists"></UploadDemo>
        </el-form-item>
        <el-form-item :label="$t('m.Special_Judge')" :error="error.fq">
          <el-col :span="24">
            <el-checkbox v-model="problem.spj" @click.native.prevent="switchSpj()">{{$t('m.Use_Special_Judge')}}</el-checkbox>
          </el-col>
        </el-form-item>
        <!-- <el-form-item v-if="problem.spj">
          <Accordion :title="$t('m.Special_Judge_Code')">
            <template slot="header">
              <span>{{$t('m.SPJ_language')}}</span>
              <el-radio-group v-model="problem.spj_language">
                <el-tooltip class="spj-radio" v-for="lang in allLanguage.spj_languages" :key="lang.name" effect="dark"
                            :content="lang.description" placement="top-start">
                  <el-radio :label="lang.name">{{ lang.name }}</el-radio>
                </el-tooltip>
              </el-radio-group>
              <el-button type="primary" size="small" icon="el-icon-fa-random" @click="compileSPJ"
                         :loading="loadingCompile">
                {{$t('m.Compile')}}
              </el-button>
            </template>
            <code-mirror v-model="problem.spj_code" :mode="spjMode"></code-mirror>
          </Accordion>
        </el-form-item> -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('m.Type')">
              <el-radio-group v-model="problem.rule_type" :disabled="disableRuleType">
                <el-radio :label="0">ACM & ICPC</el-radio>
                <el-radio :label="1">FQ</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.TestCase')" :error="error.spj">
              <UploadDemo 
              ref="uploadSpecialJudgeDemo"
              button-name="Upload"
              file-name="file"
              tip-content="Before uploading you must select 'Special Judge'"
              tip-position="top"
              :disabled="!problem.spj"
              :show-button="false"
              :format-suffix="['cpp']"
              :get-file-lists="getSpecialJudgeFileLists"></UploadDemo>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item :label="$t('m.IOMode')">
              <el-radio-group v-model="problem.io_mode">
                <el-radio label="Standard IO" checked>Standard IO</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="'Input Test File(.in) & Output Test File(.out)'" required :error="error.normal">
              <UploadDemo 
              ref="uploadInOrOutDemo"
              button-name="Upload"
              file-name="files"
              upload-type="drag"
              :tip-content="uploadHint"
              tip-position="top-end"
              :show-button="false"
              :format-suffix="['in', 'out']"
              :inline-block="false"
              :get-file-lists="getInOrOutFileLists"></UploadDemo>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="mode=='edit'">
            <el-form-item :label="'Files that have been uploaded'" class="fa fa-car">
              <el-collapse v-model="activeName" accordion>
                <el-collapse-item name="1">
                   <template slot="title">
                     <i class="el-icon-info"></i>
                      Normal Files
                    </template>
                  <template v-if="InOrOutFileLists.length" v-for="(value, index) in InOrOutFileLists">
                     <el-tag size="medium" class="tag-style" closable @close="closeNormalTag(value)" @click.native="downloadFile(value)">{{value}}</el-tag>
                  </template>
                  <template v-if="fileNormalInFileShow || fileNormalOutFileShow">
                    <el-row :gutter="20" type="flex">
                      <el-col :span="12" v-if="fileNormalInFileShow.content">
                        <el-form-item :label="$t('m.Input_Samples')" required>
                          <el-input
                            :rows="5"
                            type="textarea"
                            :placeholder="$t('m.Input_Samples')"
                            :disabled="true"
                            v-model="fileNormalInFileShow.content">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="fileNormalOutFileShow.content">
                        <el-form-item :label="$t('m.Output_Samples')" required>
                          <el-input
                            :rows="5"
                            type="textarea"
                            :placeholder="$t('m.Output_Samples')"
                            :disabled="true"
                            v-if="fileNormalOutFileShow"
                            v-model="fileNormalOutFileShow.content">
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </template>
                  <img v-if="!InOrOutFileLists.length" class="no-data-image" src="/static/image/bgm-nodata.png" alt="no-data">
                </el-collapse-item>
                <el-collapse-item name="2">
                  <template slot="title">
                    <i class="el-icon-info"></i>
                    Special Files
                  </template>
                  <template v-if="SpecialFileLists.length" v-for="(value, index) in SpecialFileLists">
                    <el-tag size="medium" class="tag-style" type="warning" closable @close="closeSpecialTag(value)" @click.native="downloadFile(value)">{{value}}</el-tag>
                  </template>
                  <template v-if="fileSpecialFileShow.content">
                    <el-row :gutter="20" type="flex">
                      <el-col :span="12">
                        <el-form-item :label="'Special File'" required>
                          <el-input
                            :rows="5"
                            type="textarea"
                            :disabled="true"
                            v-model="fileSpecialFileShow.content">
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </template>
                  <img v-if="!SpecialFileLists.length" class="no-data-image" src="/static/image/bgm-nodata.png" alt="no-data">
                </el-collapse-item>
                <el-collapse-item name="3">
                  <template slot="title">
                    <i class="el-icon-info"></i> 
                    FQ Files
                  </template>
                  <template v-if="FQFileLists.length" v-for="(value, index) in FQFileLists">
                    <el-tag size="medium" class="tag-style" type="info" closable @close="closeFQTag(value)" @click.native="downloadFile(value)">{{value}}</el-tag>
                  </template>
                  <template v-if="fileFQFileShow.content">
                    <el-row :gutter="20" type="flex">
                      <el-col :span="12">
                        <el-form-item :label="'FQ File'" required>
                          <el-input
                            :rows="5"
                            type="textarea"
                            :disabled="true"
                            v-model="fileFQFileShow.content">
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </template>
                  <img v-if="!FQFileLists.length" class="no-data-image" src="/static/image/bgm-nodata.png" alt="no-data">
                </el-collapse-item>
              </el-collapse>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('m.Source')">
          <el-input :placeholder="$t('m.Source')" v-model="problem.source"></el-input>
        </el-form-item>
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
  import { MYSTICKEY_CHANGE } from '../../../../utils/constants'
  import api from '../../api'

  export default {
    name: 'Problem',
    components: {
      Simditor,
      Accordion,
      CodeMirror,
      UploadDemo
    },
    data () {
      return {
        isGo: false,
        isUpload: false,
        uploadHint: 'Batch upload pairs of in and out files correspond to the input set and output set',
        rules: {
          _id: {required: true, message: 'Display ID is required', trigger: 'blur'},
          title: {required: true, message: 'Title is required', trigger: 'blur'},
          input_description: {required: true, message: 'Input Description is required', trigger: 'blur'},
          output_description: {required: true, message: 'Output Description is required', trigger: 'blur'}
        },
        loadingCompile: false,
        mode: '',
        contest: {},
        problem: {
          spj: false,
          tags: [],
          judgeType: '',
          languages: [],
          rule_type: 0,
          samples: [],
          io_mode: {'io_mode': 'Standard IO', 'input': 'input.txt', 'output': 'output.txt'}
        },
        reProblem: {
          languages: [],
          io_mode: {'io_mode': 'Standard IO', 'input': 'input.txt', 'output': 'output.txt'}
        },
        testCaseUploaded: false,
        allLanguage: {
          languages: [
            {
              name: 'C',
              description: 'c语言'
            },
            {
              name: 'C++',
              description: 'C++语言'
            },
            {
              name: 'Java',
              description: 'Java语言'
            }
          ]
        },
        inputVisible: false,
        inputJudgeTypeVisible: false,
        judgeAvailableStyleLists: [],
        tagInput: '',
        template: [],
        title: '',
        spjMode: '',
        disableRuleType: false,
        tagList: [],
        routeName: '',
        error: {
          tags: '',
          spj: '',
          languages: '',
          testCase: ''
        },
        InOrOutFileLists: [],
        SpecialFileLists: [],
        FQFileLists: [],
        storeDeleteInOrOutFileLists: [],
        storeDeleteSpecialFileLists: [],
        storeDeleteFQFileLists: [],
        fileNormalInFileShow: {
          name: '',
          content: ''
        },
        fileNormalOutFileShow: {
          name: '',
          content: ''
        },
        fileSpecialFileShow: {
          name: '',
          content: ''
        },
        fileFQFileShow: {
          name: '',
          content: ''
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
      this.problem = this.reProblem = {
        _id: '',
        title: '',
        description: '',
        input_description: '',
        output_description: '',
        time_limit: 1000,
        memory_limit: 256,
        difficulty: 'easy',
        status: true,
        share_submission: false,
        tags: [],
        languages: [],
        template: {},
        samples: [{input: '', output: ''}],
        spj: false,
        spj_language: '',
        spj_code: '',
        spj_compile_ok: false,
        test_case_id: '',
        test_case_score: [],
        rule_type: 0,
        hint: '',
        source: '',
        judgeType: '',
        io_mode: 'Standard IO'
      }
      let contestID = this.$route.params.contestId
      if (contestID) {
        this.problem.contest_id = this.reProblem.contest_id = contestID
        this.disableRuleType = true
        api.getContest(contestID).then(res => {
          this.problem.rule_type = this.reProblem.rule_type = res.data.data.rule_type
          this.contest = res.data.data
        })
      }
      this.problem.spj_language = 'C'
      // get problem after getting languages list to avoid find undefined value in `watch problem.languages`
      if (this.mode === 'edit') {
        this.title = this.$i18n.t('m.Edit_Problem')
        let funcName = {'edit-problem': 'getProblem', 'edit-contest-problem': 'getContestProblem'}[this.routeName]
        api[funcName](this.$route.params.problemId).then(problemRes => {
          let data = problemRes.data.data
          // if (!data.spj_code) {
          //   data.spj_code = ''
          // }
          // data.spj_language = data.spj_language || 'C'
          // this.testCaseUploaded = true
          this.reflogData(data)
        })
        this.getFileNameLists(this.$route.params.problemId)
      } else {
        this.title = this.$i18n.t('m.Add_Problem')
        this.problem.languages.push(this.allLanguage.languages[0].name)
      }
    },
    watch: {
      '$route' () {
        this.$refs.form.resetFields()
        this.problem = this.reProblem
      },
      'problem.languages' (newVal) {
        let data = {}
        // use deep copy to avoid infinite loop
        // let languages = JSON.parse(JSON.stringify(newVal)).sort()

        // for (let item of languages) {
        //   if (this.template[item] === undefined) {
        //     let langConfig = this.allLanguage.languages.find(lang => {
        //       return lang.name === item
        //     })
        //     if (this.problem.template[item] === undefined) {
        //       data[item] = {checked: false, code: langConfig.config.template, mode: langConfig.content_type}
        //     } else {
        //       data[item] = {checked: true, code: this.problem.template[item], mode: langConfig.content_type}
        //     }
        //   } else {
        //     data[item] = this.template[item]
        //   }
        // }
        // this.template = data 
      },
      'problem.spj_language' (newVal) {
        // this.spjMode = this.allLanguage.spj_languages.find(item => {
        //   return item.name === this.problem.spj_language
        // }).content_type
      },
      'problem.rule_type' (newVal) {

      } 
    },
    methods: {
      downloadFile (fileName) {
        this.$confirm('If you change problem judge method, you need to re-upload test cases', 'Warning', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let problemId = this.$route.params.problemId
          let params = {
            problemId,
            fileName
          }
          api.downloadFile(params).then(res => {
            let content = res.data
            let strInfoArr = this.getStrInfo(fileName)
            if (strInfoArr[1] === 'in') {
              this.fileNormalInFileShow = {
                name: fileName,
                content
              }
            } else if (strInfoArr[1] === 'out') {
              this.fileNormalOutFileShow = {
                name: fileName,
                content
              }
            } else if (strInfoArr[0] === 'insert') {
              this.fileFQFileShow = {
                name: fileName,
                content
              }
            } else if (strInfoArr[0] === 'spj') {
              this.fileSpecialFileShow = {
                name: fileName,
                content
              }
            }
          }).catch(e => {

          })
        }).catch((e) => {
          console.log(e)
        })
      },
      handleJudgeTypeSelect (judgeTypeValue) {
        this.inputJudgeTypeVisible = false
        this.problem.judgeTypeId = judgeTypeValue.id
      },
      queryjudgeType (queryString, cb) {
        let judgeAvailableStyleLists = [], flag = false
        api.getJudgeStyleLists().then(res => {
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
          finalResult = queryString ? judgeAvailableStyleLists.filter(res => res.value.indexOf(queryString) > -1) :
          judgeAvailableStyleLists
          this.judgeAvailableStyleLists = judgeAvailableStyleLists
          cb(judgeAvailableStyleLists)
        })
      },
      addNewTemplate () {
        if (!this.problem.rule_type || this.template.length && this.template[this.template.length - 1].code === '') {
          return
        }
        this.template.length && (this.template[this.template.length - 1].checked = false)
        this.template.push({
          checked: true,
          code: ''
        })
      },
      deleteNewTemplate (template) {
        this.template.splice(this.template.indexOf(template), 1)
      },
      getInOrOutFileLists (formData) {
        return api.uploadInAndOutFile(formData)
      },
      getSpecialJudgeFileLists (formData) {
        return api.uploadSpecialJudgeFile(formData)
      },
      getFQFileLists (formData) {
        return api.uploadFQFile(formData)
      },
      getFileNameLists (problemId) {
        api.getInOrOutFileNameLists(problemId).then(res => {
          this.InOrOutFileLists = res.data.data
        })
        api.getSpecialFileNameLists(problemId).then(res => {
          this.SpecialFileLists = res.data.data
        })
        api.getFQFileNameLists(problemId).then(res => {
          this.FQFileLists = res.data.data
        })
      },
      switchSpj () {
        this.testCaseUploaded = true
        if (this.testCaseUploaded) {
          this.$confirm('If you change problem judge method, you need to re-upload test cases', 'Warning', {
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            this.problem.spj = !this.problem.spj
            this.resetTestCase()
          }).catch(() => {
          })
        } else {
          this.problem.spj = !this.problem.spj
        }
      },
      querySearch (queryString, cb) {
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
          cb(tagList) 
        }).catch(() => {
        })
      },
      resetTestCase () {
        this.testCaseUploaded = false
        this.problem.test_case_score = []
        this.problem.test_case_id = ''
      },
      addTag (tagValue) {
        if (tagValue) {
          this.problem.tags.push(tagValue)
        }
        this.inputVisible = false
        this.tagInput = ''
      },
      getStrInfo (tag) {
        let suffixIndex = -1, suffix = '', prefix = ''
        for (let i = tag.length; i > 0; --i) {
          if (tag[i] === '.') {
            suffixIndex = i
            suffix = tag.substring(i + 1, tag.length)
            prefix = tag.substring(0, i)
            break
          }
        }
        return [prefix, suffix]
      },
      closeNormalTag (tag) {

        let strInfoArr = this.getStrInfo(tag)
        strInfoArr[1] = strInfoArr[1] === 'in' ? '.out' : '.in'
        this.InOrOutFileLists.splice(this.InOrOutFileLists.indexOf(tag), 1)
        this.InOrOutFileLists.splice(this.InOrOutFileLists.indexOf(strInfoArr[0] + strInfoArr[1]), 1)
        this.storeDeleteInOrOutFileLists.push(tag)
        this.storeDeleteInOrOutFileLists.push(strInfoArr[0] + strInfoArr[1])
        this.fileNormalInFileShow.content && this.fileNormalInFileShow.name === tag ||  this.fileNormalInFileShow.name === strInfoArr[0] + strInfoArr[1] ? this.fileNormalInFileShow = {} : ''
        this.fileNormalOutFileShow.content && this.fileNormalOutFileShow.name === tag ||  this.fileNormalOutFileShow.name === strInfoArr[0] + strInfoArr[1] ? this.fileNormalOutFileShow = {} : ''
      },
      closeSpecialTag (tag) {
        this.SpecialFileLists.splice(this.SpecialFileLists.indexOf(tag), 1)
        this.storeDeleteSpecialFileLists.push(tag)
        this.fileSpecialFileShow.content && this.fileSpecialFileShow.name === tag ? this.fileSpecialFileShow = {} : ''
      },
      closeFQTag (tag) {
        this.FQFileLists.splice(this.FQFileLists.indexOf(tag), 1)
        this.storeDeleteFQFileLists.push(tag)
        this.fileFQFileShow.content && this.fileFQFileShow.name === tag ? this.fileFQFileShow = {} : ''
      },
      closeTag (tag) {
        this.problem.tags.splice(this.problem.tags.indexOf(tag), 1)
      },
      addSample () {
        this.problem.samples.push({input: '', output: ''})
      },
      deleteSample (index) {
        this.problem.samples.splice(index, 1)
      },
      uploadSucceeded (response) {
        if (response.error) {
          this.$error(response.data)
          return
        }
        let fileList = response.data.info
        for (let file of fileList) {
          file.score = (100 / fileList.length).toFixed(0)
          if (!file.output_name && this.problem.spj) {
            file.output_name = '-'
          }
        }
        this.problem.test_case_score = fileList
        this.testCaseUploaded = true
        this.problem.test_case_id = response.data.id
      },
      uploadFailed () {
        this.$error('Upload failed')
      },
      compileSPJ () {
        let data = {
          id: this.problem.id,
          spj_code: this.problem.spj_code,
          spj_language: this.problem.spj_language
        }
        this.loadingCompile = true
        api.compileSPJ(data).then(res => {
          this.loadingCompile = false
          this.problem.spj_compile_ok = true
          this.error.spj = ''
        }, err => {
          this.loadingCompile = false
          this.problem.spj_compile_ok = false
          const h = this.$createElement
          this.$msgbox({
            title: 'Compile Error',
            type: 'error',
            message: h('pre', err.data.data),
            showCancelButton: false,
            closeOnClickModal: false,
            customClass: 'dialog-compile-error'
          })
        })
      },
      reflogData (data) { 
        Promise.all([api.getJudgeServer(), api.getProblemTags(data.id)]).then(res => {
          let nowTags = res[1].data.data, exTags = [], resJudgeType = res[0].data.data
          Object.keys(nowTags).forEach(res => {
            let now = nowTags[res]
            exTags.push({
              id: now.tagId,
              value: now.name
            })
          }) 
          Object.keys(resJudgeType).forEach(res => {
            let now = resJudgeType[res]
            if (now.id === data.judgeTypeId) {
              data.judgeType = now.name
            }
          })
          let codeTemplate = data.codeTemplate
          codeTemplate = codeTemplate ? codeTemplate.split(MYSTICKEY_CHANGE) : []
          let inputSamples = data.inputSamples.split(MYSTICKEY_CHANGE)
          let outputSamples = data.outputSamples.split(MYSTICKEY_CHANGE)
          let Sample = []
          let length = Math.min(inputSamples.length, outputSamples.length)
          for (let i = 0; i < length; ++i) {
            Sample.push({
              input: inputSamples[i],
              output: outputSamples[i]
            })
          }
          Object.keys(codeTemplate).forEach(res => {
            let nowValue = codeTemplate[res]
            if (nowValue) {
              this.template.push({
                code: nowValue
              })
            }
          })
          this.problem = {
            "description": data.description,
            "hint": data.hint,
            "_id": data.id,
            "samples": Sample,
            "inputSamples": Sample,
            "io_mode": data.ioMode,
            "judgeTypeId": data.judgeTypeId,
            "languages": data.language.split(','),
            "difficulty": data.level,
            "memory_limit": data.memoryLimit,
            "output_description": data.outputDescription,
            "input_description": data.inputDescription,
            "rule_type": data.problemType,
            "contest_id": data.contest_id || 0,
            "source": data.sourceName,
            "spj": data.spj ? true : false,
            "status": data.status ? true : false,
            "tags": exTags,  
            "time_limit": data.timeLimit,
            "title": data.title,
            "judgeType": data.judgeType
          }
          console.log(this.problem)
        })
      },
      cleanData (problem) {
        let Samples = problem.samples, inputSamples = [], outputSamples = [], tags = problem.tags, tagId = [], template = this.template
        Object.keys(Samples).forEach(res => {
          let now = Samples[res]
          inputSamples.push(now.input)
          outputSamples.push(now.output)
        })
        Object.keys(tags).forEach(res => {
          let id = tags[res].id
          tagId.push(id)
        })
        if (this.problem.rule_type) {
          var repTemplate = ''
          for (let i = 0; i < template.length; ++i) {
            let now = template[i].code
            if (i < template.length - 1) {
              repTemplate += now + MYSTICKEY_CHANGE
            } else {
              repTemplate += now
            }
          } 
        } else {
          repTemplate = ''
        }
        return {
          "codeTemplate": repTemplate,
          "description": problem.description,
          "hint": problem.hint,
          "id": problem._id || null,
          "inputDescription": problem.input_description,
          "inputSamples": inputSamples.join(MYSTICKEY_CHANGE),
          "ioMode": "Standard IO",
          "judgeTypeId": problem.judgeTypeId,
          "language": problem.languages.toString(),
          "level": problem.difficulty,
          "memoryLimit": problem.memory_limit,
          "outputDescription": problem.output_description,
          "outputSamples": outputSamples.join(MYSTICKEY_CHANGE),
          "problemType": problem.rule_type,
          "sourceId": problem.contest_id || 0,
          "sourceName": problem.source,
          "spj": problem.spj ? 1 : 0,
          "status": problem.status ? 1 : 0,
          "tagId": tagId,  
          "timeLimit": problem.time_limit,
          "title": problem.title
        }
      },
      submit () {
        var isUploadDataList = ['Normal'], 
        uploadNumber = [
          this.$refs.uploadInOrOutDemo.currentFilesNumber,
          this.$refs.uploadSpecialJudgeDemo.currentFilesNumber,
          this.$refs.uploadFQDemo.currentFilesNumber
        ]
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
        if (!(uploadNumber[0] === 2 || (uploadNumber[0] === 0 && this.InOrOutFileLists.length > 0))) {
          this.error.normal = 'Test files(2) is required'
          this.$error(this.error.normal)
          return
        }
        if (this.problem.spj) { 
          if (uploadNumber[1] + this.SpecialFileLists.length !== 1) {
            this.error.spj = 'Spj file(1) is required'
            this.$error(this.error.spj)
            return
          }
          isUploadDataList.push('Special')
        }
        if (this.problem.rule_type) {
          if (uploadNumber[2] + this.FQFileLists.length !== 1) {
            this.error.fq = 'FQ file(1) is required'
            this.$error(this.error.fq)
            return
          }
          if (!this.template.length) {
            this.error.spj = 'Template is required'
            this.$error(this.error.spj)
            return 
          }
          isUploadDataList.push('Function')
        } 
        // if (this.problem.spj) {
        //   if (!this.problem.spj_code) {
        //     this.error.spj = 'Spj code is required'
        //     this.$error(this.error.spj)
        //   } else if (!this.problem.spj_compile_ok) {
        //     this.error.spj = 'SPJ code has not been successfully compiled'
        //   }
        //   if (this.error.spj) {
        //     this.$error(this.error.spj)
        //     return
        //   }
        // }
        if (!this.problem.languages.length) {
          this.error.languages = 'Please choose at least one language for problem'
          this.$error(this.error.languages)
          return
        }
        // if (this.problem.rule_type === 'OI') {
        //   for (let item of this.problem.test_case_score) {
        //     try {
        //       if (parseInt(item.score) <= 0) {
        //         this.$error('Invalid test case score')
        //         return
        //       }
        //     } catch (e) {
        //       this.$error('Test case score must be an integer')
        //       return
        //     }
        //   }
        // }
        this.problem.languages = this.problem.languages.sort()
        this.problem.template = {}
        for (let k in this.template) {
          if (this.template[k].checked) {
            this.problem.template[k] = this.template[k].code
          }
        }
        let funcName = {
          'create-problem': 'createProblem',
          'edit-problem': 'editProblem',
          'create-contest-problem': 'createContestProblem',
          'edit-contest-problem': 'editContestProblem'
        }[this.routeName]
        // edit contest problem 时, contest_id会被后来的请求覆盖掉
        if (funcName === 'editContestProblem') {
          this.problem.contest_id = this.contest.id
        }
        let newProblem = this.cleanData(this.problem)
        api[funcName](newProblem).then(res => {
          let problemId = this.$route.params.problemId || null, deletePromiseQueue = [], availableUpload = []
          Object.keys(isUploadDataList).forEach(res => {
            let now = isUploadDataList[res] 
            if (now === 'Normal') {
              uploadNumber[0] && availableUpload.push(this.$refs.uploadInOrOutDemo.upload("problemId", problemId, 2))
            }
            if (now === 'Special') {
              uploadNumber[1] && availableUpload.push(this.$refs.uploadSpecialJudgeDemo.upload("problemId", problemId, 1, "spj.cpp"))
            }
            if (now === 'Function') {
              uploadNumber[2] && availableUpload.push(this.$refs.uploadFQDemo.upload("problemId", problemId, 1, "insert.cpp"))
            }
          })
          if (!this.problem.spj && this.SpecialFileLists.length) {
            this.storeDeleteSpecialFileLists.push(this.SpecialFileLists[0])
          }
          if (!this.problem.rule_type && this.FQFileLists.length) {
            this.storeDeleteFQFileLists.push(this.FQFileLists[0])
          }
          if (this.storeDeleteInOrOutFileLists.length) {
            deletePromiseQueue.push(api.deleteFiles({
              problemId,
              fileName: storeDeleteInOrOutFileLists[0]
            }))
          }
          if (this.storeDeleteSpecialFileLists.length) {
            deletePromiseQueue.push(api.deleteFiles({
              problemId,
              fileName: this.storeDeleteSpecialFileLists[0]
            }))
          }
          if (this.storeDeleteFQFileLists.length) {
            deletePromiseQueue.push(api.deleteFiles({
              problemId,
              fileName: this.storeDeleteFQFileLists[0]
            }))
          }
          Promise.all(deletePromiseQueue).then(deleteResp => {
            Promise.all(availableUpload).then(availableResp => {
              if (this.routeName === 'create-contest-problem' || this.routeName === 'edit-contest-problem') {
                this.$router.push({name: 'contest-problem-list', params: {contestId: this.$route.params.contestId}})
              } else {
                this.$router.push({name: 'problem-list'})
              }
            })
          })
        }).catch(() => {
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .problem {
    .el-icon-info {
      font-size: 12px;
      margin: 3px 7px 0 4px;
    }
    .tag-style {
      margin: 6px 3px 5px 4px;
      cursor: pointer;
    }
    .no-data-image {
      width: 340px;
      height: 200px;
      display: block; 
      margin: 0 auto;
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
  .icon-style {
    margin-left: 9px; 
    cursor: pointer; 
    color: #409EFF;
  }
</style>

