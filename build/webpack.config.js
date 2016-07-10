module.exports = {
  entry: {
    planout: './build/index.js',
    planout_core_compatible: './build/index_core_compatible.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'jest', 'stage-0'],
          plugins: ['add-module-exports']
        }
      },
    ]
  },
  output: {
    filename: './dist/[name].js',
    libraryTarget: 'umd',
    library: 'planout'
  }
}
