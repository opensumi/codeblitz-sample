const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
require("dotenv").config({ path: path.join(__dirname, "./.env") });
const styleLoader = require.resolve("style-loader");

// CODE_SERVICE_HOST=https://codeup.aliyun.com/

const antCodeSitHost = "http://code.test.alipay.net";
const antCodeProdHost =
  process.env.CODE_SERVICE_HOST || "https://code.alipay.com";

console.log(antCodeProdHost);

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
    proxy: {
      "/code-service": {
        target: antCodeProdHost,
        headers: {
          // editor 模式配置环境变量 PRIVATE_TOKEN 获取地址 https://code.alipay.com/profile/private_tokens
          // "PRIVATE-TOKEN": process.env.PRIVATE_TOKEN,

          // codeup 代理配置cookie 前往 https://codeup.aliyun.com/ 自行配置
          Cookie:
            'cna=c3JQGtPj8RUCASp4S2HYR4LT; help_csrf=FEQ0KxYm%2Fgz0O3Px1RKBQ86PQ7%2BFw785wy74ds7rOqVtsGoWkagX6LBTbTmnOHYylqcdYXNVGk3jW3clqxrTOg48alJfwf3Tzz2TxBNOaKubKroh1Sh2cBDwI%2BA91qhv3aD9NhxuyZ89ldQFRjWTXA%3D%3D; cr_token=49e2d07e-603c-47f0-ad43-3ae5b90aad87; XSRF-TOKEN=7606e726-448b-47d6-82f4-cf577aed4294; _samesite_flag_=true; cookie2=1692dad9c80bb0f7a3ed873b3a1f2a8b; t=6ca38eae89c5e65ff7ceb180657cc23b; _tb_token_=53e3bb387b133; aliyun_lang=zh; currentRegionId=cn-hangzhou; ak_user_locale=zh_CN; teambition_lang=zh_CN; ak_user_locale=zh_CN; aliyun_choice=CN; teambition_lang=zh_CN; login_aliyunid_pk=1528091042282432; LOGIN_ALIYUN_PK_FOR_TB=1528091042282432; TEAMBITION_SESSIONID.sig=UPbjTZxd9IztW3rqoLuMOeojEZk; login_aliyunid="dt_134655****"; login_aliyunid_ticket=bo$JZYNKzqf169L5LdTfXg8NLXyXplKYy11jx0o7Yn_8tpof_BNTwUhTOoNC1ZBeeMfKJzxdnb95hYssNIZor6q7SCxRtgmGCbifG2Cd4ZWazmBdHI6sgXZqg4XFWQfyKpeu*0vCmV8s*MT5tJl3_1w$0; login_aliyunid_csrf=_csrf_tk_1142391980951665; hssid=7ed5f8d5-1b94-43d6-91a6-613aff287fd8; hsite=6; aliyun_country=CN; aliyun_site=CN; TEAMBITION_SESSIONID=eyJ1aWQiOiI2NGNiNDFmNDVkN2RkZTM3OWE5OGUzZWUiLCJhdXRoVXBkYXRlZCI6MTY5MTcyMDM0Nzg2MCwidXNlciI6eyJfaWQiOiI2NGNiNDFmNDVkN2RkZTM3OWE5OGUzZWUiLCJuYW1lIjoiZHRfMTM0NjU1OTM1NiIsImVtYWlsIjoiYWNjb3VudHNfNjRjYjQxZjQ1ZDdkZGUzNzlhOThlM2UxQG1haWwudGVhbWJpdGlvbi5jb20iLCJhdmF0YXJVcmwiOiJodHRwczovL3Rjcy1kZXZvcHMuYWxpeXVuY3MuY29tL3RodW1ibmFpbC8xMTJ3NzY2OGE5ZjNkMmUwMWQ2NGI5NjMwMjU5YjIwN2Y0MGEvdy8xMDAvaC8xMDAiLCJyZWdpb24iOiIiLCJsYW5nIjoiIiwiaXNSb2JvdCI6ZmFsc2UsIm9wZW5JZCI6IiIsInBob25lRm9yTG9naW4iOiIiLCJjcmVhdGVkIjoiMjAyMy0wOC0wM1QwNTo1ODoxMi45MDNaIn0sImxvZ2luRnJvbSI6IiJ9; acw_tc=781bad2016919809529114953e4b579f862dd63d6be00634f2253a7788c217; TB_TENANT_ID=64cb4273d25b601786611d14; TB_TENANT_TYPE=organization; tfstk=dEbDcSmIsLMQI9CgIqLbkfYLjhERhxT6HO39BFpa4LJ7GZeXkVSGOLFXWinx7GvlCKKvuOBiItBJ3FLAkPjMEtu9DNfsSC5NCS9TGuCfGFTapJBgJs1biu2Lpj9idtT67JeK2V-b-F6EN2mlf8nnP92PJSxBKfmyUCdS6-phgL0hNaA2Xm12EVuNrgxcQLirYcLZ5QPOzci60QOkp1bevq5..; l=fBMG1wZPgea7WfokBOfZPurza77TjIRAguPzaNbMi9fPO_525HIFB19_OYLyCnGVFsdeR37fwLl9BeYBcWNInxvO0hiburkmnmOk-Wf..; isg=BFlZe4quWREzEwCQz-pq743RaEMz5k2Y---0y3sO2gD_gnkUwzRgaMcagEb0OuXQ; TB_ACCESS_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhcHAiOiI1ZTczMGNmMjIwMWQyMGQ3MTc5ODhlNDYiLCJhdWQiOiIiLCJleHAiOjE2OTIyNDAxNTUsImlhdCI6MTY5MTk4MDk1NSwiaXNzIjoidHdzIiwianRpIjoiWnlHbXRjZmxnaUpSckl2ZThlMDc3TjlGVDFGMDJfeGM4OFUtZmM2LUxycz0iLCJyZW5ld2VkIjoxNjkxNzIwMzQ3ODYwLCJzY3AiOlsiYXBwX3VzZXIiXSwic3ViIjoiNjRjYjQxZjQ1ZDdkZGUzNzlhOThlM2VlIiwidHlwIjoiYWNjZXNzX3Rva2VuIn0.w06Zx0CgJnE-bXcumfceB9EIdAw_kjMhdCsIGB4s8S-VB4GGR_jVWcWoFEPlRZPXHRSvLwxdyY_j1oi9aQTlAA',
        },
        changeOrigin: true,
        pathRewrite: {
          "^/code-service": "",
        },
        onProxyReq: (request) => {
          console.log(request.path);
          request.setHeader("origin", antCodeProdHost);
        },
      },
      "/code-test": {
        target: antCodeSitHost,
        changeOrigin: true,
        pathRewrite: {
          "^/code-test": "",
        },
        // changeOrigin 只对 get 有效
        onProxyReq: (request) => {
          request.setHeader("origin", antCodeSitHost);
        },
      },
    },
    host: "0.0.0.0",
    port: 8001,
    historyApiFallback: {
      disableDotRule: true,
    },
  },
});
