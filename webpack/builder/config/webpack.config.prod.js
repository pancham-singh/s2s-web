const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const InlineChunkWebpackPlugin = require('html-webpack-inline-chunk-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const common = require('./webpack.config.common');
const paths = require('./paths');
const analyzeWebpack = !!process.env.WP_ANALYZE;

// Assert this just to be safe.
// Development builds of React are slow and not intended for production.
if (process.env.NODE_ENV !== 'production') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

// Note: defined here because it will be used more than once.
const cssFilename = '[name].[contenthash:8].css';

module.exports = {
  ...common.config,
  devtool: false,
  output: {
    path: paths.appBuild,
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
    publicPath: paths.servedPath
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        oneOf: [
          ...common.loaders.common,
          { ...common.loaders.babel },
          {
            test: /\.s?css$/,
            loader: ExtractTextPlugin.extract({
              fallback: {
                loader: require.resolve('style-loader'),
                options: {
                  hmr: false
                }
              },
              use: common.loaders.css
            })
            // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
          },
          ...common.loaders.file
        ]
      }
    ]
  },
  plugins: [
    ...common.plugins,
    new CleanWebpackPlugin(paths.appBuild, {
      verbose: true,
      allowExternal: true
    }),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new ExtractTextPlugin({
      filename: cssFilename
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          drop_console: true
        }
      }
    }),
    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new ManifestPlugin({
      fileName: 'asset-manifest.json'
    }),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CompressionPlugin({
      test: /\.js$|\.css$|\.html$/
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: (module) => {
        if (!module.context) {
          return false;
        }

        return module.context.includes('node_modules');
      }
    }),
    // This plugin must come after the vendor one (because webpack
    // includes runtime into the last chunk)
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime',

      // minChunks: Infinity means that no app modules
      // will be included into this chunk
      minChunks: Infinity
    }),
    new InlineChunkWebpackPlugin({
      inlineChunks: ['runtime']
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: analyzeWebpack ? 'static' : 'disabled',
      generateStatsFile: analyzeWebpack
    })
  ]
};
