const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

const paths = require('./paths');
const common = require('./webpack.config.common');

module.exports = {
  ...common.config,
  output: {
    path: paths.appBuild,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: paths.servedPath
  },
  devtool: 'cheap-module-source-map',
  devServer: require('./webpackDevServer.config.js'),
  module: {
    strictExportPresence: true,
    rules: [
      {
        oneOf: [
          ...common.loaders.common,
          {
            ...common.loaders.babel,
            options: {
              ...common.loaders.babel.options,
              plugins: [...common.loaders.babel.options.plugins, 'react-hot-loader/babel']
            }
          },
          {
            test: /\.s?css$/,
            use: ['css-hot-loader'].concat(
              ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: common.loaders.css
              })
            )
          },
          ...common.loaders.file
        ]
      }
    ]
  },
  plugins: [
    ...common.plugins,
    new WatchMissingNodeModulesPlugin(path.resolve(paths.appRoot, 'node_modules')),
    new ExtractTextPlugin({
      filename: '[name].css'
    }),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml
    }),
    // Add module names to factory functions so they appear in browser profiler.
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  performance: {
    hints: false
  }
};
