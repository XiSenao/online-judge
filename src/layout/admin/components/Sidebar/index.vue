<template>
  <div class="has-logo">
    <el-scrollbar class="scrollbar-wrapper">
      <el-menu
        :class="{ vertical_menu: true, close_menu: isCollapse }"
        :default-active="currentPath"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        mode="vertical"
      >
        <Login :collapse="isCollapse" />
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Login from './Logo'
import variables from '@/styles/variables.scss'

export default {
  components: {
    SidebarItem,
    Login
  },
  computed: {
    ...mapGetters({
      'routes': 'permission/routes',
      'sidebar': 'app/sidebar'
    }),
    currentPath () {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    variables() {
      return variables
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  }
}
</script>

<style scoped lang="less">
  html,body{
    height: 100%;
    overflow: hidden; /*有效防止在页面进行手动刷新时显示内置滚动条*/
  }
  .has-logo {
    width: 100%;
  }
  /deep/.el-icon-arrow-right {
    display: none;
  }
  .scrollbar-wrapper {
    overflow-x: hidden !important;
    height: 100%;
    .close_menu {
      width: 54px !important;
    }
    .vertical_menu {
      overflow: hidden;
      width: 205px;
      height: 100%;
      position: fixed !important;
      z-index: 100;
      top: 0;
      bottom: 0;
      left: 0;
      .logo {
        margin: 20px 0;
        text-align: center;
        img {
          background-color: #fff;
          border-radius: 50%;
          border: 3px solid #fff;
          width: 75px;
          height: 75px;
        }
      }
    }
  }
</style>
