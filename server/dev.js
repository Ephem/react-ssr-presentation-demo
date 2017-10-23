require('babel-register')();

const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const resolve = require('path').resolve;

const createWebpackConf = require('../webpack.config.babel').createWebpackConf;

const clientCompiler = webpack(createWebpackConf());
const serverCompiler = webpack(createWebpackConf({ isServer: true }));

let hasStartedServer = false;
let serverCompile = false;
let clientCompile = false;

console.log('Webpack is watching server');
serverCompiler.watch({
    aggregateTimeout: 300,
    poll: true
}, () => {
    serverCompile = true;
    if (!hasStartedServer && clientCompile) {
        hasStartedServer = true;
        require('./server');
    }
    console.log('Webpack compiled new server-code');
});

clientCompiler.plugin('done', () => {
    clientCompile = true;
    if (!hasStartedServer && serverCompile) {
        hasStartedServer = true;
        require('./server');
    }
    console.log('Webpack compiled new client-code');
});

const webpackDevServer = new WebpackDevServer(clientCompiler, {
    hot: true,
    contentBase: resolve(__dirname, 'public/generated'),
    publicPath: '/public/generated/',
    stats: { colors: true },
    noInfo: true
});

webpackDevServer.listen(8080, 'localhost', () => {
    console.log('DevServer started on port 8080');
});
