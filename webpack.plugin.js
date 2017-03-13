const path = require('path');

const DemoPlugin = require('./plugins/demo-plugin.js');

const PATHS = {
  lib: path.join(__dirname, 'lib'),
  build: path.join(__dirname, 'build'),
};

module.exports = {
  entry: {
    lib: PATHS.lib,
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
  },
  plugins: [
    new DemoPlugin({ name: 'demo' }),
  ],
};
