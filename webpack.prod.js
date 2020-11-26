const merge = require('webpack-merge');
const path = require('path');
const base = require('./webpack.config.js');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(base, {
  mode: 'production',
  output: {
    filename: 'bundle.min.js'
  },
  devtool: false,
  performance: {
    maxEntrypointSize: 3000000,
    maxAssetSize: 3000000
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  }
});
