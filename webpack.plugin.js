const path = require("path");
const DemoPlugin = require("./plugins/demo-plugin.js");

module.exports = {
  mode: "development",
  entry: {
    lib: path.join(__dirname, "src", "shake.js"),
  },
  plugins: [new DemoPlugin({ name: "demo" })],
};
