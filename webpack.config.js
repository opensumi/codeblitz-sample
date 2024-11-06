const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
require("dotenv").config({ path: path.join(__dirname, "./.env") });
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const webpack = require('webpack');

module.exports = (env) => ({
  entry: path.join(__dirname, env.entry || "startup"),
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, `dist`),
    publicPath: "/",
  },
  devtool: "inline-source-map",
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", ".less"],
    fallback: {
      "path": require.resolve("path-browserify"),
      "fs": false,
      "crypto": false,
      "stream": false,
      "buffer": false,
      "os": false,
      "process": false,
    }
  },
  experiments: {
    asyncWebAssembly: true,
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
            loader: "style-loader",
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
                localIdentName: "[local]___[hash:base64:5]",
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
            loader: "style-loader",
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
    new NodePolyfillPlugin({
      includeAliases: ['process', 'Buffer'],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'assets'),
    },
    allowedHosts: "all",
    host: "0.0.0.0",
    port: 8001,
    historyApiFallback: {
      disableDotRule: true,
    },
    hot: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: false,
      },
    },
  },
});
