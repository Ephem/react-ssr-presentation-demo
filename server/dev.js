require('babel-register')();

const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const resolve = require('path').resolve;

const createWebpackConf = require('../webpack.config.babel').createWebpackConf;

const clientCompiler = webpack(createWebpackConf());
const serverCompiler = webpack(createWebpackConf({ isServer: true }));

clientCompiler.plugin('done', () => {
    serverCompiler.run(() => {
        require('./server');
    });
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
