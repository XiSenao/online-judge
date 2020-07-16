<template>
  <div class="setting-main">
    <div class="section-title">{{$t('m.Avatar_Setting')}}</div>
    <template v-if="!avatarOption.imgSrc">
      <Upload type="drag"
              class="mini-container"
              accept=".jpg,.jpeg,.png,.bmp,.gif"
              action=""
              :before-upload="handleSelectFile">
        <div style="padding: 30px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>Drop here, or click to select manually</p>
        </div>
      </Upload>
    </template>

    <template v-else>
      <div class="flex-container">
        <div class="cropper-main inline">
          <vueCropper
            ref="cropper"
            autoCrop
            fixed
            :autoCropWidth="200"
            :autoCropHeight="200"
            :img="avatarOption.imgSrc"
            :outputSize="avatarOption.size"
            :outputType="avatarOption.outputType"
            :info="true"
            @realTime="realTime">
          </vueCropper>
        </div>
        <ButtonGroup vertical class="cropper-btn">
          <Button @click="rotate('left')">
            <Icon type="arrow-return-left" size="20"></Icon>
          </Button>
          <Button @click="rotate('right')">
            <Icon type="arrow-return-right" size="20"></Icon>
          </Button>
          <Button @click="reselect">
            <Icon type="refresh" size="20"></Icon>
          </Button>
          <Button @click="finishCrop">
            <Icon type="checkmark-round" size="20"></Icon>
          </Button>
        </ButtonGroup>
        <div class="cropper-preview" :style="previewStyle">
          <div :style=" preview.div">
            <img :src="avatarOption.imgSrc" :style="preview.img">
          </div>
        </div>
      </div>
    </template>
    <Modal v-model="uploadModalVisible"
           title="Upload the avatar">
      <div class="upload-modal">
        <p class="notice">Your avatar will be set to:</p>
        <img :src="uploadImgSrc"/>
      </div>
      <div slot="footer">
        <Button @click="uploadAvatar" :loading="loadingUploadBtn">upload</Button>
      </div>
    </Modal>

    <div class="section-title">{{$t('m.Profile_Setting')}}</div>
    <Form ref="formProfile" :model="formProfile" :rules="formValidate">
      <Row type="flex" :gutter="30" justify="space-around">
        <Col :span="11">
          <FormItem label="Mood" prop="mood">
            <Input v-model="formProfile.mood"/>
          </FormItem>
          <FormItem label="Language">
            <Select v-model="formProfile.viewLanguage">
              <Option v-for="lang in languages" :key="lang.value" :value="lang.value">{{lang.label}}</Option>
            </Select>
          </FormItem>
          <Form-item> 
            <Button type="primary" @click="updateProfile" :loading="loadingSaveBtn">Save All</Button>
          </Form-item>
        </Col>
        <Col :span="11">
          <Form-item label="Github" prop="github">
            <Input v-model="formProfile.github"/>
          </Form-item>
          <Form-item label="Blog" prop="blog">
            <Input v-model="formProfile.blog"/>
          </Form-item>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>
  import api from '@oj/api'
  import utils from '@/utils/utils'
  import {VueCropper} from 'vue-cropper'
  import {types} from '@/store'
  import {languages} from '@/i18n'
  import { mapGetters, mapActions } from 'vuex'
  import { URL_REG } from '@/utils/constants'
  export default {
    components: {
      VueCropper
    },
    data () {
      return {
        loadingSaveBtn: false,
        loadingUploadBtn: false,
        uploadModalVisible: false,
        preview: {},
        uploadImgSrc: '',
        avatarOption: {
          imgSrc: '',
          size: 0.8,
          outputType: 'png'
        },
        languages: languages,
        formProfile: {
          mood: '',
          blog: '',
          github: '',
          viewLanguage: ''
        },
        formValidate: {
          mood: [
            { validator: (rule, value, cb) => this.checkMyMood(value, cb), trigger: 'change' }
          ],
          github: [
            { validator: (rule, value, cb) => this.checkMyURL(value, 'github', cb), trigger: 'change' }
          ],
          blog: [
            { validator: (rule, value, cb) => this.checkMyURL(value, 'blog', cb), trigger: 'change' }
          ]
        }
      }
    },
    mounted () {
      Object.keys(this.formProfile).forEach(element => {
        if (this.profile[element]) {
          this.formProfile[element] = this.profile[element]
        } else if (element === 'viewLanguage') {
          this.formProfile[element] = 'en-US'
        }
      })
    },
    methods: {
      ...mapActions({
        getProfile: 'user/getProfile'
      }),
      checkMyMood (value, cb) {
        value = value ? value.trim() : ''
        if (value && value.length > 33) {
          cb(new Error(this.$t('m.Update_Error_Mood')))
        }
        this.formProfile.mood = value
        cb()
      },
      checkMyURL (value, option, cb) {
        value = value ? value.trim() : ''
        const re = new RegExp(URL_REG, 'i');
        if (value && !re.test(encodeURI(value))) {
          cb(new Error(this.$t('m.Update_Error_Url')))
        }
        this.formProfile[option] = value
        cb()
      },
      checkFileType (file) {
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(file.name)) {
          this.$Notice.warning({
            title: this.$t('m.File_Type_Not_Support'),
            desc: this.$t('m.File_Type_Desc', { fileName: file.name })
          })
          return false
        }
        return true
      },
      checkFileSize (file) {
        // max size is 2MB
        if (file.size > 2 * 1024 * 1024) {
          this.$Notice.warning({
            title: this.$t('m.Exceed_Max_Size_Limit'),
            desc: this.$t('m.File_Type_Size', { fileName: file.name })
          })
          return false
        }
        return true
      },
      handleSelectFile (file) {
        let isOk = this.checkFileType(file) && this.checkFileSize(file)
        if (!isOk) {
          return false
        }
        let reader = new window.FileReader()
        reader.onload = (e) => {
          this.avatarOption.imgSrc = e.target.result
        }
        reader.readAsDataURL(file)
        return false
      },
      realTime (data) {
        this.preview = data
      },
      rotate (direction) {
        if (direction === 'left') {
          this.$refs.cropper.rotateLeft()
        } else {
          this.$refs.cropper.rotateRight()
        }
      },
      reselect () {
        this.$Modal.confirm({
          content: this.$t('m.Update_Avatar_Check'),
          onOk: () => {
            this.avatarOption.imgSrc = ''
          }
        })
      },
      finishCrop () {
        this.$refs.cropper.getCropData(data => {
          this.uploadImgSrc = data
          this.uploadModalVisible = true
        })
      },
      uploadAvatar () {
        this.$refs.cropper.getCropBlob(blob => {
          let form = new window.FormData()
          let file = new window.File([blob], 'avatar.' + this.avatarOption.outputType)
          form.append('head', file)
          this.loadingUploadBtn = true
          api.uploadHead(form).then(res => {
            this.loadingUploadBtn = false
            this.$success(this.$t('m.Update_Avatar_Success'))
            this.uploadModalVisible = false
            this.avatarOption.imgSrc = ''
            this.getProfile()
          }).catch(_ => {
            this.loadingUploadBtn = false 
          })
        })
      },
      updateProfile () {
        this.$refs['formProfile'].validate((valid) => {
          if (valid) {
            this.loadingSaveBtn = true
            let updateData = Object.assign({}, this.formProfile)
            api.updateProfile(updateData).then(res => {
              this.$success(this.$t('m.Success'))
              this.getProfile()
              this.loadingSaveBtn = false
            }, _ => {
              this.loadingSaveBtn = false
            })
          } else {
            this.$Message.error(this.$t('m.Update_Error_Info'));
          }
        })
      }
    },
    watch: {
      'profile.id' (newValue) {
        if (newValue) {
          Object.keys(this.formProfile).forEach(element => {
            if (this.profile[element] !== undefined) {
              this.formProfile[element] = this.profile[element]
            }
          })
        }
      }
    },
    computed: {
      ...mapGetters({
        profile: 'user/profile'
      }),
      previewStyle () {
        return {
          'width': this.preview.w + 'px',
          'height': this.preview.h + 'px',
          'overflow': 'hidden'
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  /deep/.ivu-form .ivu-form-item-label {
    color: var(--font-color-white);
  }
  /deep/.ivu-input,
  /deep/.ivu-select-selection {
    background: var(--setting-profile-input-bg-color);
    color: var(--font-setting-profile-color);
  }
  /deep/.ivu-select-dropdown {
    background: var(--dropdown-diff-bg-color);
  }
  /deep/.ivu-select-item {
    color: var(--font-color-white);
  }
  .inline {
    display: inline-block;
  }
  .ivu-select-item:hover {
    background: var(--dropdown-difficulty);
  }
  .ivu-select-item-selected, .ivu-select-item-selected:hover {
    background: var(--dropdown-selected);
  }
  /deep/.ivu-upload-drag,
  /deep/.ivu-modal-content {
    background: var(--drag-upload-bg-color); 
    color: var(--font-color-white)
  }
  .copper-img {
    width: 400px;
    height: 300px;
  }

  .flex-container {
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-bottom: 10px;
    .cropper-main {
      flex: none;
      .copper-img;
    }
    .cropper-btn {
      flex: none;
      vertical-align: top;
    }
    .cropper-preview {
      flex: none;
      /*margin: 10px;*/
      margin-left: 20px;
      box-shadow: 0 0 1px 0;
      .copper-img;
    }
  }

  .upload-modal {
    .notice {
      font-size: 16px;
      display: inline-block;
      vertical-align: top;
      padding: 10px;
      padding-right: 15px;
    }
    img {
      box-shadow: 0 0 1px 0;
      border-radius: 50%;
    }
  }
</style>
