const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

exports.devServer = function(options) {
  return {
    devServer: {
      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      // Unlike the cli flag, this doesn't set
      // HotModuleReplacementPlugin!
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
      host: options.host, // Defaults to `localhost`
      port: options.port // Defaults to 8080
    },
    plugins: [
      // Enable multi-pass compilation for enhanced performance
      // in larger projects. Good default.
      new webpack.HotModuleReplacementPlugin({
        // Disabled as this won't work with html-webpack-template yet
        //multiStep: true
      })
    ]
  };
};

exports.lintJavaScript = function(paths) {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          include: paths,

          use: 'eslint-loader',
          enforce: 'pre'
        }
      ]
    }
  };
};

exports.loadCSS = function(paths) {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          // Restrict extraction process to the given
          // paths.
          include: paths,

          use: ['style-loader', 'css-loader']
        }
      ]
    }
  };
};

exports.extractCSS = function(paths) {
  return {
    module: {
      rules: [
        // Extract CSS during build
        {
          test: /\.css$/,
          // Restrict extraction process to the given
          // paths.
          include: paths,

          loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css-loader'
          })
        }
      ]
    },
    plugins: [
      // Output extracted CSS to a file
      new ExtractTextPlugin('[name].[contenthash].css')
    ]
  };
};

exports.purifyCSS = function(paths) {
  return {
    plugins: [
      new PurifyCSSPlugin({
        // Our paths are absolute so Purify needs patching
        // against that to work.
        basePath: '/',

        // `paths` is used to point PurifyCSS to files not
        // visible to Webpack. This expects glob patterns so
        // we adapt here.
        paths: paths.map(path => `${path}/*`),

        // Walk through only html files within node_modules. It
        // picks up .js files by default!
        resolveExtensions: ['.html']
      }),
    ]
  };
};

exports.lintCSS = function(paths) {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include: paths,

          use: 'postcss-loader',
          enforce: 'pre'
        }
      ]
    }
  };
};

exports.generateSourcemaps = function(type) {
  return {
    devtool: type
  };
};

exports.extractBundle = function(options) {
  const entry = {};

  // Set up entries if they have been provided.
  if (options.entries) {
    entry[options.name] = options.entries;
  }

  return {
    // Define an entry point needed for splitting.
    entry: entry,
    plugins: [
      // Extract bundle.
      new webpack.optimize.CommonsChunkPlugin({
        names: [options.name]
      })
    ]
  };
};

exports.clean = function(path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path])
    ]
  };
};
