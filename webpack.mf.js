const path = require("path");
const { component, mode } = require("webpack-nano/argv");
const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");

const commonConfig = merge([
  {
    output: { publicPath: "/" },
  },
  parts.loadJavaScript(),
  parts.loadImages(),
  parts.page(),
  parts.extractCSS({ loaders: [parts.tailwind()] }),
]);

const configs = {
  development: merge(
    { entry: ["webpack-plugin-serve/client"] },
    parts.devServer()
  ),
  production: {},
};

const shared = {
  react: { singleton: true },
  "react-dom": { singleton: true },
};
const componentConfigs = {
  app: merge(
    {
      entry: [path.join(__dirname, "src", "bootstrap.js")],
    },
    parts.page(),
    parts.federateModule({
      name: "app",
      remotes: { mf: "mf@/mf.js" },
      shared,
    })
  ),
  header: merge(
    {
      entry: [path.join(__dirname, "src", "header.js")],
    },
    parts.federateModule({
      name: "mf",
      filename: "mf.js",
      exposes: { "./header": "./src/header" },
      shared,
    })
  ),
};

if (!component) throw new Error("Missing component name");

module.exports = merge(
  commonConfig,
  configs[mode],
  { mode },
  componentConfigs[component]
);
