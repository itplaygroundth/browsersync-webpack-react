const path = require('path')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const AssetsPlugin = require('assets-webpack-plugin');
const webpack = require('webpack');
const smp = new SpeedMeasurePlugin();
const outputDir = path.resolve(__dirname, '../build/public')
import pkg from '../package.json'
import config from '../tools/webpack.config';
import {ifDebug} from '../tools/lib/utils'


module.exports = smp.wrap({
    mode: config.mode,
    context: config.context,
    name: 'server',
    target: 'node',
    entry: {
        server: ['babel-polyfill', './src/server.js'],
      },
    output: {
        ...config.output,
        filename: '../server.js',
        libraryTarget: 'commonjs2',
      },
      module: {
        ...config.module,
    
        // Override babel-preset-env configuration for Node.js
        // rules: config.module.rules.map(rule => (rule.loader !== 'babel-loader' ? rule : {
        //   ...rule,
        //   query: {
        //     ...rule.query,
        //     presets: rule.query.presets.map(preset => (preset[0] !== 'env' ? preset : ['env', {
        //       targets: {
        //         node: parseFloat(pkg.engines.node.replace(/^\D+/g, '')).toString(),
        //       },
        //       modules: false,
        //       useBuiltIns: false,
        //       debug: false,
        //     }])),
        //   },
        // })),
      },
    
      externals: [
        /^\.\/assets\.json$/,
        (context, request, callback) => {
          const isExternal =
            request.match(/^[@a-z][a-z/.\-0-9]*$/i) &&
            !request.match(/\.(css|less|scss|sss)$/i);
          callback(null, Boolean(isExternal));
        },
      ],
    
      plugins: [
        // Define free variables
        // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': ifDebug("development","production"),
          'process.env.BROWSER': false,
          __DEV__: ifDebug(),
        }),
    
        // Do not create separate chunks of the server bundle
        // https://webpack.github.io/docs/list-of-plugins.html#limitchunkcountplugin
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    
        // Adds a banner to the top of each generated chunk
        // https://webpack.github.io/docs/list-of-plugins.html#bannerplugin
        new webpack.BannerPlugin({
          banner: 'require("source-map-support").install();',
          raw: true,
          entryOnly: false,
        }),
      ],
    
      node: {
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false,
      },
    
      devtool: ifDebug('cheap-module-source-map','source-map'),
    
})