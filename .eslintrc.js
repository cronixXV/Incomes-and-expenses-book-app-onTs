module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:unicorn/recommended',
    'plugin:react/recommended',
    'prettier',
  ],
  globals: {
    process: true,
  },
  overrides: [],
  parser: '',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: ['.eslintrc.js', 'prettier.config.js'],
  plugins: ['unicorn', 'react', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'no-console': [
      'error',
      {
        allow: ['info', 'error'],
      },
    ],
    'no-var': 'error',
    'no-use-before-define': 'error',
    eqeqeq: 'warn',
    camelcase: 'error',
    'unicorn/filename-case': 'off',
    'unicorn/no-null': 'off',
    'unicorn/consistent-function-scoping': 'off',
  },
}
