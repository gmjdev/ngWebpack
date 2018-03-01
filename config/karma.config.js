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
// Karma configuration
(function() {
    var webpackConfig = require('./webpack.test.js');
    var appConfig = require('./app.config.js');
    module.exports = function(config) {
        var configuration = {
            basePath: '',

            frameworks: appConfig.testConfig.karma.frameworks,

            //exclude: [],

            files: appConfig.testConfig.karma.files,

            /*
             * preprocess matching files before serving them to the browser
             * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
             */
            preprocessors: {
                './config/karma.shim.js': appConfig.testConfig.karma.preprocessors
            },

            failOnEmptyTestSuite: false,

            // Webpack Config at ./webpack.test.js
            webpack: webpackConfig,

            // Webpack please don't spam the console when running in karma!
            webpackMiddleware: {
                stats: 'errors-only'
            },

            webpackServer: {
                noInfo: true
            },

            reporters: appConfig.testConfig.karma.reporters,

            coverageReporter: {
                type: 'in-memory'
            },

            remapCoverageReporter: {
                'text-summary': appConfig.testConfig.reporters.testSummary,
                json: appConfig.testConfig.reporters.json,
                html: appConfig.testConfig.reporters.html,
                cobertura: appConfig.testConfig.reporters.cobertura
            },

            // web server port
            port: appConfig.testConfig.karma.serverPort,

            // enable / disable colors in the output (reporters and logs)
            colors: true,

            logLevel: config.LOG_INFO,

            autoWatch: false,

            browsers: appConfig.testConfig.karma.browsers,

            phantomJsLauncher: {
                exitOnResourceError: true
            },

            customLaunchers: {
                ChromeTravisCi: {
                    base: 'Chrome',
                    flags: ['--no-sandbox']
                }
            },

            /*
             * Continuous Integration mode
             * if true, Karma captures browsers, runs the tests and exits
             */
            singleRun: true,
            mime: {
                'text/x-typescript': appConfig.testConfig.typeScriptMime
            }
        };

        if (process.env.TRAVIS) {
            configuration.browsers = [
                'ChromeTravisCi'
            ];
        }

        // make sure both reporter plugins are loaded 
        config.set(configuration);
    };
}());