// @ts-check

const path = require('path');

const outputPath = path.join(__dirname, 'out');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: path.join(__dirname, 'src/extension'),
  output: {
    filename: 'extension.js',
    path: outputPath,
    libraryTarget: 'commonjs2',
  },
  devtool: false,
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
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
    ],
  },
  plugins: [],
  target: 'webworker',
  externals: {
    vscode: 'commonjs vscode',
    kaitian: 'commonjs kaitian',
  },
};
