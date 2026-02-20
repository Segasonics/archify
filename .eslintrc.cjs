module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: ['eslint:recommended'],
  rules: {
    'no-console': 'off',
  },
  ignorePatterns: ['dist/', 'coverage/', 'node_modules/'],
};

