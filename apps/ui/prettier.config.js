const globalConfig = require('@repo/prettier-config')

/** @type {import('prettier').Config} */
module.exports = {
  ...globalConfig,
  plugins: [...globalConfig.plugins, '@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '<BUILTIN_MODULES>',
    '',
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '^(@strapi/(.*)$)|^(@strapi$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '<TYPES>',
    '<TYPES>^[.]',
    '^@/types/(.*)$',
    '',
    '^@/config/(.*)$',
    '^@/lib/(.*)$',
    '^@/utils/(.*)$',
    '^@/hooks/(.*)$',
    '^@/components/(.*)$',
    '^@/app/(.*)$',
    '',
    '^[./]',
    '^@/styles/(.*)$',
    '^(?!.*[.]css$)[./].*$',
    '.css$',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
}
