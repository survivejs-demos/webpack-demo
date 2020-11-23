const { MiniHtmlWebpackPlugin } = require("mini-html-webpack-plugin");
const { WebpackPluginServe } = require("webpack-plugin-serve");

module.exports = {
  mode: "development",
  entry: ["./tests", "webpack-plugin-serve/client"],
  watch: true,
  plugins: [
    new WebpackPluginServe({
      port: process.env.PORT || 8080,
      static: "./dist",
      waitForBuild: true,
    }),
    new MiniHtmlWebpackPlugin(),
  ],
};
