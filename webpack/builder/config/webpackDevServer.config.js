const paths = require('./paths');

const port = parseInt(process.env.PORT, 10) || 3000;
const host = '0.0.0.0';

module.exports = {
  compress: true,
  // Silence WebpackDevServer's own logs since they're generally not useful.
  // It will still show compile warnings and errors with this setting.
  clientLogLevel: 'info',
  contentBase: '/public',
  // By default files from `contentBase` will not trigger a page reload.
  watchContentBase: true,
  hot: true,
  publicPath: paths.servedPath,
  quiet: true,
  host,
  port,
  overlay: false,
  progress: true,
  historyApiFallback: {
    disableDotRule: true
  }
};
