import webpack from 'webpack';
import path, { resolve } from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackManifestPlugin from 'webpack-manifest-plugin';

const isLocal = process.env.NODE_ENV === 'local';

const cssLoader = {
    loader: 'css-loader',
    options: {
        modules: true,
        localIdentName: '[name]__[local]___[hash:base64:5]',
        importLoaders: 1
    }
};

export function createWebpackClientConf() {
    const webpackConfig = {
        entry: {
            application: ['./app/clientEntry.js']
        },
        output: {
            path: resolve(__dirname, 'public/generated/'),
            filename: isLocal ? '[name].js' : '[name].[chunkhash].js'
        },
        module: {
            rules: [
                {
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
                            ],
                            plugins: isLocal ? ['react-hot-loader/babel'] : []
                        }
                    }
                },
                {
                    test: /\.(eot|svg|ttf|woff)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]'
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: isLocal ?
                        [{ loader: 'style-loader' }, cssLoader] :
                        ExtractTextPlugin.extract(cssLoader)
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin({
                filename: isLocal ? '[name].css' : '[name].[contenthash].css',
                allChunks: true
            }),
            new WebpackManifestPlugin({
                fileName: 'stats.json',
                publicPath: '/public/generated/'
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(isLocal ? 'local' : 'production')
            })
        ]
    };

    if (isLocal) {
        webpackConfig.output.publicPath = '/public/generated/';
        webpackConfig.devtool = 'source-map';
        webpackConfig.entry.application.unshift(
            'react-hot-loader/patch',
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server'
        );
        webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
        webpackConfig.plugins.push(new webpack.NamedModulesPlugin());
    } else {
        webpackConfig.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            new webpack.LoaderOptionsPlugin({
                minimize: true
            })
        );
    }

    return webpackConfig;
}

export default createWebpackClientConf();
