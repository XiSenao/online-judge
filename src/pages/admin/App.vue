<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App',
    components: {},
    created () {
      try {
        console.log(` %c                                                                                                                                                                                      
                         ▍ ★∴
          s ．t ．▍▍a．..r．█▍ ☆ ★∵t .... 
          ◥█▅▅██▅▅██▅▅▅▅▅███◤
          ．◥███████████████◤ 
      ～～～～◥█████████████◤～～～～ 
      ～～～～～～～～～～～～～～～～～～～～～～～～
      ～～～～～～～～～～～～～～～～～～～～～～～～                             
          `, 'color: #00a1d6;')
        console.log('\n%c Welcome to management system! %c %c Github: https://github.com/FinalAshen/Online-Judge\n', 'color: #73c9e5; font-weight:600', '', 'color:orange;font-weight:900')
      } catch (_) {
        console.log(_)
      }
    }
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
