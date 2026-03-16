const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptWebpackPlugin = require("html-inline-script-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const { languages } = require("./playable.config.js");

const projectName = path.basename(__dirname);
const buildDir = "dist";

/**
 * Один конфіг на мову. Мережа поки тільки applovin.
 * Запуск: cross-env BUILD_NETWORK=applovin webpack --config webpack.dynamic.config.js --mode production
 * Збирає всі мови в dist/applovin/<lang>/cleaner_test_applovin_<lang>.html
 */
const common = {
  entry: path.resolve(__dirname, "src", "index.jsx"),
  resolve: { extensions: [".js", ".jsx"] },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/i,
        type: "asset/inline",
      },
    ],
  },
  mode: "production",
  devtool: false,
  optimization: {
    minimizer: [new TerserPlugin({ extractComments: false })],
  },
  performance: { hints: false },
};

module.exports = languages.map((language) => ({
  ...common,
  output: {
    path: path.resolve(__dirname, buildDir, "applovin", language),
    filename: "bundle.js",
    publicPath: "",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
      inject: "body",
      filename: `${projectName}_applovin_${language}.html`,
    }),
    new HtmlInlineScriptWebpackPlugin({ scriptMatchPattern: [/bundle\.js$/] }),
    new webpack.DefinePlugin({
      language: JSON.stringify(language),
      buildVersion: JSON.stringify(process.env.BUILD_NETWORK || "applovin"),
    }),
  ],
}));
