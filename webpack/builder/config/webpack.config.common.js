const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const macros = require("babel-plugin-macros");

const paths = require("./paths");

const cssModuleClassName = "[name]__[local]--[hash:base64:5]";

const reactCssModulesBabelPlugin = [
  "react-css-modules",
  {
    webpackHotModuleReloading: true,
    handleMissingStyleName: "warn",
    generateScopedName: cssModuleClassName,
    filetypes: {
      ".scss": {
        syntax: "postcss-scss"
      }
    }
  }
];

module.exports = {
  config: {
    // Don't attempt to continue if there are any errors.
    bail: true,
    entry: {
      app: paths.appSrc
    },
    resolve: {
      modules: ["node_modules"],
      extensions: [".json", ".js", ".jsx", ".ts", ".tsx"],
      alias: {
        react: path.resolve(paths.appRoot, "node_modules/react"),
        "@src": paths.appSrc
      },
      plugins: []
    }
  },
  loaders: {
    common: [
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: "graphql-tag/loader"
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve("url-loader"),
        options: {
          limit: 10000,
          name: "[name].[hash:8].[ext]"
        }
      },
      {
        test: /\.tsx?$/,
        include: [paths.appSrc],
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: {
              compact: true,
              presets: ["stage-2", "react"],
              plugins: [reactCssModulesBabelPlugin, macros]
            }
          },
          {
            loader: require.resolve("ts-loader"),
            options: {
              configFile: path.resolve(__dirname, "tsconfig.json"),
              transpileOnly: true
            }
          }
        ]
      }
    ],
    babel: {
      test: /\.(js|jsx|mjs)$/,
      include: [paths.appSrc],
      loader: require.resolve("babel-loader"),
      options: {
        compact: true,
        presets: [
          "stage-2",
          "react",
          [
            "env",
            {
              loose: true,
              modules: false,
              useBuiltIns: "entry",
              targets: {
                chrome: 52,
                firefox: 51,
                browsers: ["last 5 versions"]
              }
            }
          ]
        ],
        plugins: ["transform-class-properties", reactCssModulesBabelPlugin]
      }
    },
    css: [
      {
        loader: require.resolve("css-loader"),
        options: {
          importLoaders: 1,
          modules: true,
          localIdentName: cssModuleClassName
        }
      },
      {
        loader: require.resolve("postcss-loader"),
        options: {
          // Necessary for external CSS imports to work
          // https://github.com/facebookincubator/create-react-app/issues/2677
          ident: "postcss",
          plugins: () => [
            require("postcss-flexbugs-fixes"),
            autoprefixer({
              browsers: [
                ">1%",
                "last 4 versions",
                "Firefox ESR",
                "not ie < 9" // React doesn't support IE8 anyway
              ],
              flexbox: "no-2009"
            })
          ]
        }
      },
      {
        loader: "sass-loader"
      }
    ],
    file: [
      {
        loader: require.resolve("file-loader"),
        exclude: [/\.js$/, ".tsx?$", /\.html$/, /\.json$/],
        options: {
          name: "[name].[hash:8].[ext]"
        }
      }
    ]
  },
  plugins: [
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin({
      REACT_APP_ENV: JSON.stringify(process.env.REACT_APP_ENV),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),
    new CopyWebpackPlugin([path.resolve(paths.appRoot, "public")])
  ]
};
