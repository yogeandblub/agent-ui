import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/storybook-static/',
      '**/coverage/',
      'recordings/',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Type-only imports must say so; keeps runtime boundaries between packages honest.
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['packages/react/**/*.{ts,tsx}', 'apps/**/*.{ts,tsx}'],
    ...reactHooks.configs.flat['recommended-latest'],
  },
  {
    // Components may describe their props with schema types, but never run schema code
    // (parsing, validation). Runtime data reaches them already shaped as view state (ADR-0002).
    files: ['packages/react/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@agent-ui/schema',
              allowTypeImports: true,
              message: 'packages/react may only `import type` from @agent-ui/schema.',
            },
          ],
          patterns: [
            {
              group: ['@agent-ui/schema/*'],
              allowTypeImports: true,
              message: 'packages/react may only `import type` from @agent-ui/schema.',
            },
          ],
        },
      ],
    },
  },
  ...storybook.configs['flat/recommended'],
  prettier,
);
