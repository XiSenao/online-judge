'use strict'
const os = require('os');
const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

function getEntries() {
  const base = {
    'oj': ['./src/pages/oj/index.js'],
    'admin': ['./src/pages/admin/index.js']
  }
  if (process.env.USE_SENTRY === '1') {
    Object.keys(base).forEach(entry => {
      base[entry].push('./src/utils/sentry.js')
    })
  }
  return base
}

// get all entries
const entries = getEntries()
console.log("All entries: ")
Object.keys(entries).forEach(entry => {
  console.log(entry)
  entries[entry].forEach(ele => {
    console.log("- %s", ele)
  })
  console.log()
})

// prepare vendor asserts
const globOptions = { cwd: resolve('static/js') };
let vendorAssets = glob.sync('vendor.dll.*.js', globOptions);
vendorAssets = vendorAssets.map(file => 'static/js/' + file)


module.exports = {
  entry: entries,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      '@oj': resolve('src/pages/oj'),
      '@admin': resolve('src/pages/admin'),
      '~': resolve('src/components')
    }
  },
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
    'element-ui': 'ElementUI',
    iview: 'iview',
    katex: 'katex',
    codemirror: 'codemirror',
    jszip: 'jszip'
  },
  module: {
    rules: [
      // {
      //   test: /\.(js|vue)$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: [resolve('src')],
      //   options: {
      //     formatter: require('eslint-friendly-formatter')
      //   }
      // },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory=true',
        exclude: /node_modules/,
        include: [resolve('src'), resolve('test')]
      },
      // {
      //   test: /\.vue$/,
      //   loader: 'happypack/loader?id=vue'
      // },
      // {
      //   test: /\.js$/,
      //   loader: 'happypack/loader?id=js',
      //   exclude: /node_modules/,
      //   include: [resolve('src'), resolve('test')]
      // },
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: {
            inline: true,
            name: 'workerName.[hash].js'
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./vendor-manifest.json')
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: [vendorAssets[0]],
      files: ['index.html', 'admin/index.html'],
      append: false
    }),
    // new HappyPack({
    //   id: 'vue',
    //   loaders: [{
    //     loader: 'vue-loader',
    //     cacheDirectory: true,
    //     options: vueLoaderConfig 
    //   }],
    //   threadPool: happyThreadPool,
    // }),
    // new HappyPack({
    //   id: 'js',
    //   loaders: ['babel-loader?cacheDirectory=true'],
    //   threadPool: happyThreadPool,
    //   verbose: true
    // }),
    new WorkboxPlugin.GenerateSW({
      cacheId: 'seed-cache',

      importWorkboxFrom: 'disabled', // 可填`cdn`,`local`,`disabled`,
      importScripts: '/scripts-build/commseed/workboxswMain.js',

      skipWaiting: true, //跳过waiting状态
      clientsClaim: true, //通知让新的sw立即在页面上取得控制权
      cleanupOutdatedCaches: true,//删除过时、老版本的缓存

      //最终生成的service worker地址，这个地址和webpack的output地址有关
      swDest: '/workboxServiceWorker.js',
      include: [

      ],
      //缓存规则，可用正则匹配请求，进行缓存
      //这里将js、css、还有图片资源分开缓存，可以区分缓存时间(虽然这里没做区分。。)
      //由于种子农场此站点较长时间不更新，所以缓存时间可以稍微长一些
      runtimeCaching: [
        {
          urlPattern: /.*\.js.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'seed-js',
            expiration: {
              maxEntries: 50,  //最多缓存50个，超过的按照LRU原则删除
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
        {
          urlPattern: /.*css.*/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'seed-css',
            expiration: {
              maxEntries: 50,  //最多缓存50个，超过的按照LRU原则删除
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
        {
          urlPattern: /.*(jpg|png|svga).*/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'seed-image',
            expiration: {
              maxEntries: 30,  //最多缓存30个，超过的按照LRU原则删除
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        }
      ]
    })
  ]
}
