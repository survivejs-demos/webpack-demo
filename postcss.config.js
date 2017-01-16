module.exports = {
  plugins: {
    stylelint: {
      rules: {
        'color-hex-case': 'lower',
      },
      // Ignore node_modules CSS
      ignoreFiles: 'node_modules/**/*.css',
    },
  },
};