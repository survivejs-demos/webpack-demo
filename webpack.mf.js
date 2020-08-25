const path = require("path");
const { mode } = require("webpack-nano/argv");
const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");

const cssLoaders = [parts.autoprefix(), parts.tailwind()];

const commonConfig = merge([
  parts.clean(),
  parts.loadJavaScript(),
  parts.loadImages(),
  parts.page({
    entry: {
      app: path.join(__dirname, "src", "mf.js"),
    },
    mode,
  }),
]);

const developmentConfig = merge([
  parts.devServer(),
  parts.extractCSS({ loaders: cssLoaders }),
]);

const productionConfig = merge([
  parts.extractCSS({ options: { hmr: true }, loaders: cssLoaders }),
]);

const getConfig = (mode) => {
  switch (mode) {
    case "development":
      return merge(commonConfig, developmentConfig, { mode });
    case "production":
      return merge(commonConfig, productionConfig, { mode });
  }
};

module.exports = getConfig(mode);
