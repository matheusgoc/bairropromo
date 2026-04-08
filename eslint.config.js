const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const pluginQuery = require('@tanstack/eslint-plugin-query');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  ...pluginQuery.configs['flat/recommended'],
  {
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: [['builtin', 'external']],
        },
      ],
    },
    ignores: [
      'dist/*',
      '/.expo',
      'node_modules',
      'build',
      'coverage',
      'android',
      'ios',
      'assets',
      '.vscode',
    ],
  },
]);
