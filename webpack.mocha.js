const path = require('path');
const merge = require('webpack-merge');

const parts = require('./webpack.parts');

const PATHS = {
  tests: path.join(__dirname, 'tests'),
};

module.exports = merge([
  parts.devServer(),
  parts.page({
    title: 'Mocha demo',
    entry: {
      tests: PATHS.tests,
    },
  }),
]);
