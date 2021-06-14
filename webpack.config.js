const { mode } = require("webpack-nano/argv");
const { merge } = require("webpack-merge");
const path = require("path");

const parts = require("./webpack.parts");

const cssLoaders = [parts.autoprefix(), parts.tailwind()];

const commonConfig = merge([
  {
    resolveLoader: {
      alias: {
        "demo-loader": path.resolve(__dirname, "loaders/demo-loader.js"),
      },
    },
  },
  {
    output: {
      // Tweak this to match your GitHub project name
      publicPath: "/",
    },
  },
  { entry: ["./src"] },
  parts.page({ title: "Demo" }),
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
      chunkFilename: "[name].[contenthash].js",
      filename: "[name].[contenthash].js",
      assetModuleFilename: "[name].[contenthash][ext][query]",
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
  switch (mode) {
    case "production":
      return merge(commonConfig, productionConfig, { mode });
    case "development":
      return merge(commonConfig, developmentConfig, { mode });
    default:
      throw new Error(`Trying to use an unknown mode, ${mode}`);
  }
};

module.exports = getConfig(mode);
