<template>
  <div class="container">
    <Spin size="large" fix v-show="spinShow"></Spin>
    <div class="avatar-container">
      <img class="avatar" :src="userIMGBuffer"/>
    </div>
    <Card :padding="100">
      <div v-if="profile.id">
        <p style="margin-top: -10px">
          <span v-if="profile.id" class="emphasis">{{profile.username}}</span>
          <span v-if="profile.school">@{{profile.school}}</span>
        </p>
        <p v-if="profile.mood">
          {{profile.mood}}
        </p>
        <hr id="split"/>

        <div class="flex-container">
          <div class="left">
            <p>{{$t('m.UserHomeSolved')}}</p>
            <p class="emphasis">{{profile.acNum}}</p>
          </div>
          <div class="middle">
            <p>{{$t('m.UserHomeserSubmissions')}}</p>
            <p class="emphasis">{{profile.submitCount}}</p>
          </div>
          <div class="right">
            <div>{{$t('m.Rank')}}
            <Poptip trigger="hover" placement="right-start">
              <Icon type="ios-star" style="cursor: pointer;"></Icon>
              <div slot="content">
                <p style="fontSize: 14px; fontWeight: 900;">{{$t('m.Rating_Score')}}</p>
                <p :style="`color: ${ratingColor(profile.ratingScore).color};fontSize: 18px;fontWeight: blod;`">
                  {{!ratingColor(profile.ratingScore).score ? '-' : ratingColor(profile.ratingScore).score}}
                </p>
              </div>
            </Poptip>
            </div>
            <p class="emphasis">{{profile.rank}}</p>
          </div>
        </div>
        <div id="problems">
          <div v-if="solovedProbles.length">{{$t('m.List_Solved_Problems')}}
            <Poptip v-if="refreshVisible" trigger="hover" placement="right-start">
              <Icon type="ios-help-outline" style="cursor: pointer;"></Icon>
              <div slot="content">
                <p>If you find the following problem id does not exist,<br> try to click the button.</p>
                <!-- todo: 刷新题目列表(后) -->
                <Button type="info" @click="freshProblemDisplayID" disabled>regenerate</Button>
              </div>
            </Poptip>
          </div>
          <p v-else>{{$t('m.UserHomeIntro_solved')}}</p>
          <div class="btns slow">
            <div class="problem-btn" v-for="problemID of solovedProbles" :key="problemID">
              <Button type="ghost" @click="goProblem(problemID)">{{problemID}}</Button>
            </div>
          </div>
          <div v-if="notSolovedProblems.length">{{$t('m.List_UnSolved_Problems')}}
            <Poptip v-if="refreshVisible" trigger="hover" placement="right-start">
              <Icon type="ios-help-outline" style="cursor: pointer;"></Icon>
              <div slot="content">
                <p>If you find the following problem id does not exist,<br> try to click the button.</p>
                <!-- todo: 刷新题目列表(后) -->
                <Button type="info" @click="freshProblemDisplayID" disabled>regenerate</Button>
              </div>
            </Poptip>
          </div>
          <p v-else>{{$t('m.UserHomeIntro_unsolved')}}</p>
          <div class="btns">
            <div class="problem-btn" v-for="problemID of notSolovedProblems" :key="problemID">
              <Button type="ghost" @click="goProblem(problemID)">{{problemID}}</Button>
            </div>
          </div>
        </div>
        <div id="icons">
          <a :href="profile.github" v-if="!!profile.github">
            <Icon type="social-github-outline" size="30"></Icon>
          </a>
          <a :href="'mailto:'+ profile.email" v-if="!!profile.email">
            <Icon class="icon" type="ios-email-outline" size="30"></Icon>
          </a>
          <a :href="profile.blog" v-if="!!profile.blog">
            <Icon class="icon" type="ios-world-outline" size="30"></Icon>
          </a>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import time from '@/utils/time'
  import api from '@oj/api'
  import { DEFAULT_AVATAR } from '@/utils/constants'
  import utils from '@/utils/utils'
 
  export default {
    data () {
      return {
        username: '',
        spinShow: true,
        userID: null,
        problems: [],
        profile: {},
        solovedProbles: [],
        notSolovedProblems: []
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      ...mapActions({
        changeDomTitle: 'changeDomTitle',
        getProblemMaps: 'user/getSolvedProblems'
      }),
      init () {
        this.userID = this.$route.query.id
        if (this.userID) {
          this.$store.dispatch('user/getProfile', this.userID)
            .then(profile => {
              this.profile = profile
            })
            .catch(_ => {
              this.$router.go(-1)
            })
        } else {  
          this.profile = { ...this.userProfile }
        }
        this.getSolvedProblems()
      },
      getSolvedProblems () {
        // cache: 2min
        this.getProblemMaps({ userId: this.userID }).then(res => {
          this.solovedProbles = res.ac
          this.notSolovedProblems = res.error
          this.spinShow = false
        }).catch(_ => {
          this.spinShow = false
        })
      },
      goProblem (problemID) {
        this.$router.push({name: 'problem-details', params: { problemID: problemID }})
      },
      freshProblemDisplayID () {
        api.freshDisplayID().then(res => {
          this.$success('Update successfully')
          this.init()
        })
      },
      ratingColor (ratingValue) {
        return {
          color: utils.ratingColor(ratingValue),
          score: ratingValue
        }
      }
    },
    computed: {
      ...mapGetters({
        userProfile: 'user/profile'
      }),
      refreshVisible () {
        if (!this.userID || this.userID && +this.userID === this.userProfile.id) return true
        return false
      },
      userIMGBuffer () {
        return this.profile.IMGBuffer || DEFAULT_AVATAR
      }
    },
    watch: {
      '$route' (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.init()
        }
      },
      'profile' (newVal, oldVal) {
        if (newVal) {
          let reg = /^http(s)?/ig
          newVal.blog = newVal.blog ? newVal.blog.replace(/\s+/g, '') : null
          newVal.github = newVal.github ? newVal.github.replace(/\s+/g, '') : null
          if (newVal.blog) {
            newVal.blog = !newVal.blog.search(reg) ? newVal.blog : `http://${ newVal.blog }`
          }
          if (newVal.github) {
            newVal.github = !newVal.github.search(reg) ? newVal.github : `http://${ newVal.github }`
          }
          this.profile.blog = newVal.blog
          this.problems.github = newVal.github
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  /deep/.ivu-card {
    color: var(--font-color-white);
    background: var(--table-card-top);
  }
  /deep/.ivu-btn-ghost {
    color: var(--font-color-white);
  }
  /deep/.ivu-poptip-inner {
    background: var(--table-rank-bg-color);
  }
  .container {
    position: relative;
    width: 75%;
    margin: 170px auto;
    text-align: center;
    p {
      margin-top: 8px;
      margin-bottom: 8px;
    }
    .demo-spin-container{
    	display: inline-block;
      width: 200px;
      height: 100px;
      position: relative;
      border: 1px solid #eee;
    }
    .avatar-container {
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      z-index: 1;
      top: -90px;
      .avatar {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        box-shadow: 0 1px 1px 0;
      }
    }
    .emphasis {
      font-size: 20px;
      font-weight: 600;
    }
    #split {
      margin: 20px auto;
      width: 90%;
    }
    .flex-container {
      margin-top: 30px;
      padding: auto 20px;
      .left {
        flex: 1 1;
      }
      .middle {
        flex: 1 1;
        border-left: 1px solid #999;
        border-right: 1px solid #999;
      }
      .right {
        flex: 1 1;
      }
    }
    #problems {
      margin-top: 40px;
      padding-left: 30px;
      padding-right: 30px;
      font-size: 18px;
      .slow {
        margin-bottom: 30px;
      }
      .btns {
        margin-top: 15px;
        .problem-btn {
          display: inline-block;
          margin: 5px;
        }
      }
    }
    #icons {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translate(-50%);
      .icon {
        padding-left: 20px;
      }
    }
  }
</style>
