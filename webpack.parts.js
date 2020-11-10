const { WebpackPluginServe } = require("webpack-plugin-serve");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const glob = require("glob");
const PurgeCSSPlugin = require("purgecss-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const cssnano = require("cssnano");
const { MiniHtmlWebpackPlugin } = require("mini-html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

const ALL_FILES = glob.sync(path.join(__dirname, "src/*.js"));
const APP_SOURCE = path.join(__dirname, "src");

exports.federateModule = ({ name, filename, exposes, remotes, shared }) => ({
  plugins: [
    new ModuleFederationPlugin({ name, filename, exposes, remotes, shared }),
  ],
});

exports.entry = ({ name, mode, path }) => ({
  entry:
    mode === "development"
      ? { [name]: [path, "webpack-plugin-serve/client"] }
      : { [name]: path },
});

exports.page = ({ path = "", template, title, chunks } = {}) => ({
  plugins: [
    new MiniHtmlWebpackPlugin({
      chunks,
      filename: `${path && path + "/"}index.html`,
      context: { title },
      template,
    }),
  ],
});

exports.setFreeVariable = (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [new webpack.DefinePlugin(env)],
  };
};

exports.minifyCSS = ({ options }) => ({
  optimization: {
    minimizer: [new CssMinimizerPlugin({ minimizerOptions: options })],
  },
});

exports.minifyJavaScript = () => ({
  optimization: {
    minimizer: [new TerserPlugin()],
  },
});

exports.attachRevision = () => ({
  plugins: [
    new webpack.BannerPlugin({
      banner: new GitRevisionPlugin().version(),
    }),
  ],
});

exports.clean = () => ({
  plugins: [new CleanWebpackPlugin()],
});

exports.loadJavaScript = () => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include: APP_SOURCE, // Consider extracting as a parameter
        use: "babel-loader",
      },
    ],
  },
});

exports.eliminateUnusedCSS = () => ({
  plugins: [
    new PurgeCSSPlugin({
      paths: ALL_FILES, // Consider extracting as a parameter
      extractors: [
        {
          extractor: (content) =>
            content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
          extensions: ["html"],
        },
      ],
    }),
  ],
});

exports.extractCSS = ({ options = {}, loaders = [] } = {}) => {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            { loader: MiniCssExtractPlugin.loader, options },
            "css-loader",
          ].concat(loaders),
          // If you distribute your code as a package and want to
          // use _Tree Shaking_, then you should mark CSS extraction
          // to emit side effects. For most use cases, you don't
          // have to worry about setting flag.
          sideEffects: true,
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
      }),
    ],
  };
};

exports.devServer = () => ({
  watch: true,
  plugins: [
    new WebpackPluginServe({
      port: process.env.PORT || 8080,
      static: "./dist", // Expose if output.path changes
      liveReload: true,
      waitForBuild: true,
    }),
  ],
});

exports.tailwind = () => ({
  loader: "postcss-loader",
  options: {
    postcssOptions: {
      plugins: [require("tailwindcss")()],
    },
  },
});

exports.autoprefix = () => ({
  loader: "postcss-loader",
  options: {
    postcssOptions: {
      plugins: [require("autoprefixer")()],
    },
  },
});

exports.loadImages = ({ limit } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: limit,
          },
        },
      },
    ],
  },
});

exports.generateSourceMaps = ({ type }) => ({
  devtool: type,
});
