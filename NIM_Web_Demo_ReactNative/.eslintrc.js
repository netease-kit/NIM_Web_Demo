module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "rules": {
    // React Native has JSX in JS files
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    // 取消换行符检验
    'linebreak-style': 'off',
    'no-param-reassign': 'off',
    "global-require": 0,
    "react/prop-types": 'off',
    "class-methods-use-this": 'off',
    "no-console": 'off',
    "no-continue": 'off',
    "no-underscore-dangle":'off'
  }
};