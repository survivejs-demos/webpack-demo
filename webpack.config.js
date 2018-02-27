const webpack = require("webpack");
const path = require("path");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const glob = require("glob");

const parts = require("./webpack.parts");

const PATHS = {
  app: path.join(__dirname, "src"),
  build: path.join(__dirname, "dist"),
};

const commonConfig = merge([
  {
    output: {
      // Needed for code splitting to work in nested paths
      publicPath: "/",
    },
    resolveLoader: {
      alias: {
        "demo-loader": path.resolve(
          __dirname,
          "loaders/demo-loader.js"
        ),
      },
    },
  },
  parts.loadJavaScript({ include: PATHS.app }),
  parts.setFreeVariable("HELLO", "hello from config"),
]);

const productionConfig = merge([
  {
    performance: {
      hints: "warning", // "error" or false are valid too
      maxEntrypointSize: 150000, // in bytes, default 250k
      maxAssetSize: 450000, // in bytes
    },
  },
  {
    recordsPath: path.join(__dirname, "records.json"),
    output: {
      chunkFilename: "[name].[chunkhash:8].js",
      filename: "[name].[chunkhash:8].js",
    },
    plugins: [new webpack.NamedModulesPlugin()],
  },
  parts.clean(PATHS.build),
  parts.minifyJavaScript(),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true,
      },
      // Run cssnano in safe mode to avoid
      // potentially unsafe transformations.
      safe: true,
    },
  }),
  parts.extractCSS({
    use: ["css-loader", parts.autoprefix()],
  }),
  parts.purifyCSS({
    paths: glob.sync(`./src/**/*.js`, { nodir: true }),
  }),
  parts.loadImages({
    options: {
      limit: 15000,
      name: "[name].[hash:8].[ext]",
    },
  }),
  parts.generateSourceMaps({ type: "source-map" }),
  {
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "all",
          },
        },
      },
      runtimeChunk: {
        name: "manifest",
      },
    },
  },
  parts.attachRevision(),
]);

const developmentConfig = merge([
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
  parts.loadImages(),
]);

module.exports = mode => {
  const pages = [
    parts.page({
      title: "Webpack demo",
      entry: {
        app: PATHS.app,
      },
      chunks: ["app", "manifest", "vendor"],
    }),
    parts.page({
      title: "Another demo",
      path: "another",
      entry: {
        another: path.join(PATHS.app, "another.js"),
      },
      chunks: ["another", "manifest", "vendor"],
    }),
  ];
  const config =
    mode === "production" ? productionConfig : developmentConfig;

  return merge([commonConfig, config, { mode }].concat(pages));
};
