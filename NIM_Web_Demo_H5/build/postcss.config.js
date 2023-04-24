
let postcssConfig = {
  'parser': require('postcss-scss'),
  'map': 'inline',
  // 'local-plugins': true,
  // 'watch': true,
  'plugins': [
    require('precss'),
    require('postcss-cssnext')({
      browsers: ['Android >= 4', 'iOS >= 7', 'Chrome >= 10', 'Firefox >= 10', 'IE >= 10']
    })
  ]
}

// 生成环境要压缩
if (process.env.NODE_ENV === 'production') {
  postcssConfig.plugins.push(require('postcss-clean'))
}

module.exports = postcssConfig
