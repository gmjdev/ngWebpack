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
    var environments = require('gulp-environments');
    var _ = require('lodash');
    var ROOT = './';
    var path = require('path');
    var cwd = process.cwd();
    var helpers = require(path.resolve(cwd, './config/utils/util.js'));
    var templateData = require(path.resolve(cwd, './config/template.data.js'));
    var appConfig = require(path.resolve(cwd, './config/app.config.js'));
    var webpack = require('webpack');
    var CopyWebpackPlugin = require('copy-webpack-plugin');
    var HtmlWebpackPlugin = require('html-webpack-plugin');
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    var polyfills = appConfig.tsPolyfillsFile,
        vendor = appConfig.tsVendorFile,
        appEntry = appConfig.tsAppEntryFile;
    var LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
    var AssetsPlugin = require('assets-webpack-plugin');
    var ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
    var ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
    var sourceAppDir = helpers.resolvePathFromCwd(appConfig.appSourceDir());
    var isProd = environments.production();
    var autoprefixer = require('autoprefixer');

    var bootstrapSassBuild = 'bootstrap-loader/lib/bootstrap.loader?extractStyles&configFilePath=./config/bootstrap/bootstrap-sass.config.json!bootstrap-loader/no-op.js';
    bootstrapSassBuild = 'bootstrap-loader/lib/bootstrap.loader?extractStyles&configFilePath=' + __dirname + '/bootstrap/bootstrap-sass.config.json!bootstrap-loader/no-op.js';

    var fontAwesome = 'font-awesome-webpack-sass!./config/font-awesome/font-awesome.config.js';
    polyfills = helpers.prependString(appConfig.tsPolyfillsFile, ROOT);
    vendor = helpers.prependString(appConfig.tsVendorFile, ROOT);
    appEntry = helpers.prependString(appConfig.tsAppEntryFile, ROOT);

    var vendors = [bootstrapSassBuild, fontAwesome];
    if (_.isString(vendor)) {
        vendors = vendors.unshift(vendor);
    } else if (_.isArray(vendor)) {
        vendors = _.flattenDeep(vendor.concat(vendors));
    }
    var extractLibSass = new ExtractTextPlugin(appConfig.bundleName.css);
    var extractAppSass = new ExtractTextPlugin(appConfig.bundleName.appCss);
    var extractLibcss = new ExtractTextPlugin(appConfig.bundleName.css);
    var extractAppcss = new ExtractTextPlugin(appConfig.bundleName.appCss);

    module.exports = {
        context: cwd,
        entry: {
            polyfills: polyfills,
            vendor: vendors,
            app: appEntry,
        },
        output: {
            path: helpers.resolvePathFromCwd(appConfig.directory.build),
            filename: appConfig.bundleName.js,
        },
        resolve: {
            alias: {
                jquery: "jquery/dist/jquery.min.js"
            },
            extensions: appConfig.allowedExtensions,
            modules: [
                helpers.resolvePathFromCwd(appConfig.directory.src),
                appConfig.directory.nodeModule,
                appConfig.directory.bowerComponents
            ]
        },
        optimization: {
            minimize: false,
            splitChunks: {
                cacheGroups: {
                    default: false,
                    commons: {
                        test: /jquery/,
                        name: "vendor",
                        chunks: "initial",
                        minSize: 1,
                        reuseExistingChunk: true
                    }
                }
            }
        },
        module: {
            rules: [{
                    test: /bootstrap\/dist\/js\/umd\//,
                    loader: 'imports-loader?jQuery=jquery'
                }, {
                    test: /\.ts$/,
                    loaders: [
                        'awesome-typescript-loader',
                        'angular2-template-loader'
                    ],
                    exclude: [/\.(spec|e2e)\.ts$/]
                }, {
                    test: /\.html$/,
                    loader: 'html-loader'
                }, {
                    test: /\.(png|jpe?g|gif|ico)$/,
                    loader: 'file-loader?name=' + appConfig.imagesAssetsDir() + appConfig.assetsName.image
                }, {
                    test: /\.css$/,
                    exclude: helpers.root(appConfig.directory.src, appConfig.directory.app),
                    loader: extractLibcss.extract('style-loader', 'raw-loader!css-loader?sourceMap')
                }, {
                    test: /\.css$/,
                    include: helpers.root(appConfig.directory.src, appConfig.directory.app),
                    loader: 'raw-loader'
                }, {
                    test: /\.s(c|a)ss$/,
                    exclude: /node_modules/,
                    include: helpers.root(appConfig.directory.src, appConfig.directory.app),
                    use: [
                        'raw-loader',
                        'resolve-url-loader',
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                },
                {
                    test: /\.s(c|a)ss$/,
                    exclude: helpers.root(appConfig.directory.src, appConfig.directory.app),
                    use: extractLibSass.extract([{
                            loader: 'css-loader',
                            options: {
                                importLoaders: true,
                                sourceMap: true,
                                modules: true,
                                url: false
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                path: './postcss.config.js',
                                sourceMap: 'inline',
                                plugins: function () {
                                    return [
                                        require("autoprefixer")
                                    ];
                                }
                            }
                        },
                        'resolve-url-loader',
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]),
                },
                {
                    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=' +
                        appConfig.fontAssetsDir() + appConfig.assetsName.font
                },
                {
                    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'file-loader?name=' + appConfig.fontAssetsDir() + appConfig.assetsName.font
                },
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                },
                {
                    test: /\.ejs$/,
                    use: [{
                        loader: 'ejs-compiled-loader?htmlmin'
                    }]
                }
            ]
        },
        // Plugins to avoid duplicate injection of dependent scripts and
        // Inject generated CSS and JS files in Html page
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                jquery: 'jquery',
                _: 'lodash',
                'window.jQuery': 'jquery',
                Popper: ['popper.js', 'default'],
                Tether: "tether",
                "window.Tether": "tether",
                Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
                Button: "exports-loader?Button!bootstrap/js/dist/button",
                Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
                Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
                Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
                Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
                Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
                Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
                Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
                Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
                Util: "exports-loader?Util!bootstrap/js/dist/util",
            }),
            new CopyWebpackPlugin([{
                from: appConfig.assetsDir(),
                to: appConfig.directory.assets
            }]),
            new ContextReplacementPlugin(
                // The (\\|\/) piece accounts for path separators in *nix and Windows
                /angular(\\|\/)core(\\|\/)(esm5(\\|\/)|esm5(\\|\/)src|esm(\\|\/)src|src)(\\|\/)/,
                /angular(\\|\/)core(\\|\/)@angular/,
                helpers.root(appConfig.directory.src), // location of your src
                {}
            ),
            new HtmlWebpackPlugin({
                template: appConfig.templatePage,
                filename: appConfig.indexHtmlPage,
                inject: true,
                title: templateData.title,
                data: templateData,
                xhtml: true
            }),
            new ScriptExtHtmlWebpackPlugin({
                defaultAttribute: 'defer'
            }),
            new webpack.HotModuleReplacementPlugin(),
            new LoaderOptionsPlugin({
                options: {
                    context: __dirname,
                    sassResources: helpers.root(appConfig.directory.src, appConfig.directory.app),
                    postcss: [autoprefixer],
                },
            }),
            // new ExtractTextPlugin({
            //     filename: appConfig.bundleName.css,
            //     disable: false,
            //     allChunks: true
            // }),
            extractAppcss,
            extractLibSass,
            extractLibSass,
            extractAppSass,
        ],
        node: {
            global: true,
            crypto: 'empty',
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false
        }
    };
}());