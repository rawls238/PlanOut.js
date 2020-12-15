const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    planout: './build/index.js',
    planout_core_compatible: './build/index_core_compatible.js'
  },
  mode: 'production',
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
  output: {
    filename: '[name].min.js',
    libraryTarget: 'umd',
    library: 'planout',
    // output directory is ./dist relative to git/npm repo
    path: path.resolve(__dirname, '..', 'dist'),
  },
  plugins: [
  ]
}
