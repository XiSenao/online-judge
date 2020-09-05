<template>
  <div class="spider-problem spin">
    <Spin v-show="showSpin" size="large" fix />
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
                v-model="spiderProblem.judgeType"
                class="inline-input"
                :fetch-suggestions="queryjudgeType"
                :trigger-on-focus="true"
                placeholder="请输入内容"
                @keyup="handleJudgeTypeSelect(spiderProblem)"
                @select="handleJudgeTypeSelect(spiderProblem)"
                @blur="handleJudgeTypeSelect(spiderProblem)"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Problem ID" prop="problemID">
              <Input-number v-model="spiderProblem.problemID" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Difficulty')" prop="difficulty">
              <el-select v-model="spiderProblem.difficulty" class="difficulty-select" size="small" :placeholder="$t('m.Difficulty')">
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
                  :key="tag.id"
                  :closable="true"
                  :close-transition="false"
                  type="success"
                  @close="closeTag(tag, spiderProblem)"
                >{{ tag.value }}</el-tag>
              </span>
              <el-autocomplete
                v-if="inputVisible"
                v-model="tagInput"
                size="mini"
                class="input-new-tag"
                :trigger-on-focus="true"
                :fetch-suggestions="querySearch"
                @keyup.enter.native="addTag(tagInput, spiderProblem)"
                @select="addTag(tagInput, spiderProblem)"
                @blur="addTag(tagInput, spiderProblem)">
              </el-autocomplete>
              <el-button v-else class="button-new-tag" size="small" @click="inputVisible = true">+ {{ $t('m.New_Tag') }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item :label="$t('m.Source')" required>
              <el-input v-model="spiderProblem.sourceName" :placeholder="$t('m.Source')" :disabled="!!contest.id"></el-input>
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
import ProblemMixin from './problemMixin'
export default {
  name: 'SpiderProblem',
  components: {
    MdInput
  },
  mixins: [ProblemMixin],
  data () {
    return {
      spiderProblemRules: {
        problemID: { required: true, message: 'ProblemID is required', trigger: 'blur' },
        difficulty: { required: true, message: 'Difficulty is required', trigger: 'blur' }
      },
      inputVisible: '',
      tagInput: '',
      showSpin: false,
      spiderFlag: true,
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
    let contestData = this.$route.params.contestData
    if (contestData) {
      const Base64 = require('js-base64').Base64
      contestData = JSON.parse(Base64.decode(contestData))
      this.contest.id = contestData.contestId || 0
      this.contest.title = contestData.title || null
      this.spiderProblem.sourceName = this.contest.title
      this.spiderProblem.sourceId = this.contest.id
    }
  },
  methods: {
    buildQuery () {
      const sourceName = this.spiderProblem.sourceName
      const contestID = this.contest.id
      const contestTitle = this.contest.title
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
          const data = this.buildQuery()
          this.showSpin = true
          this.querySearch(null, null, res => {
            const executeQueue = []
            for (let i = 0; i < this.spiderProblem.tags.length; ++i) {
              const nowValue = this.spiderProblem.tags[i]
              const available = res.some(resp => resp.value === nowValue.value)
							// 标签不存在的时候自动创建
              !available && executeQueue.push(api.addNewTag(nowValue.value))
            }
            Promise.all(executeQueue).then(res => {
              this.querySearch(null, null, res => {
                const tagId = []
                for (let i = 0; i < this.spiderProblem.tags.length; ++i) {
                  const nowValue = this.spiderProblem.tags[i]
                  const available = res.find(resp => resp.value === nowValue.value)
                  available && tagId.push(available.id)
                }
                data.tagId = tagId
                api.createSpiderProblem(data).then(res => {
                  this.$success('创建成功')
                  this.showSpin = false
                  if (this.$route.name === 'CreateSpiderProblem') {
                    this.$router.push({ name: 'ProblemList' })
                  } else {
                    this.$router.push({ name: 'ContestProblemList', params: { contestData: this.$route.params.contestData }})
                  }
                })
              })
            })
          })
        } else {
          this.$error('Please check the error fields')
        }
      })
    }
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
