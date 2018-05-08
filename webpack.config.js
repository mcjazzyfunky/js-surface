const
  path = require('path'),
  CompressionPlugin = require('compression-webpack-plugin');

module.exports = env => {
  const
    { mode, type } = env || {},
    modeName = mode === 'production' ? 'production' : 'development',
    typeName = ['cjs', 'amd'].includes(type) ? type : 'umd';

  return {
    mode: modeName,
    entry: {
      'js-surface': './src/main/js-surface.js',
      'addons': './src/main/submodules/addons.js',
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
        'react': path.resolve(__dirname, 'node_modules/react/cjs/react.production.min.js'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom/cjs/react-dom.production.min.js')
        //'react': path.resolve(__dirname, 'node_modules/dio.js/dist/umd.min.js'),
        //'react-dom': path.resolve(__dirname, 'node_modules/dio.js/dist/umd.min.js')
      }
    },
    externals: ['js-spec'],
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
