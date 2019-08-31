const path = require('path');

const appRoot = process.env.REACT_APP_ROOT || process.cwd();

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const paths = {
  appRoot,
  appSrc: path.resolve(appRoot, 'src'),
  appHtml: path.resolve(appRoot, 'public/index.html'),
  servedPath: path.resolve(appRoot, '/'),
  appBuild: path.resolve(appRoot, 'build')
};

module.exports = paths;
