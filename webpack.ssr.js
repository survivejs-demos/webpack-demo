const path = require("path");
const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");

module.exports = merge([
  {
    mode: "production",
    entry: {
      index: path.join(__dirname, "src", "ssr.js"),
    },
    output: {
      path: path.join(__dirname, "static"),
      filename: "[name].js",
      libraryTarget: "umd",
      globalObject: "this",
    },
  },
  parts.loadJavaScript(),
]);
