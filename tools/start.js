 

import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import WriteFilePlugin from 'write-file-webpack-plugin';
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
import run from './run';
import runServer from './runServer';
import webpackConfig from './webpack.config';
import clean from './clean';
//import extractMessages from './extractMessages';
//import copy from './copy';

const isDebug = !process.argv.includes('--release');
process.argv.push('--watch');
import clientConfig from './../config/webpack.client.config'
import serverConfig from './../config/webpack.server.config'
//const [clientConfig, serverConfig] = webpackConfig;

/**
 * Launches a development web server with "live reload" functionality -
 * synchronizing URLs, interactions and code changes across multiple devices.
 */
async function start() {
  await run(clean);
  //await run(extractMessages);
  //await run(copy);
  await new Promise((resolve) => {
    // Save the server-side bundle files to the file system after compilation
    // https://github.com/webpack/webpack-dev-server/issues/62
    serverConfig.plugins.push(new WriteFilePlugin({ log: false }));

    // Hot Module Replacement (HMR) + React Hot Reload
    if (isDebug) {
      clientConfig.entry.client = [...new Set([
        'babel-polyfill',
        'react-hot-loader/patch',
        //'webpack-hot-middleware/client',
      ].concat(clientConfig.entry.client))];
      clientConfig.output.filename = clientConfig.output.filename.replace('[chunkhash', '[hash');
      clientConfig.output.chunkFilename = clientConfig.output.chunkFilename.replace('[chunkhash', '[hash');
      // clientConfig.module.rules.find(x => {
      //   console.log(x.use.loader=='babel-loader')
      // //  x.loader === 'babel-loader'
      // });
     // const rules = clientConfig.module.rules.find(x => x.use.loader === 'babel-loader');
     // rules.use.options.plugins =  ['react-hot-loader/babel'].concat( rules.use.options.plugins || []);
     // console.log(rules.use.options.plugins)
      clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
      clientConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin());
      //clientConfig.plugins.push(new MiniCssExtractPlugin());
    }

    const bundler = webpack([clientConfig]);
    const wpMiddleware = webpackDevMiddleware(bundler, {
      publicPath: clientConfig.output.publicPath,
      //stats: clientConfig.stats,
      index: 'index.html',
      // pretty colored output
      stats: { colors: true },
      writeToDisk: true,
  }) 
    const wphMiddleware = webpackHotMiddleware(bundler.compilers[0])
      
     
     const middleware = [
      wpMiddleware
    ];
     if (module.hot === true) {
      // bundler should be the same as above
      middleware.push(webpackHotMiddleware(bundler.compilers[0]));
    }
   
    // browserSync({
    //   port: 3002,
    //   notify: false,
    //   server: {
    //     baseDir: config.output.path,
    //     middleware
    //   },
    
    //   // No need to watch '*.js' here, webpack will take care of it
    //   // for us, including full page reloads if HMR won't work.
    //   // (Not convinced we _really_ need BrowserSync to watch things, but anyway...
    //   files: [
    //     'css/*.css',
    //     '*.html'
    //   ]
    // });
  
      let handleBundleComplete = async () => {
        handleBundleComplete = stats => !stats.stats[1].compilation.errors.length && runServer();

       const server = await runServer();
       const bs = browserSync.create();

       bs.init({
         ...isDebug ? {} : { notify: false, ui: false },

         proxy: {
           target: server.host,
           middleware: middleware,
           proxyOptions: {
             xfwd: true,
           },
           files: [
            'css/*.css',
            '*.html'
          ]
         },
       }, resolve);
      };
      wpMiddleware.waitUntilValid((stats)=>{
        browserSync({
          port: 3002,
          notify: false,
          server: {
            baseDir: clientConfig.output.path,
            middleware
          },
        
          // No need to watch '*.js' here, webpack will take care of it
          // for us, including full page reloads if HMR won't work.
          // (Not convinced we _really_ need BrowserSync to watch things, but anyway...
          files: [
            'css/*.css',
            '*.html'
          ]
        });
        //handleBundleComplete(stats)
      })
    //bundler.hooks('done', stats => handleBundleComplete(stats));
  });
}

export default start; 