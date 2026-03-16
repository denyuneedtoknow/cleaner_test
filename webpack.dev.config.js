const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: path.resolve(__dirname, "src", "index.jsx"),
  resolve: {
    extensions: [".js", ".jsx"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/i,
        type: "asset/inline",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
      inject: "body",
      filename: "index.html",
    }),
    new webpack.DefinePlugin({
      language: JSON.stringify(process.env.LANGUAGE || "en"),
      buildVersion: JSON.stringify(process.env.BUILD_NETWORK || "applovin"),
    }),
  ],
  devtool: "source-map",
  devServer: {
    static: path.resolve(__dirname, "public"),
    port: 3000,
    hot: true,
    open: true,
  },
  mode: "development",
  performance: { hints: false },
};
