const path = require("path");
const { component, mode } = require("webpack-nano/argv");
const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");
const { ModuleFederationPlugin } = require("webpack").container;

const cssLoaders = [parts.autoprefix(), parts.tailwind()];

const commonConfig = merge([
  parts.clean(),
  parts.loadJavaScript(),
  parts.loadImages(),
]);

const configs = {
  development: merge([
    parts.devServer(),
    parts.extractCSS({ loaders: cssLoaders }),
  ]),
  production: merge([
    parts.extractCSS({ options: { hmr: true }, loaders: cssLoaders }),
  ]),
};

const getConfig = (mode) => {
  const componentConfigs = {
    app: merge([
      {
        name: "app",
        output: {
          uniqueName: "mf-app",
        },
        plugins: [
          new ModuleFederationPlugin({
            name: "app",
            remotes: {
              mf: "mf@/mf.js",
            },
            shared: {
              react: {
                singleton: true,
              },
              "react-dom": {
                singleton: true,
              },
            },
          }),
        ],
      },
      parts.page({
        entry: {
          app: path.join(__dirname, "src", "mf-app.js"),
        },
        mode,
      }),
    ]),
    header: {
      name: "mf",
      entry: path.join(__dirname, "src", "header.js"),
      output: {
        uniqueName: "mf",
      },
      plugins: [
        new ModuleFederationPlugin({
          name: "mf",
          filename: "mf.js",
          exposes: {
            "./header": "./src/header",
          },
          shared: [
            {
              react: {
                singleton: true,
              },
              "react-dom": {
                singleton: true,
              },
            },
          ],
        }),
      ],
    },
  };

  return merge(commonConfig, configs[mode], componentConfigs[component], {
    mode,
  });
};

module.exports = getConfig(mode);
