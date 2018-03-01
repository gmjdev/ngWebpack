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
    /*global jasmine, __karma__, window*/
    Error.stackTraceLimit = Infinity;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;

    require('core-js/client/shim');
    require('reflect-metadata');

    require('ts-helpers');

    require('zone.js/dist/zone');
    require('zone.js/dist/long-stack-trace-zone');
    require('zone.js/dist/proxy');
    require('zone.js/dist/sync-test');
    require('zone.js/dist/jasmine-patch');
    require('zone.js/dist/async-test');
    require('zone.js/dist/fake-async-test');

    var appContext = require.context('../src', true, /\.spec\.ts/);

    appContext.keys().forEach(appContext);

    // Select BrowserDomAdapter.
    // see https://github.com/AngularClass/angular2-webpack-starter/issues/124
    // Somewhere in the test setup
    var testing = require('@angular/core/testing');
    var browser = require('@angular/platform-browser-dynamic/testing');
    require('@angular/router/testing');

    testing.TestBed.initTestEnvironment(browser.BrowserDynamicTestingModule,
        browser.platformBrowserDynamicTesting());
}());