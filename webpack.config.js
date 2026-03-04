const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptWebpackPlugin = require("html-inline-script-webpack-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";
  const projectName = path.basename(__dirname);
  const buildVersion = "applovin";

  return {
    entry: path.resolve(__dirname, "src", "index.jsx"),
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js",
      publicPath: "",
      clean: true,
    },
    resolve: {
      extensions: [".js", ".jsx"],
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
        filename: isProd
          ? `${projectName}_${buildVersion}.html`
          : "index.html",
      }),
      ...(isProd
        ? [new HtmlInlineScriptWebpackPlugin({ scriptMatchPattern: [/bundle\.js$/] })]
        : []),
    ],
    devtool: isProd ? false : "source-map",
    devServer: {
      static: path.resolve(__dirname, "public"),
      port: 3000,
      hot: true,
      open: true,
    },
    performance: {
      hints: false,
    },
  };
};
