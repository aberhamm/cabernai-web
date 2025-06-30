const globalConfig = require('@repo/prettier-config')

/** @type {import('prettier').Config} */
module.exports = {
  ...globalConfig,
  // Temporarily disabled due to ES module compatibility issues
  // plugins: [
  //   ...globalConfig.plugins,
  //   require('prettier-plugin-tailwindcss')
  // ],
}
