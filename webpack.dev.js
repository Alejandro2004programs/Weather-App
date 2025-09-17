const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  watchOptions: {
      aggregateTimeout: 200,
      poll: 1000,
      ignored: /node_modules/,
    },
  devtool: "eval-source-map",
    devServer: {
      watchFiles: ["./src/template.html"],
    },
});