import webpack from 'webpack';
import path, { resolve } from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackManifestPlugin from 'webpack-manifest-plugin';
import nodeExternals from 'webpack-node-externals';

const isLocal = process.env.NODE_ENV === 'local';

const PUBLIC_PATH = 'public/generated/';

function pushIfDefined(arr, obj) {
    if (obj) {
        arr.push(obj);
    }
}

export function createWebpackConf({ isServer = false } = {}) {
    const rules = {};
    const plugins = {};
    // Config shape:
    const webpackConfig = {
        entry: {},
        output: {},
        module: {
            rules: []
        },
        plugins: [],
        externals: []
        // Conditional: target: 'node'
        // Conditional: devtool: 'source-map'
    };

    // -----------------------------------
    //          Entry and output
    // -----------------------------------
    if (isServer) {
        webpackConfig.entry = {
            server: ['./app/serverIndex.js']
        };
        webpackConfig.output = {
            libraryTarget: 'commonjs2',
            path: resolve(__dirname, PUBLIC_PATH),
            filename: '[name].js'
        };
        webpackConfig.target = 'node';
    } else {
        webpackConfig.entry = {
            application: ['./app/clientEntry.js']
        };
        webpackConfig.output = {
            path: resolve(__dirname, PUBLIC_PATH),
            filename: isLocal ? '[name].js' : '[name].[chunkhash].js'
        };
        plugins.manifest = new WebpackManifestPlugin({
            fileName: 'stats.json',
            publicPath: '/' + PUBLIC_PATH
        });
    }
    // -----------------------------------

    // -----------------------------------
    // JavaScript transpiling and bundling
    // -----------------------------------
    if (!isServer) {
        plugins.define = new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(isLocal ? 'local' : 'production')
        });
    }

    rules.babel = {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    ['env', {
                        modules: false
                    }],
                    'stage-2',
                    'react'
                ]
            }
        }
    };

    if (isServer) {
        rules.babel.use.options.presets[0][1].targets = { node: 'current' };
        webpackConfig.externals = [nodeExternals()];
    }
    if (!isServer && !isLocal) {
        plugins.uglify = new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        });
    }
    // -----------------------------------

    // -----------------------------------
    //            CSS & Fonts
    // -----------------------------------
    const cssLoader = {
        loader: `css-loader${isServer ? '/locals' : ''}`,
        options: {
            modules: true,
            localIdentName: '[name]__[local]___[hash:base64:5]'
        }
    };

    rules.css = {
        test: /\.css$/
    };

    if (isServer) {
        rules.css.use = cssLoader;
    }
    if (!isServer && !isLocal) {
        rules.css.use = ExtractTextPlugin.extract(cssLoader);
        plugins.extractText = new ExtractTextPlugin({
            filename: '[name].[contenthash].css',
            allChunks: true
        });
    }

    rules.fonts = {
        test: /\.(eot|svg|ttf|woff)$/,
        use: {
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                emitFile: !isServer
            }
        }
    };
    // -----------------------------------

    // -----------------------------------
    //         Developer tooling
    // -----------------------------------
    if (!isServer && isLocal) {
        webpackConfig.output.publicPath = '/' + PUBLIC_PATH;
        webpackConfig.devtool = 'source-map';

        // Dev server and Hot module replacement
        //   This is used with a devServer-config
        //   that is defined in server/dev.js
        webpackConfig.entry.application.unshift(
            'react-hot-loader/patch',
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server'
        );
        rules.babel.use.options.plugins = ['react-hot-loader/babel'];
        plugins.hotModuleReplacement = new webpack.HotModuleReplacementPlugin();
        plugins.namedModules = new webpack.NamedModulesPlugin();

        // CSS
        rules.css.use = [{ loader: 'style-loader' }, cssLoader];
    }
    // -----------------------------------

    // -----------------------------------
    //            Final setup
    // -----------------------------------
    pushIfDefined(webpackConfig.module.rules, rules.babel);
    pushIfDefined(webpackConfig.module.rules, rules.fonts);
    pushIfDefined(webpackConfig.module.rules, rules.css);

    pushIfDefined(webpackConfig.plugins, plugins.extractText);
    pushIfDefined(webpackConfig.plugins, plugins.manifest);
    pushIfDefined(webpackConfig.plugins, plugins.define);
    pushIfDefined(webpackConfig.plugins, plugins.uglify);
    pushIfDefined(webpackConfig.plugins, plugins.hotModuleReplacement);
    pushIfDefined(webpackConfig.plugins, plugins.namedModules);

    return webpackConfig;
}

export default [
    createWebpackConf(),
    createWebpackConf({ isServer: true })
];
