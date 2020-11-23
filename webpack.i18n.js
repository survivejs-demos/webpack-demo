const path = require("path");
const { MiniHtmlWebpackPlugin } = require("mini-html-webpack-plugin");
const APP_SOURCE = path.join(__dirname, "src");

module.exports = {
  mode: "production",
  entry: { index: path.join(APP_SOURCE, "i18n.js") },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: APP_SOURCE,
        use: "babel-loader",
      },
    ],
  },
  plugins: [new MiniHtmlWebpackPlugin()],
};
