module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'react-app',
    // "plugin:@typescript-eslint/recommended",
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'prettier'],
  rules: {
    // 打开所有的prettier的rule
    'prettier/prettier': ['error'],
    'no-restricted-globals': 'off',
    // 允许定义未使用的变量
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'import/no-anonymous-default-export': [
      'error',
      {
        // 运行函数匿名导出
        allowArrowFunction: true
      }
    ]
  }
}
