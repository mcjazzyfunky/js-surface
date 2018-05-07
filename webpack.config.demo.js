const
  path = require('path'),
  HtmlWebpackPlugin  = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/demo/demo.js',
  devtool: 'inline-source-map',
  devServer: {
    openPage: 'demo/demo.html',
  },
  
  module: {
    unknownContextCritical: false,
    rules: [
      {
        test: /\.(js|jsx)$/,
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
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      'js-surface$': path.resolve(__dirname, 'src/main/js-surface.js'),
      'js-surface/render$': path.resolve(__dirname, 'src/main/submodules/render.js'),
      'js-surface/classes$': path.resolve(__dirname, 'src/main/submodules/classes.js'),
      'js-hyperscript/surface$': path.resolve(__dirname, 'node_modules/js-hyperscript/dist/surface.js'),
      'js-dom-factories/surface$': path.resolve(__dirname, 'node_modules/js-dom-factories/dist/surface.js')
    }
  },
  output: {
    filename: 'demo/demo-bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'demo/demo.html',
      template: 'src/demo/demo.html',
      inject: 'body'
    })
  ]
};
