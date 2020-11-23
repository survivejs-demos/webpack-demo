const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");

module.exports = merge([
  {
    mode: "development",
    entry: ["./tests", "webpack-plugin-serve/client"],
  },
  parts.devServer(),
  parts.page(),
]);
