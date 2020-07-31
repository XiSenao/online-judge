<template>
  <div>
    <NavBar></NavBar>
    <div class="content-app">
      <transition name="fadeInUp" mode="out-in">
        <router-view></router-view>
      </transition>
      <div class="footer">
        <p v-html="website.website_footer"></p>
        <p><a href="#">闽ICP备20011652</a></p>
        <p>Powered by <a href="https://github.com/czeta/online-judge">OnlineJudge</a>
          <span v-if="version">&nbsp; Version: {{ version }}</span>
        </p>
      </div>
    </div>
    <BackTop></BackTop>
  </div>
</template>

<script>
  import { mapActions, mapState, mapGetters } from 'vuex'
  import NavBar from '@oj/components/NavBar.vue'
  import utils from '@/utils/utils'
  import storage from '@/utils/storage'

  export default {
    name: 'app',
    components: {
      NavBar
    },
    data () {
      return {
        version: process.env.VERSION,
        planeNumber: 0
      }
    },
    created () {
      try {
        document.body.removeChild(document.getElementById('app-loader'))  
        console.log("%c ", "background: url(http://yfoj.org.cn/static/image/show.png) no-repeat center;padding-left:314px;padding-bottom: 249px;")
        console.log("\n%c Welcome to Online Judge! %c %c Github: https://github.com/FinalAshen/Online-Judge\n\n", "color: #73c9e5; font-weight:600","","color:orange;font-weight:900")
        utils.changeTheme(this.theme() || 'white')
        document.onkeydown = event => {
          var event = event || window.event, key = null
          if (this.planeNumber > 4) { return }
          console.log(this.planeNumber)
          if (event.keyCode == 86 && event.ctrlKey) {  
            var KICKASSVERSION='2.0'
            var s = document.createElement('script')
            s.type='text/javascript'
            document.body.appendChild(s)
            s.src='/static/js/PlaneGame.js'
            this.planeNumber++
          } 
        }
      } catch (_) {}
    },
    mounted () {
      this.getWebsiteConfig()
      storage.clearCache('LRU')
	    storage.clearCache('LFU')
    },
    methods: {
      ...mapActions(['getWebsiteConfig', 'changeDomTitle'])
    },
    computed: {
      ...mapState(['website']),
      ...mapGetters({
        theme: 'user/theme'
      })
    },
    watch: {
      'website' () {
        this.changeDomTitle()
      },
      '$route' () {
        this.changeDomTitle()
      }
    }
  }
</script>

<style lang="less">

  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    background-color: transparent;
    &:active, &:hover {
      outline-width: 0;
    }
  }


  .content-app {
    margin-top: 80px;
    padding: 0 2%;
  }

  .footer {
    margin-top: 20px;
    margin-bottom: 10px;
    text-align: center;
    font-size: small;
  }

  .fadeInUp-enter-active {
    animation: fadeInUp .8s;
  }


</style>
