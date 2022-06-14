const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

if (process.env.INTEGRATION === 'editor' && !process.env.PRIVATE_TOKEN) {
  console.error('请配置 code token 的环境变量 PRIVATE_TOKEN\n获取地址 https://code.alipay.com/profile/private_tokens\n')
  process.exit(1)
}

module.exports = (env) => ({
  entry: path.join(__dirname, env.entry || 'startup'),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, `dist`),
  },
  devtool: 'inline-source-map',
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.less'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              esModule: false,
              publicPath: './',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: `index.html`,
      template: path.join(__dirname, './index.html'),
    }),
  ],
  devServer: {
    disableHostCheck: true,
    staticOptions: {
      setHeaders: (res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
      },
    },
    contentBasePublicPath: '/assets/~',
    contentBase: '/',
    proxy: {
      '/code-service': {
        target: process.env.CODE_SERVICE_HOST || 'https://code.alipay.com',
        headers: {
          'PRIVATE-TOKEN': process.env.PRIVATE_TOKEN,
        },
        changeOrigin: true,
        pathRewrite: {
          '^/code-service': '',
        },
      },
    },
    host: '0.0.0.0',
    port: 8001
  }
});
