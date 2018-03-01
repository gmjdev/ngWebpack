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
(function() {
    var cwd = process.cwd();
    var helpers = require('./utils/util.js');
    var appConfig = require('./app.config.js');
    var LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
    var ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
    var ProvidePlugin = require('webpack/lib/ProvidePlugin');
    var DefinePlugin = require('webpack/lib/DefinePlugin');
    var webpack = require('webpack');

    module.exports = {
        devtool: 'inline-source-map',
        resolve: {
            extensions: ['.ts', '.js', '.scss']
        },

        module: {
            rules: [{
                test: /\.ts$/,
                enforce: 'post',
                include: helpers.root('src'),
                loader: 'istanbul-instrumenter-loader',
                exclude: [/\.spec\.ts$/, /\.e2e\.ts$/, /node_modules/]
            }, {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader?inlineSourceMap=true&sourceMap=false',
                    'angular2-template-loader'
                ]
            }, {
                test: /\.json$/,
                loader: 'json-loader',
                exclude: [helpers.root('src/index.html')]
            }, {
                test: /\.css$/,
                loader: ['to-string-loader', 'css-loader'],
                exclude: [helpers.root('src/index.html')]
            }, {
                test: /\.html$/,
                loader: 'raw-loader',
                exclude: [helpers.root('src/index.html')]
            }, {
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: ['raw-loader', 'sass-loader']
            }, {
                test: /\.(png|jpe?g|gif|ico)$/,
                loader: 'file-loader?name=' + appConfig.imagesAssetsDir() + appConfig.assetsName.image
            }]
        },
        plugins: [
            new DefinePlugin({
                'ENV': JSON.stringify('testing'),
                'HMR': false,
                'process.env': {
                    'ENV': JSON.stringify('testing'),
                    'NODE_ENV': JSON.stringify('testing'),
                    'HMR': false,
                }
            }),
            new ContextReplacementPlugin(
                // The (\\|\/) piece accounts for path separators in *nix and Windows
                /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
                helpers.root('src'), // location of your src
                {}
            ),
            new LoaderOptionsPlugin({
                debug: true,
                options: {
                    sassResources: helpers.root(appConfig.directory.src, appConfig.directory.app)
                }
            }),
        ],

        /**
         * Include polyfills or mocks for various node stuff
         * Description: Node configuration
         *
         * See: https://webpack.github.io/docs/configuration.html#node
         */
        node: {
            global: true,
            process: false,
            crypto: 'empty',
            module: false,
            clearImmediate: false,
            setImmediate: false
        }
    };
}());