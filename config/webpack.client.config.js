const path = require('path')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AssetsPlugin = require('assets-webpack-plugin');
const webpack = require('webpack');
const smp = new SpeedMeasurePlugin();
const outputDir = path.resolve(__dirname, '../build/public')
import pkg from '../package.json'
import webpackConfig from '../tools/webpack.config';
import {ifDebug} from '../tools/lib/utils'
 
module.exports = smp.wrap({
    mode: webpackConfig.mode,
    context: webpackConfig.context,
    name: 'client',
    devtool: "eval-cheap-source-map",
    entry: {
        client: [
            'babel-polyfill',
            './src/client.js',
        ],
    },
    output: {
        publicPath: webpackConfig.output.publicPath,
        path: outputDir,
        filename: ifDebug('[name].js', '[chunkhash:8].js'),
        chunkFilename: ifDebug('[name].chunk.js', '[chunkhash:8].chunk.js'),
    },
    module: {
        rules:[
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, '../src')
                ],
                use: [
                    //...cssLoaderLegacySupportPlugins.loader,
                    {
                        loader: 'esbuild-loader',
                        options: {
                            loader: 'jsx',
                            target: 'es2015',
                        }
                    },
                ]
            },
        ...webpackConfig.module.rules
        ]
    },
    plugins:
        [
            ...webpackConfig.plugins,
            new webpack.ProgressPlugin(),
            new webpack.ProvidePlugin({
                process: 'process/browser',
            }),
            new webpack.DefinePlugin({
               'process.env.NODE_ENV': ifDebug('"development"', '"production"'),
                'process.env.BROWSER': true,
                //'process.env.RENTALL_BUILD_MODE': `"${buildMode}"`,
                __DEV__: ifDebug(true, false),
            }),
            
        ]
})

