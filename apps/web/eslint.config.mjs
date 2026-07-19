import js from '@eslint/js'
import next from '@next/eslint-plugin-next'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

export default tseslint.config(
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'next-env.d.ts',
      'cypress/**',
      'cypress.config.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { '@next/next': next, import: importPlugin },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: 'next/**', group: 'external', position: 'before' },
            { pattern: '@/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },

  // ── Fronteiras de arquitetura ────────────────────────────────────────────
  {
    // Camadas partilhadas não podem depender de features.
    files: [
      'src/components/**/*.{ts,tsx}',
      'src/lib/**/*.ts',
      'src/hooks/**/*.ts',
      'src/config/**/*.ts',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*'],
              message:
                'Camadas partilhadas (components/lib/hooks/config) não podem importar features. Inverta a dependência ou mova o código para a feature.',
            },
          ],
        },
      ],
    },
  },
  {
    // Consumidores externos só acedem à feature pela API pública (barrel).
    files: ['src/app/**/*.{ts,tsx}', 'src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/components/*', '@/features/*/data/*', '@/features/*/store/*'],
              message:
                'Importe a feature pelo barrel (ex.: @/features/contratos). Internamente, use caminhos relativos.',
            },
          ],
        },
      ],
    },
  },
)
