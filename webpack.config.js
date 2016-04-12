const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const webpack = require('webpack');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const validate = require('webpack-validator');

// Load *package.json* so we can use `dependencies` from there
const pkg = require('./package.json');

const PATHS = {
  react: path.join(__dirname, 'node_modules/react/dist/react.min.js'),
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
  style: path.join(__dirname, 'app/main.css')
};

const common = commonConfiguration(PATHS);
var config;

// Detect how npm is run and branch based on that
switch(process.env.npm_lifecycle_event) {
  case 'build':
  case 'stats':
    config = merge(
      common,
      {
        output: {
          path: PATHS.build,
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js'
        },
        plugins: [
          new CleanWebpackPlugin([PATHS.build])
        ]
      },
      setEnvironment({
        key: 'process.env.NODE_ENV',
        value: 'production'
      }),
      extractBundle({
        name: 'vendor',
        entries: Object.keys(pkg.dependencies)
      }),
      extractCSS(PATHS),
      minify()
    );
  case 'start':
  default:
    config = merge(
      common,
      {
        devtool: 'eval-source-map',
        plugins: [
          new webpack.HotModuleReplacementPlugin(),
          new NpmInstallPlugin({
            save: true // --save
          })
        ]
      },
      devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT
      }),
      setupCSS(PATHS.app),
      dontParse({
        name: 'react',
        path: PATHS.react
      })
    );
}

module.exports = validate(config);

// Configuration fragments, these could be split to multiple
// files if needed.
function commonConfiguration(paths) {
  return {
    // Entry accepts a path or an object of entries.
    // We'll be using the latter form given it's
    // convenient with more complex configurations.
    entry: {
      app: paths.app,
      style: paths.style
    },
    output: {
      path: paths.build,
      // Output using the entry name
      filename: '[name].js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Webpack demo'
      })
    ]
  };
}

function setupCSS(path) {
  return {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css'],
          include: path
        }
      ]
    }
  };
}

function devServer(options) {
  return {
    devServer: {
      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: process.env.HOST || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default localhost
      host: options.host,
      port: options.port
    },
  };
}

function dontParse(options) {
  const alias = {};
  alias[options.name] = options.path;

  return {
    module: {
      noParse: [
        options.path
      ]
    },
    resolve: {
      alias: alias
    }
  };
}

function setEnvironment(options) {
  const env = {};
  env[options.key] = JSON.stringify(options.value);

  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  };
}

function extractCSS(paths) {
  return {
    module: {
      loaders: [
        // Extract CSS during build
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: paths.app
        }
      ]
    },
    plugins: [
      // Output extracted CSS to a file
      new ExtractTextPlugin('[name].[chunkhash].css')
    ]
  };
}

function extractBundle(options) {
  const entry = {};
  entry[options.name] = options.entries;

  return {
    // Define vendor entry point needed for splitting.
    entry: entry,
    plugins: [
      // Extract bundle and manifest files. Manifest is
      // needed for reliable caching.
      new webpack.optimize.CommonsChunkPlugin({
        names: [options.name, 'manifest']
      })
    ]
  };
}

function minify() {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  };
}
