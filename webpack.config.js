const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
require("dotenv").config({ path: path.join(__dirname, "./.env") });
const styleLoader = require.resolve("style-loader");
const webpack = require('webpack');

module.exports = (env) => ({
  entry: path.join(__dirname, env.entry || "startup"),
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, `dist`),
    publicPath: "/",
  },
  devtool: "inline-source-map",
  mode: "development",
  // webpack v4
  node: {
    net: "empty",
    fs: "empty",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", ".less"],
    // webpack v5
    // fallback: {
    //   net: false,
    //   child_process: false,
    //   http: false,
    //   https: false,
    //   fs: false,
    // }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              esModule: false,
              publicPath: "./",
            },
          },
        ],
      },
      {
        test: /\.module.less$/,
        use: [
          {
            loader: styleLoader,
            options: {
              esModule: false,
            },
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              sourceMap: true,
              esModule: false,
              modules: {
                mode: "local",
                localIdentName: "[local]___[hash:base32:5]",
              },
            },
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /^((?!\.module).)*less$/,
        use: [
          {
            loader: styleLoader,
            options: {
              esModule: false,
            },
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              sourceMap: true,
              esModule: false,
            },
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: {
                  "kt-html-selector": "alex-root",
                  "kt-body-selector": "alex-root",
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp|ico|svg)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: "[name].[ext]",
              // require 图片的时候不用加 .default
              esModule: false,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "[name].[ext]",
                  esModule: false,
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(txt|text|md)$/,
        use: "raw-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: `index.html`,
      template: path.join(__dirname, "./index.html"),
    }),
    new webpack.DefinePlugin({
      'process.env': {
        HOST: JSON.stringify(process.env.HOST || ''),
      },
    }),
  ],
  devServer: {
    disableHostCheck: true,
    staticOptions: {
      setHeaders: (res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
      },
    },
    contentBasePublicPath: "/assets/~",
    contentBase: "/",
    proxy: { },
    host: "0.0.0.0",
    port: 8001,
    historyApiFallback: {
      disableDotRule: true,
    },
  },
});
