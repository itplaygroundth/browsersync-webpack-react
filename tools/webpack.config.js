const path = require("path");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
//const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//const isDebug = true;
const isDebug = !process.argv.includes("--release");
const isVerbose = process.argv.includes("--verbose");
const isAnalyze =
  process.argv.includes("--analyze") || process.argv.includes("--analyse");
import pkg from "../package.json";
const ifDebug = (debugValue, defaultValue) => {
  if (
    typeof debugValue === "undefined" &&
    typeof defaultValue === "undefined"
  ) {
    return isDebug;
  }
  return isDebug ? debugValue : defaultValue;
};
const config = {
  mode: ifDebug("development", "production"),
  context: path.resolve(__dirname, ".."),
  // output: {
  //   path: path.resolve(__dirname, '../build'),
  //   filename: 'bundle.js'
  // },
  output: {
    path: path.resolve(__dirname, '../build/public'),
    publicPath: '/',
    pathinfo: isVerbose,
 
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, "../src")],
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: isDebug,
            babelrc: false,
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: pkg.browserslist,
                  },
                  modules: false,
                  useBuiltIns: false,
                  debug: false,
                },
              ],
              "@babel/preset-react",

              //    ...isDebug ? [] : ['react-optimize'],
            ],
            plugins: ['react-hot-loader/babel']
          },
        },
      },
 
      {
        test: /\.css$/,
        use: [
          //MiniCssExtractPlugin.loader,
          'isomorphic-style-loader',
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, "../tools/postcss.config.js"),
              },
            },
          },
        ],
      },
    ],
  },
  // devServer: {
  //   'static': {
  //     directory: path.resolve(__dirname, '../build/public'),
  //   }
  // },
  plugins: [
    ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),
    //new MiniCssExtractPlugin(),
  ],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  stats: {
    colors: true,
    reasons: isDebug,
    hash: isVerbose,
    version: isVerbose,
    timings: true,
    chunks: isVerbose,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose,
  },
};

module.exports = config;
