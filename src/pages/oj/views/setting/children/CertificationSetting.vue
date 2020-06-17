<template>
  <div class="setting-main">
    <template v-if="!formCertification.id || opChangeCertification">
      <div class="section-title">{{$t('m.Certification_Setting')}}</div>
      <Form ref="formCertification" :model="formCertification" :rules="ruleCertification">
        <Row type="flex" :gutter="30" justify="space-around">
          <Col :span="11">
            <FormItem :label="$t('m.Quick_Select')">
              <el-cascader
                placeholder="You Can Choose Class/College/Major Quickly"
                class="el-icascader"
                :options="options"
                v-model="cValue"
                clearable
                filterable></el-cascader> 
            </FormItem>
            <FormItem :label="$t('m.School')" prop="school">
              <Input v-model="formCertification.school"/>
            </FormItem>
            <FormItem :label="$t('m.Faculty')" prop="faculty">
              <Input v-model="formCertification.faculty"/>
            </FormItem>
            <Form-item :label="$t('m.Major')" prop="major">
              <Input v-model="formCertification.major"/>
            </Form-item>
            <Form-item :label="$t('m.Class')">
              <Input v-model="formCertification.class0"/>
            </Form-item>
            <Form-item>
              <Button type="primary" @click="opChangeCertification ? updateCertification() : applyCertification()" :loading="loadingApplyBtn">
                {{opChangeCertification ? $t('m.Update') : $t('m.Submit')}}
              </Button>
            </Form-item>
          </Col>
          <Col :span="11">
            <FormItem :label="$t('m.CertifyStyle')" style="margin-top: 2px; margin-bottom: 28px;" prop="certificationId" required>
              <Select v-model="formCertification.certificationId">
                <Option v-for="style in certificationLists" :key="style.id" :value="style.id">{{style.name}}</Option>
              </Select>
            </FormItem>
            <Form-item :label="$t('m.StuId')" prop="stuId">
              <Input v-model="formCertification.stuId"/>
            </Form-item>
            <FormItem :label="$t('m.RealName')" prop="realName">
              <Input v-model="formCertification.realName"/>
            </FormItem>
            <FormItem :label="$t('m.Gender')" style="margin: 50px 0 30px 0;">
              <RadioGroup v-model="formCertification.sex">
                <Radio label="male">{{$t('m.Male')}}</Radio>
                <Radio label="female">{{$t('m.Female')}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem :label="$t('m.Phone')" prop="phone">
              <Input v-model="formCertification.phone"/>
            </FormItem> 
            <FormItem :label="$t('m.Graduation_Time')" prop="graduationTime">
              <Date-picker type="date" placeholder="选择日期" style="display: block;" v-model="formCertification.graduationTime"></Date-picker>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </template>
    <template v-else>
      <Row class="i-row-position">
        <i-col span="11">
          <Card>
            <div class="i-title"> 
              <el-row type="flex" :gutter="20" align="middle" justify="center">
                <el-col> 
                  <img :src="showStatus(false)" class="i-certTypeImage" width="50px" height="50px">
                  <span>{{showStatus(true)}}</span>
                </el-col>
              </el-row>
              <Icon type="ios-gear" class="op-change" @click="asyncCheck"></Icon>
            </div>
            <ul class="i-info">
              <div class="flex-container">
                <div class="left">
                  <li v-for="(info, index) in newiCertTypeInfo" class="i-info-body" v-if="index < 7">
                    <span class="i-name">{{info.name}}:</span>
                    <span class="i-value">
                        {{info.value}}
                    </span>
                  </li>
                </div>
                <div class="middle separator"></div>
                <div class="right">
                  <li v-for="(info, index) in newiCertTypeInfo" class="i-info-body"  v-if="index >= 7">
                    <span class="i-name">{{info.name}}:</span>
                    <span :class="['i-value', index >= 7 ? 'add-block' : '']">
                        {{info.value}}
                    </span>
                  </li>
                </div>
              </div>
            </ul>
          </Card>
        </i-col>
      </Row>
      <div class="i-hidden"></div>
    </template>
  </div>
</template>

<script>
  import api from '@oj/api'
  import utils from '@/utils/utils'
  import {VueCropper} from 'vue-cropper'
  import {types} from '@/store'
  import {multiSchool} from '@/i18n'
  import { FormMixin } from '@oj/components/mixins'
  export default {
    mixins: [FormMixin],
    watch: {
      'cValue': {
        handler: function (newVal, oldVal) {
          this.formCertification.school = newVal[0] || this.formCertification.school
          this.formCertification.faculty = newVal[1] || this.formCertification.faculty
          this.formCertification.major = newVal[2] || this.formCertification.major
        },   
      }
    },
    data () {
      const CheckPhoneIsLegal = (rule, value, callback) => {
        var re = /^1\d{10}$/ 
        var rep = /^(?:0[0-9]{2,3}[-\\s]{1}|\\(0[0-9]{2,4}\\))[0-9]{6,8}$|^[1-9]{1}[0-9]{5,7}$|^[1-9]{1}[0-9]{10}$/ 
        var resp = /^0\d{2,3}-?\d{7,8}$/
        if (!(re.test(value) || rep.test(value) || resp.test(value))) {
          callback(new Error(this.$i18n.t('m.The_username_already_exists')))
        } else {
          callback()
        }
      }
      const CheckTimeIsLegal = (rule, value, callback) => {
        var date = new Date(value)
        var date_value = date.getFullYear() + '-' + this.lackCharacter((date.getMonth() + 1)) + '-' + this.lackCharacter(date.getDate()); 
        var re = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
        if (!re.test(date_value)) {
          callback(new Error(this.$i18n.t('m.The_username_already_exists')))
        } else {
          this.formCertification.graduationTime = date_value
          callback()
        }
      }
      return {
        opChangeCertification: false,
        loadingApplyBtn: false,
        cValue: [],
        newiCertTypeInfo: [],
        options: multiSchool,
        certificationLists: '',
        formCertification: {
          certificationId: '',
          class0: '',
          faculty: '',
          graduationTime: '',
          major: '',
          phone: '',
          realName: '',
          school: '',
          sex: 'male',
          stuId: '',
        },
        ruleCertification: {
          certifyStyle: [
            {required: true, type: 'number', trigger: 'blur'}
          ],
          school: [
            {required: true, trigger: 'blur'}
          ],
          faculty: [
            {required: true, trigger: 'blur'}
          ],
          major: [
            {required: true, trigger: 'blur'}
          ],
          realName: [
            {required: true, trigger: 'blur'}
          ],
          phone: [
            {required: true, trigger: 'blur'},
            {validator: CheckPhoneIsLegal, trigger: 'blur'}
          ],
          stuId: [
            {required: true, trigger: 'blur', min: 8, max: 13}
          ],
          graduationTime: [
            {validator: CheckTimeIsLegal, trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      this.getCertTypeList()
      this.getOwnCertType()
    },
    methods: {
      // method: true => text else => IMG
      showStatus (method) {      
        let status = this.formCertification.status
        if (status === 0) {
          return method ? this.$t('m.Identity_Under_Review') : '/static/image/audit.png'
        } else if (status === 1) {
          return method ? this.$t('m.Identity_Verification_Passed') : '/static/image/Identity_Verification_Passed.png'
        } else {
          return method ? this.$t('m.Identity_Verification_Failure') : '/static/image/Identity_Verification_Failure.png'
        }
      },
      lackCharacter (s) {
        return s < 10 ? '0' + s : s
      },
      asyncCheck () {
        this.$Modal.confirm({
          title: '请少侠三思呀!!',
          content: '三思三思三思三思',
          loading: true,
          onOk: () => {
            setTimeout(() => {
              this.opChangeCertification = true
              this.$Modal.remove()
            }, 2000);
          }
        });
      },
      beShowInfo (certTypeInfo) {
        var newCertTypeInfo = [] 
        Object.keys(certTypeInfo).forEach(obj => {
          if (obj === "id") {
            newCertTypeInfo.push({
              name: this.$t('m.ID'),
              value: certTypeInfo[obj]
            })
          } else if (obj === "class0") {
            newCertTypeInfo.push({
              name: this.$t('m.Class'),
              value: certTypeInfo[obj]
            })
          } else if (obj === "crtTs") {
            newCertTypeInfo.push({
              name: this.$t('m.First_Submission_Time'),
              value: certTypeInfo[obj]
            })
          } else if (obj === "faculty") {
            newCertTypeInfo.push({
              name: this.$t('m.Faculty'),
              value: certTypeInfo[obj]
            })
          } else if (obj === "graduationTime") {
            newCertTypeInfo.push({
              name: this.$t('m.Graduation_Time'),
              value: certTypeInfo[obj]
            })
          } else if (obj === "lmTs") {
            newCertTypeInfo.push({
              name: this.$t('m.Recent_Submission_Time'),
              value: certTypeInfo[obj]
            })
          } else if (obj === "major") {
            newCertTypeInfo.push({
              name: this.$t('m.Major'),
              value: certTypeInfo[obj]
            })
          } else if (obj === "phone") {
            newCertTypeInfo.push({
              name: this.$t('m.Phone'),
              value: certTypeInfo[obj]
            })
          } else if (obj === "realName") {
            newCertTypeInfo.push({
              name: this.$t('m.RealName'),
              value: certTypeInfo[obj]
            })
          } else if (obj === "school") {
            newCertTypeInfo.push({
              name: this.$t('m.School'),
              value: certTypeInfo[obj]
            })
          } else if (obj === "sex") {
            newCertTypeInfo.push({
              name: this.$t('m.Gender'),
              value: this.$t(`m.${certTypeInfo[obj].charAt(0).toUpperCase() + certTypeInfo[obj].slice(1)}`)
            })
          } 
        })
        this.newiCertTypeInfo = newCertTypeInfo
      },
      getOwnCertType () {
        api.getOwnCertType().then(res => {
          this.formCertification = res.data.data || this.formCertification
          this.beShowInfo(this.formCertification)
        }, _ => {
        })
      },
      getCertTypeList () {
        api.getCertTypeList().then(res => {
          this.certificationLists = res.data.data
        })
      },
      applyCertification () {
        this.validateForm('formCertification').then(valid => {
          this.loadingApplyBtn = true
          api.applyCertification(this.formCertification).then(res => {
            this.$success(this.$i18n.t('m.Thanks_for_registering'))
            this.getOwnCertType()
            this.loadingApplyBtn = false
          }, _ => {
            this.loadingApplyBtn = false
          })
        })
      },
      updateCertification () {
        this.validateForm('formCertification').then(valid => {
          this.loadingApplyBtn = true
          api.updateCertification(this.formCertification).then(res => {
            this.$success(this.$i18n.t('m.Thanks_for_registering'))
            this.loadingApplyBtn = false
            this.opChangeCertification = !this.opChangeCertification
            this.getOwnCertType()
          }, _ => {
            this.loadingApplyBtn = false
          })
        })
      }
    }
  }
</script>

<style lang="less" scoped>

  .flex-container {
    justify-content: flex-start;
    .left {
      flex: 1 0;
      width: 250px;
      padding-right: 5%;
    }
    > .middle {
      flex: none;
    }
    .right {
      flex: 1 0;
      width: 250px;
    }
  }

  .i-row-position .ivu-col {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    top: 60px;
  }


  .i-value {
    width: 100px;
    display: inline-block;
    word-break:keep-all; /* 不换行 */
    white-space:nowrap; /* 不换行 */
    overflow:hidden; /* 内容超出宽度时隐藏超出部分的内容 */
    text-overflow:ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }

  .i-hidden {
    height: 510px;
  }

  .ivu-col-span-11 {
    width: 45%;
  }

  ul {
    list-style: none;
  }

  .i-certTypeImage {
    // 文字和图片水平居中
    vertical-align: middle;
    margin-right: 3px;
    width: 60px;
    height: 50px;
  }

  /deep/ .el-col-24 {
    // 使得element-ui已定义的100%宽度无效
    width: auto !important;
  }

  /deep/.el-col {
    display: inline-block !important;
  }

  .i-title {
    width: 100%;
    height: 80px;
    border-bottom: 1px solid #ddd;  
    line-height: 80px;
  } 

  .i-title span {
    font-size: 18px;
    font-weight: bold;
    vertical-align: top;
  }

  .i-name {
    display: inline-block;
    vertical-align: top;
    color: #666;
    font-weight: bold;
    margin-right: 4px;
    text-align: center;
  }

  .i-info {
    margin: 30px 0 25px 15px;
    position: relative;
  }

  .add-block {
    display: block;
    margin-left: 3px;
    width: 100%;
  }

  .separator {
    left: 45%;
  } 

  .i-value {
    color: #464c5b;
    font-size: 14px;
    font-weight: bold;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }

  .op-change {
    position: absolute;
    right: 7px;
    top: 5px;
    font-size: 20px;
    cursor: pointer;
  }

  /deep/.el-icascader {
    display: block !important;
  }

  /deep/.el-icascader .el-cascader__label {
    top: 32px;
    height: 32px;
  }
  
  /deep/.el-icascader .el-input__inner {
    height: 32px !important;
  }

  .inline {
    display: inline-block;
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