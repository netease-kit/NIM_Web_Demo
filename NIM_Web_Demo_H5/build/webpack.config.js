const path = require('path')
const globby = require('globby')
const postcss = require('postcss')
const webpack = require('webpack')
const vuxLoader = require('vux-loader')
const projectRoot = path.resolve(__dirname, '../')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

let webpackConfig = {

  context: projectRoot,
  //页面入口文件配置
  entry: {
    main: './src/main.js',
    login: './src/login.js',
    regist: './src/regist.js'
  },
  //入口文件输出配置
  output: {
    filename: '[name].js',
    path: path.join(projectRoot, 'dist/js'),
    // Code Splitting 用于页面按需懒加载
    publicPath: 'dist/js/',
    pathinfo: true
  },
  resolve: {
    extensions: ['.js', '.json', '.css', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'vue-html'
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss!postcss-cssnext',
        include: [resolve('src/themes'), resolve('node_modules/vux/src')]
      },
      {
        test: /\.less$/,
        loader: 'style!css!less',
        include: [resolve('src/themes')]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')],
        exclude: resolve('src/sdk'),
        query: {
          presets: [
            ['stage-0'],
            ['es2015', {'loose': true, 'modules': 'commonjs'}]
          ],
          cacheDirectory: true,
          plugins: [
            'add-module-exports',
            ['transform-runtime', {polyfill: true}]
          ]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          autoprefixer: false,
          postcss: [
            require('precss')(),
            require('postcss-cssnext')({
              browsers: ['Android >= 4', 'iOS >= 7', 'Chrome >= 10', 'Firefox >= 10', 'IE >= 10']
            })
          ]
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader',
        query: {
          // limit for base64 inlining in bytes
          limit: 4096,
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    // 全局挂载插件
    new webpack.ProvidePlugin({})
  ]
}

// 生成环境要压缩
if (process.env.NODE_ENV === 'production') {
  webpackConfig.resolve.alias['vue$'] = 'vue/dist/vue.min.js'
  webpackConfig.plugins.push(
    // 压缩JS
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    })
  )
} else {
  webpackConfig.devtool = 'source-map'
  // webpackConfig.devtool = 'cheap-source-map',
}

// vux configs
webpackConfig = vuxLoader.merge(webpackConfig, {
  plugins: [
    'vux-ui',
    'progress-bar',
    'duplicate-style'
  ]
})

module.exports = webpackConfig
