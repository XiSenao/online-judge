<template>
  <div :class="{'upload': inlineBlock}">
    <Upload
      ref="upload"
      multiple
      :name="fileName"
      :type="uploadType"
      :accept="'.zip'"
      :before-upload="handleUpload"
      :show-upload-list="false"
      :on-error="uploadError"
      :format="formatSuffix"
      :on-format-error="handleFormatError"
      :disabled="disabled"
      :action="action">
      <el-tooltip effect="dark" :content="tipContent" :placement="tipPosition">
        <div v-if="uploadType" style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff" />
          <p>点击或将文件拖拽到这里上传</p>
        </div>
        <Button v-if="!uploadType" type="ghost" icon="ios-cloud-upload-outline" :disabled="disabled">{{ buttonName }}</Button>
      </el-tooltip>
    </Upload>
    <div v-for="(item, index) in file" :key="item.keyID">Upload file: {{ item.name }}
      <a href="javascript:;" @click="delectFile(item.keyID)">X</a>
      <Button v-show="showButton" v-if="index === 0" style="margin-left:30px;" size="small" type="primary" @click="upload">上传</Button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'UploadLoad', // name不能与其他组件重名不然的话会出现溢栈的问题
  props: {
    inlineBlock: {
      type: Boolean,
      default: true
    },
    uploadType: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tipContent: {
      type: String
    },
    limitNumber: {
      type: Number,
      default: 0
    },
    tipPosition: {
      type: String,
      default: 'top-start'
    },
			// The name of the button
    buttonName: {
      type: String,
      default: 'Show'
    },
			// Whether to display the upload button
    showButton: {
      type: Boolean,
      default: false
    },
			// Upload file format
    formatSuffix: {
      type: Array,
      default () {
        return ['doc', 'docx', 'jpg', 'png', 'xls', 'xlsx']
      }
    },
			// Since the model is uploaded manually, the action is set arbitrarily
    action: {
      type: String,
      default: 'https://jsonplaceholder.typicode.com/posts/'
    },
			// Upload file name
    fileName: {
      type: String,
      default: 'file'
    },
			// Gets the selected file hook
    getFileLists: {
      type: Function,
      default () {
        return {}
      }
    },
    getZipFileValueLists: {
      type: Function,
      default () {
        return {}
      }
    },
    isSpj: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      file: [],
      uploadFile: [],
      UnifiedFileName: '_A'
    }
  },
  computed: {
    'currentFilesNumber' () {
      return this.uploadFile.length
    }
  },
  methods: {
    uploadError (error) {
      this.$Message.info(error)
    },
    handleFormatError () {
      this.$Message.info('文件格式不正确,请上传 	(' + this.formatSuffix.toString() + ') 格式文件')
    },
    isLegal (file) {
      if (file.type === '') {
        return false
      }
      for (let i = 0; i < this.formatSuffix.length; ++i) {
        const now = this.formatSuffix[i]
        const reg = new RegExp(now, 'ig')
        if (reg.test(file.type)) {
          return true
        }
      }
      return false
    },
			// spj为递增方式, (.in)结束, normal为成对递增方式, (.in&.out)结束
    checkItemLegal (contentValue) {
      contentValue.sort((a, b) => {
        return a.fileName - b.fileName
      })
      var flag = true
      var regPos = /^\d+(\.\d+)?$/ // 非负浮点数
      var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ // 负浮点数
      for (let i = 0; i < contentValue.length; ++i) {
        const fileName = contentValue[i].fileName
        const arr = this.dividePreSuffIxes(fileName)
        if (arr[0] !== null && (regPos.test(arr[0]) || regNeg.test(arr[0]))) {
          if (this.isSpj && !(+arr[0] === i + 1 && arr[1] === 'in')) {
            flag = false
            break
          }
          if (!this.isSpj) {
            if (i + 1 >= contentValue.length) {
              flag = false
              break
            }
            const carr = this.dividePreSuffIxes(contentValue[i + 1].fileName)
            if (!(+arr[0] === parseInt(i / 2) + 1 && +carr[0] === parseInt(i / 2) + 1 && arr[1] === 'in' && carr[1] === 'out')) {
              flag = false
              break
            }
            i++
          }
        } else {
          flag = false
          break
        }
      }
      return flag
    },
    dividePreSuffIxes (fileName) {
      const str = fileName
      const length = str.length
      let prefixes = null
      let suffixes = null
      for (let i = 0; i < length; ++i) {
        const nowValue = str[i]
        if (nowValue === '.') {
          prefixes = str.substring(0, i)
          suffixes = str.substring(i + 1)
          break
        }
      }
      return [prefixes, suffixes]
    },
    cleanUploadQueue (number) {
      const fileLength = this.file.length
      const uploadFileLength = this.uploadFile.length
      if (fileLength !== uploadFileLength) {
        this.$Message.info('数据异常')
        this.file = []
        this.upload = []
        return
      }
      this.file = this.file.slice(0, fileLength - number)
      this.uploadFile = this.uploadFile.slice(0, uploadFileLength - number)
    },
    handleUpload (ifile) {
      if (this.limitNumber < this.currentFilesNumber + 1 || !this.isLegal(ifile)) {
        this.$Message.info('上传数量受限或文件后缀不合法')
        return
      }
      try {
        var JSZip = require('jszip')
        var new_zip = new JSZip()
        new_zip.loadAsync(ifile).then(file => {
          const promiseQueue = []
          const contentValue = []
          const fileNameLists = []
          Object.keys(file.files).forEach(fileName => {
            fileNameLists.push(fileName)
            promiseQueue.push(new_zip.file(fileName).async('string'))
          })
          Promise.all(promiseQueue).then(res => {
            for (let i = 0; i < res.length; ++i) {
              contentValue.push({
                fileName: fileNameLists[i],
                fileValue: res[i]
              })
            }
            if (!this.checkItemLegal(contentValue)) {
              this.$Message.info('上传不符合规格, 请查询开发手册')
              return
            }
							// Animation effects
            const keyID = Math.random().toString().substr(2)
            ifile['keyID'] = keyID
            this.file.push(ifile)
            this.uploadFile.push(ifile)
            this.getZipFileValueLists(contentValue)
          }).catch(e => {
            this.$Message.info('解析失败')
          })
        }).catch(e => {
          this.$Message.info('文件内容不合法, 无法进行解析')
        })
      } catch (e) {
        this.$Message.info('文件内容不合法, 无法进行解析')
      }
      return false
    },
    delectFile (keyID) {
				// Animation effects
      this.file = this.file.filter(item => {
        return item.keyID !== keyID
      })
      this.uploadFile = this.uploadFile.filter(item => {
        return item.keyID !== keyID
      })
    },
    upload (headName, headId, limit, formatName) {
      const formData = new FormData()
      if (this.uploadFile.length === 0) {
        this.$Message.error('未选择上传文件')
        return false
      }
      if (this.uploadFile.length !== limit) {
        this.$Message.error(`必须上传` + limit + `个文件`)
        return false
      }
      const copyFormatSuffix = this.formatSuffix.slice()
      let availableSuffixNumber = 0
      for (let i = 0; i < this.uploadFile.length; ++i) {
        var suffix = this.getSuffix(this.file[i].name)
        var cleanSuffix = suffix.replace(/^\./, '')
        const index = copyFormatSuffix.indexOf(cleanSuffix)
        let uploadName = this.UnifiedFileName + suffix
        if (index !== -1) {
          availableSuffixNumber++
          copyFormatSuffix.splice(index, 1)
        } else {
          break
        }
        if (limit === 1) {
          uploadName = formatName
        }
        formData.append(this.fileName, this.file[i], uploadName)
      }
      if (availableSuffixNumber !== limit) {
        this.$Message.error(`上传文件不符合规范`)
        return false
      }
      formData.append(headName, headId)
				// return this.getFileLists(formData)
      return formData
    },
    getSuffix (str) {
      str = str.split('').reverse().join('')
      str = str.substring(0, str.match(/\./).index)
      return '.' + str.split('').reverse().join('')
    }
  }
}
</script>

<style scoped>
	/*
		type !== 'drag':
			一定要加上inline-block; 否则默认inline, 在按钮禁止的时候旁边也可以点击
		type == 'drag':
			有情况而定, 在本项目中置为false
	*/
	.upload {
		display: inline-block;
	}
</style>
