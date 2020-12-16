const path = require('path');

module.exports = {
  entry: {
    planout: './build/index.js',
    planout_core_compatible: './build/index_core_compatible.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: ['@babel/preset-env'],
          plugins: [
            '@babel/plugin-proposal-function-bind',
            '@babel/plugin-syntax-dynamic-import',
          ]
        }
      },
    ]
  },
  optimization: {
    minimize: false
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'planout',
    globalObject: 'this',
    // output directory is ./dist relative to git/npm repo
    path: path.resolve(__dirname, '..', 'dist'),
  },
  target: 'node'
}
