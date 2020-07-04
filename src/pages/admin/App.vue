<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    components: {},
    created () {
      try {
        console.log("%c ", "background: url(http://yfoj.org.cn/static/image/superadmin.png) no-repeat center;padding-left:314px;padding-bottom: 249px;")
        console.log("\n%c Welcome to management system! %c %c Github: https://github.com/FinalAshen/Online-Judge\n\n", "color: #73c9e5; font-weight:600","","color:orange;font-weight:900")
      } catch (_) {}
    },
  }
</script>

<style lang="less">
  body {
    margin: 0;
    padding: 0;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    background-color: #324157;
  }

  #app {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
</style>
