module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allow longer commit message headers (default is 72, extending to 120)
    'header-max-length': [2, 'always', 120],
    // Allow longer commit message subjects (default is 50, extending to 100)
    'subject-max-length': [2, 'always', 150],
    // Allow longer body lines (default is 72, extending to 120)
    'body-max-line-length': [2, 'always', 120],
    // Allow longer footer lines (default is 72, extending to 120)
    'footer-max-line-length': [2, 'always', 120],
  },
}
