import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import checkFile from 'eslint-plugin-check-file';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '**/*.md',
      '**/*.json',
      '**/*.lock',
      '.prettierrc.*',
      'vite.config.*',
      'vitest.config.*',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      'check-file': checkFile,
    },
    rules: {
      ...(react.configs.recommended?.rules ?? {}),
      ...(reactHooks.configs.recommended?.rules ?? {}),
      ...(jsxA11y.configs.recommended?.rules ?? {}),
      'react/react-in-jsx-scope': 'off',
      'react-refresh/only-export-components': 'off',
      'react/prop-types': 'off',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      'import/named': 'off',
      'import/no-unresolved': 'off',
      'check-file/filename-naming-convention': [
        'error',
        { '**/*.{js,jsx,ts,tsx}': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],
    },
  },
  prettier,
];
