'use strict'
// 确定当前环境 node 和 npm 版本是否符合要求.
require('./check-versions')()

const config = require('../config')
// 如果没有设置环境变量则默认为开发环境.
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const opn = require('opn')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
// 开发环境中代理请求, 解决浏览器跨域问题.
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port

// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable
const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true // 和 friendly-errors-webpack-plugin 插件配合
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false, // 和 friendly-errors-webpack-plugin 插件配合
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
// currently disabled until this is resolved:
// https://github.com/jantimon/html-webpack-plugin/issues/680
// compiler.plugin('compilation', function (compilation) {
//   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//     hotMiddleware.publish({ action: 'reload' })
//     cb()
//   })
// })

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

/*
*   handle fallback for HTML5 history API
*   Single Page Applications (SPA) typically only utilise one index file that is accessible by web browsers: usually index.html. 
*   Navigation in the application is then commonly handled using JavaScript with the help of the HTML5 History API. 
*   This results in issues when the user hits the refresh button or is directly accessing a page other than the landing page, e.g. 
*   help or /help/online as the web server bypasses the index file to locate the file at this location. 
*   As your application is a SPA, the web server will fail trying to retrieve the file and return a 404 - Not Found message to the user.
*   
*   单页面应用程序(SPA)通常使用一个web浏览器可以访问的索引文件(默认index.html). JavaScript 借助 HTML5 History API 的帮助下处理应用程序中的导航, 
*   但是当用户通过单击刷新按钮或直接通过输入地址的方式访问页面时, 由于这两种方式都绕开了 History API (无法捕获), 直接向服务器发起请求指令, 
*   而服务器通常默认只有一个index.html, 则会出现找不到页面的问题(404).
*   connect-history-api-fallback 中间件很好的解决了这个问题. 
*   具体来说, 每当出现符合以下条件的请求时, 它将把请求定位到你指定的索引文件.
*     + Get请求
*     + Content-Type类型是text/html类型
*     + 不是直接的文件请求, 即所请求的路径不包含`.`字符
*     + 不匹配option参数中提供的模式
*/
const rewrites = {
  rewrites: [{
    from: '/admin/', // 正则或者字符串
    to: '/admin/index.html', // 字符串或者函数
  }]
}
const historyMiddleware = require('connect-history-api-fallback')(rewrites);
app.use(historyMiddleware)

// serve webpack bundle output
app.use(devMiddleware)

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var _resolve
var _reject
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve
  _reject = reject
})

var server
var portfinder = require('portfinder')
portfinder.basePort = port
console.log(`                                                                                                                                                                                       
                         ▍ ★∴
     　 　s ．t ．▍▍a．..r．█▍ ☆ ★∵t .... 
      　　◥█▅▅██▅▅██▅▅▅▅▅███◤
       　 ．◥███████████████◤ 
      ～～～～◥█████████████◤～～～～ 
      ～～～～～～～～～～～～～～～～～～～～～～～～
      ～～～～～～～～～～～～～～～～～～～～～～～～                             
          `)
console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  portfinder.getPort((err, port) => {
    if (err) {
      _reject(err)
    }
    process.env.PORT = port
    var uri = 'http://localhost:' + port
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
      opn(uri)
    }
    server = app.listen(port)
    _resolve()
  })
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
