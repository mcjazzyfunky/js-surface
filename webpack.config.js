const
  path = require('path'),
  webpack = require('webpack'),
  CompressionPlugin = require('compression-webpack-plugin');

module.exports = env => {
  const
    { mode, type } = env || {},
    modeName = mode === 'production' ? 'production' : 'development',
    typeName = ['cjs', 'amd'].includes(type) ? type : 'umd';
  
  return {
    mode: modeName,
    entry: {
      'jsSurface': './src/main/js-surface.js',
      'jsSurfaceCommon': './src/main/submodules/common.js',
    },
    devtool: modeName === 'production' ? false : 'inline-source-map',
    externals: {
      'preact': 'preact',
      //'preact-context': 'preact.context'
    },
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
      }
    },
    output: {
      filename: ({ chunk }) => {
        const
          name = chunk.name,
          base = name === 'jsSurface' ? 'js-surface' : 'common';
       
        return (typeName === 'umd'
          ? ''
          : `${typeName}/`) + `${base}.${modeName}.js`;
      },
      path: path.resolve(__dirname, 'dist'),
      library: '[name]',
      libraryTarget: typeName === 'cjs' ? 'commonjs2' : typeName
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: JSON.stringify(modeName)
      }),
      new CompressionPlugin()
    ]
  };
};
