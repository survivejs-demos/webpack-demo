const path = require("path");
const { component, mode } = require("webpack-nano/argv");
const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");

const cssLoaders = [parts.autoprefix(), parts.tailwind()];

const commonConfig = merge([
  parts.clean(),
  parts.loadJavaScript(),
  parts.loadImages(),
  parts.extractCSS({ loaders: cssLoaders }),
]);

const configs = {
  development: parts.devServer(),
  production: {},
};

const getConfig = (mode) => {
  const shared = {
    react: { singleton: true },
    "react-dom": { singleton: true },
  };

  const componentConfigs = {
    app: merge([
      parts.page({
        entry: {
          app: path.join(__dirname, "src", "bootstrap.js"),
        },
        mode,
      }),
      parts.federateModule({
        name: "app",
        remotes: {
          mf: "mf@/mf.js",
        },
        shared,
      }),
    ]),
    header: merge([
      {
        entry: path.join(__dirname, "src", "header.js"),
      },
      parts.federateModule({
        name: "mf",
        filename: "mf.js",
        exposes: {
          "./header": "./src/header",
        },
        shared,
      }),
    ]),
  };

  if (!component) {
    throw new Error("Missing component name");
  }

  return merge(commonConfig, configs[mode], componentConfigs[component], {
    mode,
  });
};

module.exports = getConfig(mode);
