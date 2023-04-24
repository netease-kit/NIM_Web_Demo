// process.env.NODE_ENV = 'production'

var path = require('path')
var webpack = require('webpack')
var webpackConfig = require('./webpack.config.js')

// returns a Compiler instance
let compiler = webpack(webpackConfig)

compiler.watch({ // watch options:
  aggregateTimeout: 500, // wait so long for more changes
  poll: true // use polling instead of native watchers
  // pass a number to set the polling interval
}, function(err, stats) {
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')
});
