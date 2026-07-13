import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import jestPlugin from 'eslint-plugin-jest';
import headerPlugin from '@tony.ganchev/eslint-plugin-header';

export default tseslint.config(
  {
    ignores: ['dist/**', 'lib/**', 'node_modules/**', '__mocks__/**'],
  },
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    plugins: {
      header: headerPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      'no-return-await': 'error',
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      curly: 'error',
      'eol-last': 'error',
      eqeqeq: ['error', 'smart'],
      'guard-for-in': 'error',
      'max-len': ['error', { code: 180 }],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'no-new-wrappers': 'error',
      'no-shadow': ['error', { hoist: 'all' }],
      'no-throw-literal': 'error',
      'no-trailing-spaces': 'error',
      'no-unused-expressions': 'error',
      'no-var': 'error',
      'no-void': 'error',
      'one-var': ['error', 'never'],
      'prefer-const': ['error', { destructuring: 'all' }],
      'spaced-comment': ['error', 'always', { exceptions: ['*', '+', '-', '/'] }],
      'header/header': [
        2,
        'block',
        [
          '*********************************************************************',
          {
            pattern: String.raw`^ \* Copyright \(c\) \d{4}(-\d{4})* Red Hat, Inc\.$`,
            template: ' * Copyright (c) 2021 Red Hat, Inc.',
          },
          ' *',
          ' * This program and the accompanying materials are made',
          ' * available under the terms of the Eclipse Public License 2.0',
          ' * which is available at https://www.eclipse.org/legal/epl-2.0/',
          ' *',
          ' * SPDX-License-Identifier: EPL-2.0',
          ' **********************************************************************',
        ],
      ],
    },
  },
  {
    files: ['tests/**/*.ts'],
    plugins: {
      jest: jestPlugin,
    },
    ...jestPlugin.configs['flat/recommended'],
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);
