'use strict'
// Template version: 1.1.1
// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')
const DEV_ENV = require('./dev.env')
const BUILD_ENV = require('./prod.env')
const commonProxy = {
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('Referer', process.env.TARGET || DEV_ENV.TARGET)
  },
  target: process.env.TARGET || DEV_ENV.TARGET,
  changeOrigin: true
}

module.exports = {
  build: {
    env: BUILD_ENV,
    ojIndex: path.resolve(__dirname, '../dist/index.html'),
    ojTemplate: path.resolve(__dirname, '../src/pages/oj/index.html'),
    adminIndex: path.resolve(__dirname, '../dist/admin/index.html'),
    adminTemplate: path.resolve(__dirname, '../src/pages/admin/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: process.env.USE_SENTRY === '1',
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: BUILD_ENV.Gzip,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report || BUILD_ENV.report
  },
  dev: {
    env: DEV_ENV,
    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    port: process.env.PORT || 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      "/api": commonProxy,
      "/resource": commonProxy
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
