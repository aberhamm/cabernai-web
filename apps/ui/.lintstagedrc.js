const path = require('path')

const buildEslintCommand = (filenames) =>
  `next lint --fix --max-warnings=0 --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(' --file ')}`

module.exports = {
  // ESLint auto-fix (works perfectly)
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
  // Prettier for safe file types only
  '*.{css,md,json}': ['prettier --write --cache'],
}
