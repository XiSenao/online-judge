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

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

const createHappyPack = () => ([
  new HappyPack({
    id: 'vue',
    loaders: [{
      loader: 'vue-loader',
      cacheDirectory: true,
      options: vueLoaderConfig 
    }],
    threadPool: happyThreadPool,
  }),
  new HappyPack({
    id: 'js',
    loaders: ['babel-loader?cacheDirectory=true'],
    threadPool: happyThreadPool,
    verbose: true
  })
])
const createPrepackLoaders = () => {
  const preLoaderLists = []
  if (config.build.useHappyPack) {
    preLoaderLists.push({
      test: /\.vue$/,
      loader: 'happypack/loader?id=vue'
    }, {
      test: /\.js$/,
      loader: 'happypack/loader?id=js',
      exclude: /node_modules/,
      include: [resolve('src'), resolve('test')]
    })
  } else {
    preLoaderLists.push({
      test: /\.vue$/,
      loader: 'vue-loader',
      options: vueLoaderConfig
    }, {
      test: /\.js$/,
      loader: 'babel-loader?cacheDirectory=true',
      exclude: /node_modules/,
      include: [resolve('src'), resolve('test')]
    })
  }
  return preLoaderLists
}

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
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      ...createPrepackLoaders(),
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
    ...(config.build.useHappyPack ? createHappyPack() : []),
    new WorkboxPlugin.GenerateSW({
      importWorkboxFrom: 'local',
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          // To match cross-origin requests, use a RegExp that matches
          // the start of the origin:
          urlPattern: new RegExp('^https://api'),
          handler: 'StaleWhileRevalidate',
          options: {
            // Configure which responses are considered cacheable.
            cacheableResponse: {
              statuses: [200]
            }
          }
        },
        {
          urlPattern: new RegExp('^https://cdn'),
          // Apply a network-first strategy.
          handler: 'NetworkFirst',
          options: {
            // Fall back to the cache after 2 seconds.
            networkTimeoutSeconds: 2,
            cacheableResponse: {
              statuses: [200]
            }
          }
        }
      ]
    })
  ]
}
