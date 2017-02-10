const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const glob = require('glob');
const HtmlWebpackTemplate = require('html-webpack-template');

const parts = require('./webpack.parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  reactDemo: path.join(__dirname, 'app', 'react'),
  build: path.join(__dirname, 'build'),
};

const commonConfig = merge([
  {
    output: {
      path: PATHS.build,
      filename: '[name].js',
    },
  },
  parts.lintCSS({ include: PATHS.app }),
  parts.loadImages({
    options: {
      limit: 15000,
      name: '[name].[hash:8].[ext]',
    },
  }),
  parts.loadFonts({
    options: {
      name: '[name].[hash:8].[ext]',
    },
  }),
  parts.loadJavaScript({ include: PATHS.app }),
]);

const productionConfig = merge([
  {
    performance: {
      hints: 'warning', // 'error' or false are valid too
      maxEntrypointSize: 100000, // in bytes
      maxAssetSize: 50000, // in bytes
    },
    output: {
      chunkFilename: 'scripts/[chunkhash].js',
      filename: '[name].[chunkhash:8].js',
    },
    plugins: [
      new webpack.HashedModuleIdsPlugin(),
    ],
    recordsPath: 'records.json',
  },
  parts.clean(PATHS.build),
  parts.minifyJavaScript({ useSourceMap: true }),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true,
      },
    },
  }),
  parts.attachRevision(),
  parts.extractBundles({
    bundles: [
      {
        name: 'vendor',
        entries: ['react'],
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
    paths: glob.sync(path.join(PATHS.app, '**', '*')),
  }),
  parts.setFreeVariable(
    'process.env.NODE_ENV',
    'production'
  ),
]);

const developmentConfig = merge([
  {
    output: {
      devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
    },
    plugins: [
      new webpack.NamedModulesPlugin(),
    ],
  },
  parts.generateSourceMaps({ type: 'cheap-module-eval-source-map' }),
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
  parts.loadCSS(),
]);

const appConfig = {
  entry: {
    app: PATHS.app,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack demo',
    }),
  ],
};

const reactConfig = {
  entry: {
    react: PATHS.reactDemo,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: HtmlWebpackTemplate,
      title: 'React demo',
      filename: 'react/index.html',
      appMountId: 'app', // Generate #app where to mount
      mobile: true, // Scale page on mobile
      inject: false, // html-webpack-template needs this to work
    }),
  ],
};

const reactDevelopmentConfig = {
  entry: {
    // react-hot-loader has to run before demo!
    react: ['react-hot-loader/patch', PATHS.reactDemo],
  },
};

module.exports = function(env) {
  process.env.BABEL_ENV = env;

  if (env === 'production') {
    return [
      merge(commonConfig, productionConfig, appConfig),
      merge(commonConfig, productionConfig, reactConfig),
    ];
  }

  return [
    merge(commonConfig, developmentConfig, appConfig),
    merge(commonConfig, developmentConfig, reactConfig, reactDevelopmentConfig),
  ];
};
