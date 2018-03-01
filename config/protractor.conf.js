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
    require('ts-node/register');
    var path = require('path');
    var cwd = process.cwd();
    var helpers = require('./utils/util.js');
    var appConfig = require('./app.config.js');
    var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
    var jasmineReporters = require('jasmine-reporters');
    var webDriverMngrPath = path.resolve(cwd, './node_modules/webdriver-manager');
    var seleniumServerJarLocation = helpers.findSeleniumJarPath(webDriverMngrPath);
    seleniumServerJarLocation = './' + path.relative(__dirname, seleniumServerJarLocation);


    exports.config = {
        baseUrl: appConfig.server.publicUrl(),
        seleniumServerJar: seleniumServerJarLocation,

        multiCapabilities: [{
            browserName: 'chrome'
        }],

        // use `npm run e2e`
        specs: [
            helpers.root(appConfig.e2eTestConfig.tsE2eSpecFile)
        ],
        exclude: [],

        framework: 'jasmine2',

        allScriptsTimeout: 110000,

        jasmineNodeOpts: {
            showTiming: true,
            showColors: true,
            isVerbose: false,
            includeStackTrace: false,
            defaultTimeoutInterval: 60000,
            print: function (msg) {
                console.log(msg);
            }
        },
        directConnect: true,

        capabilities: {
            'browserName': 'chrome',
            'chromeOptions': {}
        },

        onPrepare: function () {
            var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
            // add jasmine spec reporter
            /*jshint -W117 */
            jasmine.getEnv().addReporter(new Jasmine2HtmlReporter({
                takeScreenshots: true,
                takeScreenshotsOnlyOnFailures: true,
                savePath: appConfig.e2eReportDir(),
                screenshotsFolder: 'images',
                cleanDestination: true,
                fileName: appConfig.e2eTestConfig.htmlReportFileName
            }));
            jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
                savePath: appConfig.e2eReportDir(),
                consolidateAll: false,
                filePrefix: appConfig.e2eTestConfig.junitFilePrefix,
            }));
            jasmine.getEnv().addReporter(new SpecReporter({
                displayStacktrace: false
            }));
            browser.ignoreSynchronization = true;
            /*jshint +W117 */
        },

        /**
         * Angular 2 configuration
         *
         * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page 
         * instead of just the one matching
         * `rootEl`
         */
        useAllAngular2AppRoots: true
    };
}());