// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'vuefix',
    'html'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    "no-undef": 0,//不能有未定义变量
    // 使用 === 替代 ==
    "eqeqeq": 0,
    "no-unused-vars":0,
    // allow debugger during development
    'no-unused-expressions': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
