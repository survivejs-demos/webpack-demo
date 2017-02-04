const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');
const webpack = require('webpack');
const merge = require('webpack-merge');
const glob = require('glob');

const parts = require('./webpack.parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
};

const common = merge([
  {
    // Entry accepts a path or an object of entries.
    // We'll be using the latter form given it's
    // convenient with more complex configurations.
    //
    // Entries have to resolve to files! It relies on Node.js
    // convention by default so if a directory contains *index.js*,
    // it will resolve to that.
    entry: {
      app: PATHS.app,
    },
    output: {
      path: PATHS.build,
      filename: '[name].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: HtmlWebpackTemplate,
        title: 'Webpack demo',
        appMountId: 'app', // Generate #app where to mount
        mobile: true, // Scale page on mobile
        inject: false, // html-webpack-template requires this to work
      }),
    ],
  },
  parts.lintCSS({
    include: PATHS.app,
    rules: {
      'color-hex-case': 'lower',
    },
  }),
  parts.loadImages({
    options: {
      limit: 15000,
    },
  }),
  parts.loadFonts(),
  parts.loadJavaScript({ include: PATHS.app }),
]);

module.exports = function(env) {
  process.env.BABEL_ENV = env;

  if (env === 'production') {
    return merge([
      common,
      {
        performance: {
          hints: 'warning', // 'error' or false are valid too
          maxEntrypointSize: 200000, // in bytes
          maxAssetSize: 200000, // in bytes
        },
        output: {
          chunkFilename: 'scripts/[chunkhash].js',
          filename: '[name].[chunkhash].js',
        },
        plugins: [
          new webpack.HashedModuleIdsPlugin(),
        ],
        recordsPath: 'records.json',
      },
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
      parts.clean(PATHS.build),
      parts.minifyJavaScript({ useSourceMap: true }),
      parts.extractBundles({
        bundles: [
          {
            name: 'vendor',
            entries: ['react', 'react-dom'],
          },
          {
            name: 'manifest',
          },
        ],
      }),
      parts.generateSourceMaps({ type: 'source-map' }),
      parts.lintJavaScript({ include: PATHS.app }),
      parts.extractCSS({
        use: ['css-loader', parts.autoprefix()],
      }),
      parts.purifyCSS({
        paths: glob.sync(path.join(PATHS.app, '*')),
      }),
    ]);
  }

  return merge([
    common,
    {
      entry: {
        // react-hot-loader has to run before app!
        app: ['react-hot-loader/patch', PATHS.app],
      },
      plugins: [
        new webpack.NamedModulesPlugin(),
      ],
    },
    parts.generateSourceMaps({ type: 'cheap-module-eval-source-map' }),
    parts.loadCSS(),
    parts.devServer({
      // Customize host/port here if needed
      host: process.env.HOST,
      port: process.env.PORT,
    }),
    parts.lintJavaScript({
      include: PATHS.app,
      options: {
        // Emit warnings over errors to avoid crashing
        // HMR on error.
        emitWarning: true,
      },
    }),
  ]);
};
