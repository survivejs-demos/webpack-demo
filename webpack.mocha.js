const path = require('path');
const merge = require('webpack-merge');

const parts = require('./webpack.parts');

const PATHS = {
  tests: path.join(__dirname, 'tests'),
};

module.exports = merge([
  parts.loadJavaScript({ include: PATHS.tests }),
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.page({
    title: 'Mocha demo',
    entry: {
      tests: PATHS.tests,
    },
  }),
]);
