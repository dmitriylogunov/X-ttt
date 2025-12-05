module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  settings: {
    react: {
      version: '15.6'
    }
  },
  plugins: ['react'],
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'error'
  }
}
