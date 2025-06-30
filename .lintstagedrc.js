module.exports = {
  // UI app files
  'apps/ui/**/*.{js,jsx,ts,tsx}': ['eslint --fix --max-warnings=0'],
  'apps/ui/**/*.{css,md,json}': ['prettier --write --cache'],

  // Strapi app files
  'apps/strapi/**/*.{js,jsx,ts,tsx}': ['eslint --fix --max-warnings=0'],
  'apps/strapi/**/*.{css,md,json}': ['prettier --write --cache'],

  // Root level files (excluding config files)
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
  '*.{md,css,scss,json,yaml,yml}': ['prettier --write --cache'],
}
