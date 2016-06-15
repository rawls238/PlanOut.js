var webpack = require('webpack');

module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt); 
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-webpack');

	grunt.initConfig({
    'webpack': {
      build: {
        progress: true,
        entry: {
          planout: './index.js',
          planout_core_compatible: './index_core_compatible.js'
        },
        output: {
          libraryTarget: 'umd',
          filename: 'dist/[name].js',
          library: 'PlanOut'
        },
        module: {
          loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          }]
        }
      }
    },
    'uglify': {
      options: {
        sourceMap: true,
        sourceMapName: 'dist/planout.map.js'
      },
      build: {
        files: {
          'dist/planout.min.js': 'dist/planout.js'
        }
      }
    }
   });
	 
	grunt.registerTask('default', ['webpack', 'uglify']);
}
