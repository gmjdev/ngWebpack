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
    var webpack = require('webpack');
    var webpackMerge = require('webpack-merge');
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    var helpers = require(path.resolve(cwd, './config/utils/util.js'));
    var commonConfig = require(path.resolve(cwd, './config/webpack.common.js'));
    var appConfig = require(path.resolve(cwd, './config/app.config.js'));
    var LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
    var AssetsPlugin = require('assets-webpack-plugin');
    var autoprefixer = require('autoprefixer');

    module.exports = webpackMerge(commonConfig, {
        devtool: 'cheap-module-eval-source-map',
        output: {
            path: path.resolve(cwd, appConfig.releaseDir()),
            filename: appConfig.bundleName.js,
            chunkFilename: '[name][id].chunk.js'
        },
        stats: {
            colors: true,
            cached: false,
            chunks: false,
            errors: true,
            errorDetails: true,
            warnings: false
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new AssetsPlugin({
                path: helpers.root(appConfig.releaseDir()),
                filename: appConfig.assetsName.webPackAsset,
                prettyPrint: true
            }),
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
                beautify: false,
                mangle: true,
                dead_code: true,
                unused: true,
                deadCode: true,
                compress: {
                    screw_ie8: true,
                    keep_fnames: true,
                    drop_debugger: true,
                    dead_code: false,
                    unused: false
                },
                comments: false
            }),
            new LoaderOptionsPlugin({
                debug: false,
                minimize: true,
                options: {
                    context: helpers.resolvePathFromCwd(appConfig.directory.src),
                    output: {
                        path: helpers.resolvePathFromCwd(appConfig.releaseDir()),
                        pathinfo: false
                    },
                    tslint: {
                        emitErrors: true,
                        failOnHint: true,
                        resourcePath: helpers.resolvePathFromCwd(appConfig.directory.src)
                    },
                    htmlLoader: {
                        minimize: true,
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
                }
            })
        ],
        devServer: {
            historyApiFallback: true,
            stats: 'minimal'
        }
    });
}());