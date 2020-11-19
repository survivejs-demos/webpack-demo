const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");

module.exports = merge(
  { mode: "production", entry: { app: "./src/multi.js" } },
  parts.page({ title: "Demo" }),
  parts.page({ title: "Another", url: "another" })
);
