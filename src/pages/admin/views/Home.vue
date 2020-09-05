<template>
  <div class="container">
    <div>
      <SideMenu />
    </div>
    <div :class="{ 'header': true, 'cheheader': !sidebar.opened }">
      <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <i class="el-icon-fa-font katex-editor" @click="katexVisible=true" />
      <screen-full :width="14" :height="14" class="screen-full" />
      <el-dropdown @command="handleCommand">
        <span style="cursor: pointer;">{{ account }}<i class="el-icon-caret-bottom el-icon--right" /></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">Logout</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div :class="{ 'tags-view': true, 'cheheader': !sidebar.opened }">
      <tags-view/>
    </div>
    <div :class="{ 'content-app': true, 'cheheader': !sidebar.opened }" :style="{ 'margin-left': !sidebar.opened ? '5px' : '0' }">
      <transition name="fadeInUp" mode="out-in">
        <router-view />
      </transition>
      <div class="footer">
        <p><a href="#">闽ICP备20011652</a></p>
        Build Version: {{ version }}
      </div>
    </div>

    <el-dialog :title="$t('m.Latex_Editor')" :visible.sync="katexVisible">
      <KatexEditor />
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import SideMenu from '@/layout/admin/components/Sidebar'
  import TagsView from '@/layout/admin/components/TagsView'
  import ScreenFull from '@admin/components/ScreenFull.vue'
  import KatexEditor from '@admin/components/KatexEditor.vue'
  import Hamburger from '@admin/components/Hamburger'
  import Breadcrumb from '@admin/components/Breadcrumb'

  export default {
    name: 'App',
    components: {
      SideMenu,
      KatexEditor,
      ScreenFull,
      TagsView,
      Hamburger,
      Breadcrumb
    },
    data () {
      return {
        version: process.env.VERSION,
        katexVisible: false
      }
    },
    computed: {
      ...mapGetters({
        account: 'admin/account'
      }),
      ...mapState({
        sidebar: state => state.app.sidebar
      })
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      },
      handleCommand (command) {
        if (command === 'logout') {
          this.$store.dispatch('admin/logout')
            .then(() => {
              this.$success('Successfully Logged Out')
              this.$router.push({ name: 'Login' })
            })
            .catch(_ => {

            })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  a {
    background-color: transparent;
  }

  a:active, a:hover {
    outline-width: 0
  }

  img {
    border-style: none
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .container {
    overflow: auto;
    font-weight: 400;
    height: 100%;
    -webkit-font-smoothing: antialiased;
    background-color: #EDECEC;
    overflow-y: scroll;
    min-width: 1000px;
  }

  * {
    box-sizing: border-box;
  }

  .header {
    text-align: right;
    padding-left: 210px;
    padding-right: 30px;
    line-height: 50px;
    height: 50px;
    background: #F9FAFC;
    .screen-full {
      margin-right: 8px;
    }
  }

  .cheheader {
    padding-left: 54px !important;
  }

  .tags-view {
    padding-left: 200px;
    overflow: hidden;
  }
  .content-app {
    padding-top: 20px;
    padding-right: 10px;
    padding-left: 210px;
  }

  .footer {
    margin: 15px;
    text-align: center;
    font-size: small;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate(0, 30px);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }

  .fadeInUp-enter-active {
    animation: fadeInUp .8s;
  }

  .katex-editor {
    margin-right: 5px;
    /*font-size: 18px;*/
  }

</style>
