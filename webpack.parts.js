const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const glob = require("glob");
const PurgeCSSPlugin = require("purgecss-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cssnano = require("cssnano");
const { MiniHtmlWebpackPlugin } = require("mini-html-webpack-plugin");

const ALL_FILES = glob.sync(path.join(__dirname, "src/*.js"));
const APP_SOURCE = path.join(__dirname, "src");

exports.page = ({ path = "", template, title, entry, chunks } = {}) => ({
  entry,
  plugins: [
    new MiniHtmlWebpackPlugin({
      chunks,
      filename: `${path && path + "/"}index.html`,
      context: {
        title,
      },
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
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false,
    }),
  ],
});

exports.minifyJavaScript = () => ({
  optimization: {
    minimizer: [new TerserPlugin({ sourceMap: true })],
  },
});

exports.attachRevision = () => ({
  plugins: [
    new webpack.BannerPlugin({
      banner: new GitRevisionPlugin().version(),
    }),
  ],
});

exports.clean = (path) => ({
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
      whitelistPatterns: [], // Example: /^svg-/
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
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash:4].css",
      }),
    ],
  };
};

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    stats: "errors-only",
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    open: true,
    overlay: true,
  },
});

exports.tailwind = () => ({
  loader: "postcss-loader",
  options: {
    plugins: [require("tailwindcss")()],
  },
});

exports.autoprefix = () => ({
  loader: "postcss-loader",
  options: {
    plugins: [require("autoprefixer")()],
  },
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        include,
        exclude,
        use: {
          loader: "url-loader",
          options,
        },
      },
    ],
  },
});

exports.generateSourceMaps = ({ type }) => ({
  devtool: type,
});
