const { mode } = require("webpack-nano/argv");
const { merge } = require("webpack-merge");
const path = require("path");

const parts = require("./webpack.parts");

const cssLoaders = [parts.autoprefix(), parts.tailwind()];

const commonConfig = merge([
  {
    output: {
      // Tweak this to match your GitHub project name
      publicPath: "/",
    },
    resolveLoader: {
      alias: {
        "demo-loader": path.resolve(__dirname, "loaders/demo-loader.js"),
      },
    },
  },
  parts.loadImages({
    options: {
      limit: 15000,
      name: "[name].[contenthash:4].[ext]",
    },
  }),
  parts.loadJavaScript(),
  parts.setFreeVariable("HELLO", "hello from config"),
]);

const productionConfig = merge([
  {
    output: {
      chunkFilename: "[name].[contenthash:4].js",
      filename: "[name].[contenthash:4].js",
    },
    recordsPath: path.join(__dirname, "records.json"),
  },
  parts.clean(),
  parts.minifyJavaScript(),
  parts.minifyCSS({
    options: {
      preset: ["default"],
    },
  }),
  parts.extractCSS({ loaders: cssLoaders }),
  parts.eliminateUnusedCSS(),
  parts.generateSourceMaps({ type: "source-map" }),
  {
    optimization: {
      splitChunks: {
        chunks: "all",
      },
      runtimeChunk: {
        name: "runtime",
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
  parts.extractCSS({ options: { hmr: true }, loaders: cssLoaders }),
]);

const getConfig = (mode) => {
  const pages = [
    parts.page({
      title: "Webpack demo",
      entry: {
        app: path.join(__dirname, "src", "index.js"),
      },
      chunks: ["app", "runtime", "vendor"],
    }),
    parts.page({
      title: "Another demo",
      path: "another",
      entry: {
        another: path.join(__dirname, "src", "another.js"),
      },
      chunks: ["another", "runtime", "vendor"],
    }),
  ];
  const config = mode === "production" ? productionConfig : developmentConfig;

  return merge([commonConfig, config, { mode }].concat(pages));
};

module.exports = getConfig(mode);
