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
  const pages = [
    merge(
      parts.entry({
        name: "app",
        path: path.join(__dirname, "src", "index.js"),
        mode,
      }),
      parts.page({
        title: "Webpack demo",
        chunks: ["app", "runtime", "vendor"],
      })
    ),
    merge(
      parts.entry({
        name: "another",
        path: path.join(__dirname, "src", "another.js"),
        mode,
      }),
      parts.page({
        title: "Another demo",
        path: "another",
        chunks: ["another", "runtime", "vendor"],
      })
    ),
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
