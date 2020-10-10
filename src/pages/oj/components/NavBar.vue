<template>
  <div id="header">
    <Menu :active-name="activeMenu" class="oj-menu" theme="light" mode="horizontal" @on-select="handleRoute">
      <div class="logo"><span>Online Judge</span></div>
      <Menu-item name="/">
        <Icon type="home" />
        {{ $t('m.Home') }}
      </Menu-item>
      <Menu-item name="/problem">
        <Icon type="ios-keypad" />
        {{ $t('m.NavProblems') }}
      </Menu-item>
      <Menu-item name="/contest">
        <Icon type="trophy" />
        {{ $t('m.Contests') }}
      </Menu-item>
      <Menu-item name="/status">
        <Icon type="ios-pulse-strong" />
        {{ $t('m.NavStatus') }}
      </Menu-item>
      <Submenu name="rank">
        <template slot="title">
          <Icon type="podium" />
          {{ $t('m.Rank') }}
        </template>
        <Menu-item name="/acm-rank">
          {{ $t('m.ACM_Rank') }}
        </Menu-item>
        <Menu-item name="/oi-rank">
          {{ $t('m.Rating_Rank') }}
        </Menu-item>
      </Submenu>
      <Submenu name="about">
        <template slot="title">
          <Icon type="information-circled" />
          {{ $t('m.About') }}
        </template>
        <Menu-item name="/about">
          {{ $t('m.Judger') }}
        </Menu-item>
        <Menu-item name="/FAQ">
          {{ $t('m.FAQ') }}
        </Menu-item>
      </Submenu>
      <template v-if="!isAuthenticated">
        <div class="btn-menu">
          <Button ref="loginBtn"
                  type="ghost"
                  shape="circle"
                  @click="handleBtnClick('login')">{{ $t('m.Login') }}
          </Button>
          <Button type="ghost"
                  shape="circle"
                  style="margin-left: 5px;"
                  @click="handleBtnClick('register')">{{ $t('m.Register') }}
          </Button>
        </div>
      </template>
      <template v-else>
        <Dropdown class="drop-menu" placement="bottom" trigger="click" @on-click="handleRoute">
          <Button type="text" class="drop-menu-title">{{ profile.username }}
            <Icon type="arrow-down-b" />
          </Button>
          <Dropdown-menu slot="list" class="drop-menu-list">
            <Dropdown-item name="/user-home">{{ $t('m.MyHome') }}</Dropdown-item>
            <Dropdown-item name="/user/message">{{ $t('m.Message') }}</Dropdown-item>
            <Dropdown-item :name="'/status?creatorKey=' + profile.username || null">{{ $t('m.MySubmissions') }}</Dropdown-item>
            <Dropdown-item name="/setting/profile">{{ $t('m.Settings') }}</Dropdown-item>
            <Dropdown-item name="/changeTheme" style="display: flex; justify-content: center;">
              <span>{{ $t('m.Dark_Model') }}</span>
              <i-switch v-model="isDark" style="margin-left: 12px;" size="small" @on-change="isDark = !isDark" />
            </Dropdown-item>
            <Dropdown-item divided name="/logout">{{ $t('m.Logout') }}</Dropdown-item>
          </Dropdown-menu>
        </Dropdown>
      </template>
    </Menu>
    <Modal v-model="modalVisible" :width="400">
      <div slot="header" class="modal-title">{{ $t('m.Welcome_to') }}</div>
      <component v-if="modalVisible" :is="modalStatus.mode"></component>
      <div slot="footer" style="display: none"></div>
    </Modal>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import login from '@oj/views/user/Login'
  import register from '@oj/views/user/Register'
  import { THEMES } from '@/utils/constants'
  import utils from '@/utils/utils'

  export default {
    components: {
      login,
      register
    },
    data () {
      return {
        runDarkModel: null
      }
    },
    computed: {
      ...mapState({
        myTheme: state => state.user.theme
      }),
      ...mapGetters({
        website: 'website',
        modalStatus: 'modalStatus',
        profile: 'user/profile',
        isAuthenticated: 'user/isAuthenticated',
        theme: 'user/theme'
      }),
      // 追踪导航栏位置, 当页面刷新时导航栏位置不发生变化
      activeMenu () {
        return '/' + this.$route.path.split('/')[1]
      },
      modalVisible: {
        get () {
          return this.modalStatus.visible
        },
        set (value) {
          this.changeModalStatus({ visible: value })
        }
      },
      isDark: {
        get () {
          if (this.runDarkModel !== null) {
            return this.runDarkModel
          }
          return this.theme() === THEMES.dark
        },
        set (value) {
          this.runDarkModel = value
          const themeKey = value ? THEMES.dark : THEMES.white
          utils.changeTheme(themeKey)
          this.changeMyTheme(themeKey)
        }
      }
    },
    watch: {
      'myTheme' (newValue) {
        this.isDark = newValue ? newValue === THEMES.dark : false
      }
    },
    methods: {
      ...mapActions({
        changeModalStatus: 'changeModalStatus',
        changeMyTheme: 'user/setTheme'
      }),
      handleRoute (route) {
        if (route === '/changeTheme') {
          this.isDark = !this.isDark
          return
        }
        this.$router.push(route)
      },
      handleBtnClick (mode) {
        this.changeModalStatus({
          visible: true,
          mode: mode
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  /deep/.ivu-btn-ghost {
    color: var(--font-color-white);
  }
  #header {
    min-width: 1100px;
    position: fixed;
    top: 0;
    left: 0;
    height: 60px;
    width: 100%;
    z-index: 1000;
    background-color: #fff;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
    .oj-menu {
      background: var(--body-bgcolor);
    }

    .logo {
      margin-left: 2%;
      margin-right: 2%;
      font-size: 20px;
      color: var(--font-color-white);
      float: left;
      line-height: 60px;
    }
    .ivu-menu-horizontal .ivu-menu-submenu .ivu-select-dropdown .ivu-menu-item:hover {
      background: var(--font-color-dropdown);
    }
    .drop-menu {
      /deep/ .ivu-select-dropdown {
        background: var(--body-bgcolor);
      };
      /deep/ .ivu-dropdown-item {
        color: var(--font-color-white);
      };
      /deep/ .ivu-dropdown-item:hover {
        background: var(--font-color-dropdown-user);
      };
      /deep/ .ivu-dropdown-item-divided:before {
        background: var(--dropdown-divide)
      }
    }
    .ivu-menu-item,
    .ivu-menu-submenu {
      color: var(--font-color-white);
      /deep/.ivu-select-dropdown {
        background: var(--body-bgcolor);
      }
    };
    .ivu-menu-submenu {
      .ivu-select-dropdown {
        background: var(--body-bgcolor);
      }
    }
    .ivu-menu-submenu {
      background: var(--body-bgcolor);
    }
    .drop-menu {
      float: right;
      margin-right: 30px;
      position: absolute;
      right: 10px;
      .ivu-select-dropdown {
      background: var(--body-bgcolor);
    }
      &-title {
        color: var(--font-color);
        font-size: 18px;
      }
    }
    .btn-menu {
      font-size: 16px;
      color: var(--font-color);
      float: right;
      margin-right: 10px;
    }
  }

  .modal {
    &-title {
      color: var(--font-color);
      font-size: 18px;
      font-weight: 600;
    }
  }
</style>
