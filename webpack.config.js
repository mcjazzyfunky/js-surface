const
  path = require('path'),
  CompressionPlugin = require('compression-webpack-plugin');

module.exports = env => {
  const
    { mode, type } = env || {},
    modeName = mode === 'production' ? 'production' : 'development',
    typeName = ['cjs', 'amd'].includes(type) ? type : 'umd',
    //lib = env && env.lib === 'dio' ? 'dio' : 'react'
    lib = 'react';
  
  return {
    mode: modeName,
    entry: {
      'js-surface': './src/main/js-surface.js',
      'common': './src/main/submodules/common.js',
    },
    devtool: modeName === 'production' ? false : 'inline-source-map',
    module: {
      unknownContextCritical: false,
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: ['babel-preset-env'],
            plugins: [
              'transform-object-rest-spread'
            ]
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js'],
      alias: {
        ...(lib === 'dio' ? {
          'react': path.resolve(__dirname, 'node_modules/dio.js/dist/umd.min.js'),
          'react-dom': path.resolve(__dirname, 'node_modules/dio.js/dist/umd.min.js')
        } : {})
      }
    },
    output: {
      filename: (typeName === 'umd' ? '' : `${typeName}/`) + `[name].${modeName}.js`,
      path: path.resolve(__dirname, 'dist'),
      library: 'jsSurface',
      libraryTarget: typeName === 'cjs' ? 'commonjs2' : typeName
    },
    plugins: [
      new CompressionPlugin()
    ]
  };
};
