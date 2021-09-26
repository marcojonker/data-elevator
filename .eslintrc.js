module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  parserOptions: {
    ecmaVersion: 12
  },
  "extends": "eslint:recommended",
  "rules": {
      // enable additional rules
      "indent": ["error", 2],

      // disable rules from base configurations
      "no-unused-vars": "off",
  }
}
