const { mode } = require("webpack-nano/argv");
const { merge } = require("webpack-merge");
const path = require("path");

const parts = require("./webpack.parts");

const cssLoaders = [parts.autoprefix(), parts.tailwind()];

const commonConfig = merge([
  {
    output: {
      path: path.resolve(process.cwd(), "dist"),
      // Tweak this to match your GitHub project name
      publicPath: "/",
    },
    resolveLoader: {
      alias: {
        "demo-loader": path.resolve(__dirname, "loaders/demo-loader.js"),
      },
    },
  },
  parts.clean(),
  parts.extractCSS({ loaders: cssLoaders }),
  parts.loadImages({
    limit: 15000,
  }),
  parts.loadJavaScript(),
  parts.setFreeVariable("HELLO", "hello from config"),
]);

const productionConfig = merge([
  {
    output: {
      chunkFilename: "[name].[contenthash:4].js",
      filename: "[name].[contenthash:4].js",
      assetModuleFilename: "[name].[contenthash:4][ext][query]",
    },
    recordsPath: path.join(__dirname, "records.json"),
  },
  parts.minifyJavaScript(),
  parts.minifyCSS({
    options: {
      preset: ["default"],
    },
  }),
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

const developmentConfig = merge([parts.devServer()]);

const getConfig = (mode) => {
  const pages = [
    parts.page({
      title: "Webpack demo",
      entry: {
        app: path.join(__dirname, "src", "index.js"),
      },
      chunks: ["app", "runtime", "vendor"],
      mode,
    }),
    parts.page({
      title: "Another demo",
      path: "another",
      entry: {
        another: path.join(__dirname, "src", "another.js"),
      },
      chunks: ["another", "runtime", "vendor"],
      mode,
    }),
  ];

  let config;
  switch (mode) {
    case "production":
      config = productionConfig;
      break;
    case "development":
    default:
      config = developmentConfig;
  }

  return merge([commonConfig, config, { mode }].concat(pages));
};

module.exports = getConfig(mode);
