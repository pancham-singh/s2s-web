// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const config = require('../config/webpack.config.dev');
const devServerConfig = require('../config/webpackDevServer.config');

WebpackDevServer.addDevServerEntrypoints(config, devServerConfig);
const compiler = webpack(config);
const devServer = new WebpackDevServer(compiler, devServerConfig);

// "done" event fires when Webpack has finished recompiling the bundle.
// Whether or not you have warnings or errors, you will get this event.
compiler.plugin('done', (stats) => {
  // We have switched off the default Webpack output in WebpackDevServer
  // options so we are going to "massage" the warnings and errors and present
  // them in a readable focused way.
  const messages = formatWebpackMessages(stats.toJson({}, true));
  const isSuccessful = !messages.errors.length && !messages.warnings.length;
  if (isSuccessful) {
    console.log(chalk.green('Compiled successfully!'));
  }

  // If errors exist, only show errors.
  if (messages.errors.length) {
    // Only keep the first error. Others are often indicative
    // of the same problem, but confuse the reader with noise.
    if (messages.errors.length > 1) {
      messages.errors.length = 1;
    }
    console.log(chalk.red('Failed to compile.\n'));
    console.log(messages.errors.join('\n\n'));
    return;
  }

  // Show warnings if no errors were found.
  if (messages.warnings.length) {
    console.log(chalk.yellow('Compiled with warnings.\n'));
    console.log(messages.warnings.join('\n\n'));
  }
});

// Launch WebpackDevServer.
devServer.listen(devServerConfig.port, devServerConfig.host, (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return;
  }

  // eslint-disable-next-line no-console
  console.log(
    chalk.cyan(`Starting the development server: ${devServerConfig.host}:${devServerConfig.port}\n`)
  );
});
