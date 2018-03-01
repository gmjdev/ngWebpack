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
    var gutil = require('gulp-util');
    var environments = require('gulp-environments');
    var testing = environments.make("testing");
    var environment = 'Undefined';

    var config = {};
    if (environments.development()) {
        environment = 'development';
        config = require('./config/webpack.dev');
    } else if (environments.production()) {
        environment = 'production';
        config = require('./config/webpack.prod');
    } else if (testing()) {
        environment = 'testing';
        config = require('./config/webpack.test');
    } else {
        throw new gutil.PluginError('Webpack:build',
            gutil.colors.red('No valid environment is specified to build webpack.' +
                process.env.NODE_ENV), { showProperties: false });
    }

    gutil.log('Processing Webpack configuration for [ ' +
        gutil.colors.green(environment.toUpperCase()) + ' ] environment');
    module.exports = config;
}());