const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
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

      // Don't refresh if hot loading fails. If you want
      // refresh behavior, set inline: true instead.
      hotOnly: true,

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
      port: options.port, // Defaults to 8080
    },
    plugins: [
      // Enable multi-pass compilation for enhanced performance
      // in larger projects. Good default.
      new webpack.HotModuleReplacementPlugin({
        // Disabled as this won't work with html-webpack-template
        //multiStep: true
      }),
    ],
  };
};

exports.lintJavaScript = function({ paths, options }) {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          include: paths,
          enforce: 'pre',

          loader: 'eslint-loader',
          options: options,
        },
      ],
    },
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

          use: ['style-loader', 'css-loader'],
        },
      ],
    },
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
            loader: 'css-loader',
          }),
        },
      ],
    },
    plugins: [
      // Output extracted CSS to a file
      new ExtractTextPlugin('[name].[contenthash].css'),
    ],
  };
};

exports.purifyCSS = function(paths) {
  return {
    plugins: [
      new PurifyCSSPlugin({ paths: paths }),
    ],
  };
};

exports.lintCSS = function(paths, rules) {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include: paths,
          enforce: 'pre',

          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: function () {
              return [
                require('stylelint')({
                  rules: rules,
                  // Ignore node_modules CSS
                  ignoreFiles: 'node_modules/**/*.css',
                }),
              ];
            },
          },
        },
      ],
    },
  };
};

exports.generateSourcemaps = function(type) {
  return {
    devtool: type,
  };
};

exports.extractBundles = function(bundles, options) {
  const entry = {};
  const names = [];

  // Set up entries and names.
  bundles.forEach(({ name, entries }) => {
    if (entries) {
      entry[name] = entries;
    }

    names.push(name);
  });

  return {
    // Define an entry point needed for splitting.
    entry,
    plugins: [
      // Extract bundles.
      new webpack.optimize.CommonsChunkPlugin(
        Object.assign({}, options, { names })
      ),
    ],
  };
};

exports.loadJavaScript = function(paths) {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          include: paths,

          loader: 'babel-loader',
          options: {
            // Enable caching for improved performance during
            // development.
            // It uses default OS directory by default. If you need
            // something more custom, pass a path to it.
            // I.e., { cacheDirectory: '<path>' }
            cacheDirectory: true,
          },
        },
      ],
    },
  };
};

exports.clean = function(path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path]),
    ],
  };
};

exports.minifyJavaScript = function({ useSourceMap }) {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: useSourceMap,
        compress: {
          warnings: false,
        },
      }),
    ],
  };
};

exports.setFreeVariable = function(key, value) {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env),
    ],
  };
};

