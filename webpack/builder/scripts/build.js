process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config/webpack.config.prod');

const compiler = webpack(config);

// eslint-disable-next-line no-console
console.log(chalk.cyan('Creating an optimized production build...'));
compiler.run((err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(chalk.red(err));
    return;
  }

  // eslint-disable-next-line no-console
  console.log(chalk.green('Done!'));
});
