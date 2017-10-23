require('babel-register')();

const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const resolve = require('path').resolve;

const webpackClientConfig = require('../../webpack.config.babel').default;

const clientCompiler = webpack(webpackClientConfig);

clientCompiler.plugin('done', () => {
    require('./server');
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
