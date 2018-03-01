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
    var glob = require("glob");
    var _ = require('lodash');
    var path = require('path');
    var fs = require('fs');
    var cwd = process.cwd();
    var spawn = require('child_process').spawn;
    var spawnSync = require('child_process').spawnSync;
    var webDriverMngr = {
        seleniumDriver: 'Selenium standalone version available',
        chromeDriver: 'chromedriver version available'
    };
    var find = require('find');

    function _prependString(itemToSuffix, strToPrepend) {
        if (arguments.length !== 2) {
            return;
        }
        if (_.isArray(itemToSuffix)) {
            return _.map(itemToSuffix, function(item) {
                return item.indexOf(strToPrepend) !== -1 ? item : strToPrepend + item;
            });
        }
        return strToPrepend + itemToSuffix;
    }

    function _resolvePathFromCwd(targetPath) {
        return path.resolve(cwd, targetPath);
    }

    function _globSync(pattern, options) {
        return glob.sync(pattern, options);
    }

    function _getFilesForGlobPattern(patterns, options) {
        var result = [];
        // Iterate over flattened patterns array.
        _.flattenDeep(patterns).forEach(function(pattern) {
            // If the first character is ! it should be omitted
            var exclusion = pattern.indexOf('!') === 0;
            // If the pattern is an exclusion, remove the !
            if (exclusion) {
                pattern = pattern.slice(1);
            }
            // Find all matching files for this pattern.
            var matches = _globSync(pattern, options);
            if (exclusion) {
                // If an exclusion, remove matching files.
                result = _.difference(result, matches);
            } else {
                // Otherwise add matching files.
                result = _.union(result, matches);
            }
        });
        return result;
    }

    function _getJsFiles(options) {
        return _getFilesForGlobPattern(['**/*.js'], options);
    }

    function _getCssFiles(options) {
        return _getFilesForGlobPattern(['**/*.css'], options);
    }

    function _formatString() {
        var str = '',
            params = [];
        if (arguments) {
            str = arguments[0];
            params = _.drop([].slice.call(arguments));
            for (var i = 0; i < params.length; i++) {
                str = str.replace(new RegExp('\\{' + i + '\\}', 'gi'),
                    params[i]);
            }
        }
        return str;
    }

    function _removeUseStrict(src) {
        return src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g,
            '$1');
    }

    // Return the given source code with any leading banner comment stripped.
    function _stripBanner(src, options) {
        if (!options) {
            options = {};
        }
        var m = [];
        if (options.line) {
            // Strip // ... leading banners.
            m.push('(?:.*\\/\\/.*\\r?\\n)*\\s*');
        }
        if (options.block) {
            // Strips all /* ... */ block comment banners.
            m.push('\\/\\*[\\s\\S]*?\\*\\/');
        } else {
            // Strips only /* ... */ block comment banners, excluding /*! ...
            // */.
            m.push('\\/\\*[^!][\\s\\S]*?\\*\\/');
        }
        var re = new RegExp('^\\s*(?:' + m.join('|') + ')\\s*', '');
        return src.replace(re, '');
    }

    /**
     * Load the grunt task defined in external file and return the configuration
     * object containing file name as task name.
     * 
     * @param baseDir
     *            directory from which the grunt task should be read and
     *            registered.
     * @returns {{}}
     */
    function _getGruntTaskConfiguration(baseDir) {
        var object = {};
        var key;

        glob.sync('*.js', {
            cwd: baseDir
        }).forEach(function(option) {
            key = option.replace(/\.js$/, '');
            object[key] = require(path.join(baseDir, option));
        });
        return object;
    }

    function _getRelativePathToDir(fullPath, from) {
        var filePath = '';
        if (!from) {
            filePath = fullPath;
        }

        if (!fullPath) {
            throw 'Path should not be empty or null.';
        }

        var index = fullPath.indexOf(from);
        filePath = fullPath;
        if (index >= 0) {
            filePath = fullPath.substr(index + from.length);
        }
        if (filePath.indexOf('/') === 0) {
            filePath = filePath.substr(1);
        }
        return filePath;
    }

    function _root(args) {
        args = Array.prototype.slice.call(arguments, 0);
        return path.join.apply(path, [cwd].concat(args));
    }

    function _readFile(file) {
        return fs.readFileSync(file);
    }

    function _readPackageJsonFile() {
        return JSON.parse(_readFile("./package.json"));
    }

    function _compileLodashTemplate(template, options) {
        var compiled = _.template(template);
        return compiled(options);
    }

    function _isWebpackDevServer() {
        return process.argv[1] && !!(/webpack-dev-server/.exec(process.argv[1]));
    }

    function _hasProcessFlag(flag) {
        return process.argv.join('').indexOf(flag) > -1;
    }

    function _isArray(obj) {
        return _.isArray(obj);
    }

    function _runSpawn(done, task, optArg, optIo) {
        optArg = typeof optArg !== 'undefined' ? optArg : [];
        var processResponse = {};
        var child;
        var running = false;
        var stdio = 'inherit';
        if (optIo !== 'undefined') {
            stdio = optIo;
            child = spawn(task, optArg, { stdio: stdio });
        } else {
            child = spawn(task, optArg);
            var response = [];
            child.stdout.on('data', function(data) {
                console.log('data' + data);
                response.push(data);
            });
            processResponse.stdOut = response;

            var errResponse = [];
            child.stderr.on('data', function(data) {
                errResponse.push(data);
            });
            processResponse.stdErr = errResponse;
        }

        child.on('close', function() {
            console.log('Process Close');
            if (!running) {
                running = true;
                done();
            }
        });
        child.on('error', function() {
            console.log('An error has occurred while executing process');
            if (!running) {
                console.error('Encountered a child error');
                running = true;
                done();
            }
        });
        return processResponse;
    }

    function _getProtractorCli() {
        var result = require.resolve('protractor');
        if (result) {
            return result.replace('index', 'cli');
        } else {
            throw new Error('Please check whether protractor is installed or not.');
        }
    }

    function _isSeleniumServerAndDriverAvailable() {
        var available = false;
        console.log('Checking selenium server and driver files are available.');
        return available;
    }

    function _findSeleniumJarPath(directory, jarRegEx) {
        if (!jarRegEx) {
            jarRegEx = /\.jar$/ig;
        }
        var files = find.fileSync(jarRegEx, directory);
        return files[files.length - 1];
    }

    function _createDirectoryIfNotExists(path) {
        console.log('Checking path exists or not ...');
        fs.stat(path, function(err, stats) {
            if (err) {
                console.log('Provided path does not exists creating it : ' + path);
                fs.mkdirSync(path);
            }
        });
    }

    module.exports = {
        getFilesForGlobPattern: _getFilesForGlobPattern,
        getJsFiles: _getJsFiles,
        getCssFiles: _getCssFiles,
        formatString: _formatString,
        removeUseStrict: _removeUseStrict,
        getRelativePathToDir: _getRelativePathToDir,
        stripBanner: _stripBanner,
        getGruntTaskConfiguration: _getGruntTaskConfiguration,
        root: _root,
        readFile: _readFile,
        readPackageJsonFile: _readPackageJsonFile,
        compileLodashTemplate: _compileLodashTemplate,
        resolvePathFromCwd: _resolvePathFromCwd,
        prependString: _prependString,
        isWebpackDevServer: _isWebpackDevServer,
        hasProcessFlag: _hasProcessFlag,
        isArray: _isArray,
        runSpawn: _runSpawn,
        isSeleniumServerAndDriverAvailable: _isSeleniumServerAndDriverAvailable,
        getProtractorCli: _getProtractorCli,
        findSeleniumJarPath: _findSeleniumJarPath,
        createDirectoryIfNotExists: _createDirectoryIfNotExists
    };
}());