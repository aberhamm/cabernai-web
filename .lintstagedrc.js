module.exports = {
  // UI app files - ESLint only for now
  'apps/ui/**/*.{js,jsx,ts,tsx}': ['eslint --fix --max-warnings=0'],

  // Strapi app files - ESLint only for now
  'apps/strapi/**/*.{js,jsx,ts,tsx}': ['eslint --fix --max-warnings=0'],

  // Root level files - ESLint only for now (excluding config files)
  '*.{js,jsx,ts,tsx}': (files) => {
    const filteredFiles = files.filter(
      (file) =>
        !file.includes('.lintstagedrc.js') &&
        !file.includes('lint-staged.config.js') &&
        !file.includes('husky')
    )
    return filteredFiles.length > 0
      ? [`eslint --fix --max-warnings=0 ${filteredFiles.join(' ')}`]
      : []
  },

  // Temporarily disabled Prettier due to ES module issues
  // 'apps/ui/**/*.{css,md,json}': ['prettier --write --cache'],
  // 'apps/strapi/**/*.{css,md,json}': ['prettier --write --cache'],
  // '*.{md,css,scss,json,yaml,yml}': ['prettier --write --cache'],
}
