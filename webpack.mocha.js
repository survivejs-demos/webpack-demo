const path = require("path");
const { merge } = require("webpack-merge");

const parts = require("./webpack.parts");

module.exports = merge([
  {
    mode: "development",
  },
  parts.devServer(),
  parts.page({
    title: "Mocha demo",
    entry: {
      tests: path.join(__dirname, "tests"),
    },
  }),
]);
