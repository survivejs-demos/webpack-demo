const path = require('path');
const merge = require('webpack-merge');

const parts = require('./webpack.parts');

const PATHS = {
  build: path.join(__dirname, 'static'),
  ssrDemo: path.join(__dirname, 'app', 'ssr.js'),
};

module.exports = merge([
  {
    entry: {
      index: PATHS.ssrDemo,
    },
    output: {
      path: PATHS.build,
      filename: '[name].js',
      libraryTarget: 'umd',
    },
  },
  parts.loadJavaScript({ include: PATHS.ssrDemo }),
]);
