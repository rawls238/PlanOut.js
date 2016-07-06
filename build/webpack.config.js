module.exports = {
  entry: './build/index.js',
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
    filename: './dist/planout.js',
    libraryTarget: 'umd',
    library: 'planout'
  }
}
