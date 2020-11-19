const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");

const mode = "production";

module.exports = merge(
  { mode },
  parts.entry({ name: "app", path: "./src/multi.js", mode }),
  parts.page({ title: "Demo", chunks: [] }),
  parts.page({ title: "Another", url: "another" })
);
