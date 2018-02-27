const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const UglifyWebpackPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cssnano = require("cssnano");
const HtmlWebpackPlugin = require("html-webpack-plugin");

exports.page = ({
  path = "",
  template = require.resolve(
    "html-webpack-plugin/default_index.ejs"
  ),
  title,
  entry,
  chunks,
} = {}) => ({
  entry,
  plugins: [
    new HtmlWebpackPlugin({
      chunks,
      filename: `${path && path + "/"}index.html`,
      template,
      title,
    }),
  ],
});

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
    minimizer: [new UglifyWebpackPlugin()],
  },
});

exports.attachRevision = () => ({
  plugins: [
    new webpack.BannerPlugin({
      banner: new GitRevisionPlugin().version(),
    }),
  ],
});

exports.clean = path => ({
  plugins: [new CleanWebpackPlugin([path])],
});

exports.purifyCSS = ({ paths }) => ({
  plugins: [new PurifyCSSPlugin({ paths })],
});

exports.extractCSS = ({ include, exclude, use }) => {
  // Output extracted CSS to a file
  const plugin = new ExtractTextPlugin({
    // `allChunks` is needed to extract from extracted chunks as well.
    allChunks: true,
    filename: "[name].[contenthash:8].css",
  });

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,

          use: plugin.extract({
            use,
            fallback: "style-loader",
          }),
        },
      ],
    },
    plugins: [plugin],
  };
};

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    stats: "errors-only",
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    overlay: {
      errors: true,
      warnings: true,
    },
  },
});

exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,

        use: ["style-loader", "css-loader"],
      },
    ],
  },
});

exports.autoprefix = () => ({
  loader: "postcss-loader",
  options: {
    plugins: () => [require("autoprefixer")()],
  },
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg)$/,
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

exports.loadJavaScript = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        use: "babel-loader",
      },
    ],
  },
});

exports.generateSourceMaps = ({ type }) => ({
  devtool: type,
});

exports.setFreeVariable = (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [new webpack.DefinePlugin(env)],
  };
};
