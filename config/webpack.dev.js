/*********************************************************************************
 *    The GNU GENERAL PUBLIC LICENSE (GNU GPL V3)
 * 
 *    Angular4  Copyright (C) 2017  gmjdev
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.   
 * 
 ********************************************************************************/
'use strict';
(function () {
    var path = require('path');
    var cwd = process.cwd();
    var webpackMerge = require('webpack-merge');
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    var helpers = require(path.resolve(cwd, './config/utils/util.js'));
    var commonConfig = require(path.resolve(cwd, './config/webpack.common.js'));
    var appConfig = require(path.resolve(cwd, './config/app.config.js'));
    var LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
    var AssetsPlugin = require('assets-webpack-plugin');
    var webpack = require('webpack');
    var autoprefixer = require('autoprefixer');

    module.exports = webpackMerge(commonConfig, {
        devtool: 'cheap-module-eval-source-map',
        output: {
            path: path.resolve(cwd, appConfig.devDir()),
            filename: appConfig.bundleName.js,
            chunkFilename: '[name].chunk.js',
            sourceMapFilename: '[name].[hash].map',
        },

        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('development')
                }
            }),
            new AssetsPlugin({
                path: helpers.root(appConfig.devDir()),
                filename: appConfig.assetsName.webPackAsset,
                prettyPrint: true
            }),
            new LoaderOptionsPlugin({
                debug: true,
                options: {
                    context: helpers.resolvePathFromCwd(appConfig.directory.src),
                    output: {
                        path: helpers.resolvePathFromCwd(appConfig.devDir()),
                        pathinfo: true
                    },
                    tslint: {
                        emitErrors: true,
                        failOnHint: true,
                        resourcePath: helpers.resolvePathFromCwd(appConfig.directory.src)
                    },
                    htmlLoader: {
                        minimize: false,
                        removeAttributeQuotes: false,
                        caseSensitive: true,
                        customAttrSurround: [
                            [/#/, /(?:)/],
                            [/\*/, /(?:)/],
                            [/\[?\(?/, /(?:)/]
                        ],
                        customAttrAssign: [/\)?\]?=/]
                    },
                    postcss: [autoprefixer],
                },

            })
        ],

        devServer: {
            historyApiFallback: true,
            stats: 'minimal',
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            },
            outputPath: helpers.resolvePathFromCwd(appConfig.devDir()) +
                '//',
            proxy: appConfig.server.proxies,
            inline: true,
            hot: true
        }
    });
}());