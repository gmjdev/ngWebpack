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
(function () {
    module.exports = {
        /**
         * Application Directory Structure
         */
        directory: {
            src: 'src',
            app: 'app',
            assets: 'assets',
            build: 'dist',
            temp: 'tmp',
            reports: 'reports',
            nodeModule: 'node_modules',
            bowerComponents: 'bower_components'
        },
        appSourceDir: function () {
            return this.directory.src + '/' + this.directory.app;
        },
        assetsDir: function () {
            return this.directory.src + '/' + this.directory.assets;
        },
        releaseDir: function () {
            return this.directory.build + '/release/';
        },
        devDir: function () {
            return this.directory.build + '/development/';
        },
        fontAssetsDir: function () {
            return this.directory.assets + '/fonts/';
        },
        imagesAssetsDir: function () {
            return this.directory.assets + '/images/';
        },
        tsLintReportDir: function () {
            return this.directory.reports + '/tslint/';
        },
        e2eReportDir: function () {
            return this.directory.reports + '/e2e/';
        },
        esLintReportDir: function () {
            return this.directory.reports + '/eslint/';
        },

        templatePage: 'src/index.template.ejs',
        indexHtmlPage: 'index.html',

        allowedExtensions: ['.ts', '.ejs', '.js', '.css', '.scss', '.sass', '.json'],
        /**
         * Type script files configurations
         */
        tsAppEntryFile: ['src/main.ts'],
        tsVendorFile: ['src/vendor.ts'],
        tsPolyfillsFile: ['src/polyfills.ts'],

        /**
         * Webpack name and destination pattern
         */
        // sassIncludePath: ['./node_modules/bootstrap-sass/assets/stylesheets'],
        // styleDestinationPattern: '[name].[contenthash].css',

        bundleName: {
            js: '[name].[hash].js',
            css: '[name].[hash].css',
            appCss: '[name]-app.[hash].css'
        },

        assetsName: {
            image: '[name].[ext]',
            font: '[name].[ext]',
            webPackAsset: 'webpack-assets.json'
        },

        /** Development backend server configuration support * */
        server: {
            port: 9900,
            host: 'localhost',
            protocol: 'http',
            liveReloadPort: 35729,
            proxies: [{
                context: '/cortex',
                host: '127.0.0.1',
                port: 8080,
                https: false,
                xforward: false,
                headers: {
                    "x-custom-added-header": ''
                },
                hideHeaders: ['x-removed-header']
            }],
            publicUrl: function () {
                return this.protocol + '://' + this.host + ":" + this.port + '/';
            }
        },

        /**
         * CSS and SASS file path configurations
         */
        cssSource: ['src/assets/**/*.css', '!src/assets/**/*.min.css',
            'src/app/**/*.css'
        ],
        sassSource: ['src/app/**/*.scss'],
        sassMainSource: './src/main.scss',
        sassAppThemeSource: './src/app/app-theme/app-theme.scss',

        /**
         * Test Specific Configuration Settings
         */
        testConfig: {
            karma: {
                serverPort: 9876,
                frameworks: ['jasmine'],
                reporters: ['mocha', 'coverage', 'remap-coverage'],
                preprocessors: ['coverage', 'webpack', 'sourcemap'],
                browsers: ['Chrome'],
                files: [{
                        pattern: './config/karma.shim.js',
                        watched: false
                    },
                    {
                        pattern: './src/assets/**/*.png',
                        included: false,
                        served: true
                    }
                ],
                ng2KarmaShimFileToProcess: './config/karma.shim.js'
            },
            reporters: {
                json: './reports/coverage/json/coverage.json',
                html: './reports/coverage/html',
                cobertura: './reports/coverage/cobertura.xml',
                testSummary: null
            },
            typeScriptMime: ['ts', 'tsx']
        },

        e2eTestConfig: {
            tsE2eSpecFile: 'src/app/**/*.e2e.ts',
            htmlReportFileName: 'protractor.e2e',
            configFile: './protractor.config.js',
            junitFilePrefix: 'junit-e2e-'
        },

        tsLint: {
            formatter: 'stylish',
            configFile: './tslint.json',
            reportFileName: 'tslint.checkstyle.xml',
            severity: 'warning',
            files: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/**/*.e2e.ts', '!src/testing/**/*.ts'],
            testFiles: ['!src/**/*.ts', 'src/**/*.spec.ts', '!src/**/*.e2e.ts', '!src/testing/**/*.ts'],
            e2eFiles: ['!src/**/*.ts', '!src/**/*.spec.ts', 'src/**/*.e2e.ts', '!src/testing/**/*.ts']
        },

        esLint: {
            configFile: '.eslintrc.json',
            reportFIleName: 'eslint.html',
            files: ['src/**/*.js', '!node_modules/**/*'],
            htmlReportFileName: 'eslint.html'
        }
    };
}());