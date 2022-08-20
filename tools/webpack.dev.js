import webpack from 'webpack'
import browserSync from 'browser-sync';
import clientConfig from '../config/webpack.client.config'
(async function start() {
    const webpackBundler = webpack(clientConfig)
    webpackBundler.run((err, stats) => {
        if (err) {
        console.log(err)
        }
    })

})()

function handleServer(server) {
    server.once('exit', (code) => {
        throw new Error(`server terminated unexpectedly with code ${code}`)
    })
    server.stdout.on('data', (data) => {
        process.stdout.write(data);
    })
    server.stderr.on('data', (data) => {
        process.stdout.write(data);
    })
}