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
    var gulp = require('gulp');
    var imagemin = require('gulp-imagemin');
    var autoprefixer = require('gulp-autoprefixer');
    var sourcemaps = require('gulp-sourcemaps');
    var header = require('gulp-header');
    var template = require('gulp-template');
    var gutil = require('gulp-util');
    var clean = require('gulp-clean');
    var filesize = require('gulp-filesize');
    var changed = require('gulp-changed');
    var watch = require('gulp-watch');
    var del = require('del');
    var path = require('path');
    var cwd = process.cwd();
    var util = require(path.resolve(cwd, "./config/utils/util.js"));
    var appConfig = require(path.resolve(cwd, "./config/app.config.js"));
    var socketIoUtil = require(path.resolve(cwd, "./config/utils/socketio.util.js"));
    var webpack = require('webpack');
    var WebpackDevServer = require("webpack-dev-server");
    var _ = require('lodash');
    var environments = require('gulp-environments');
    var express = require('express');
    var openUrl = require("openurl");
    var karma = require('karma');
    var KarmaServer = karma.Server;
    var karmaStopper = karma.stopper;
    var Q = require('q');
    var gulpTsLint = require('gulp-tslint');
    var tslintReporter = require('gulp-tslint-jenkins-reporter');
    var protractor = require("gulp-protractor").protractor;
    var eslint = require('gulp-eslint');
    var reporter = require('eslint-html-reporter');
    var fs = require('fs');
    var appConfigJson = JSON.parse(util.readFile("app.config.json"));

    function _getPublicUrl() {
        var port = +appConfig.server.port || 9900;
        var host = appConfig.server.host || 'localhost';
        var protocol = appConfig.server.protocol || 'http';
        return protocol + '://' + host + ':' + port + '/';
    }

    function _serverStaticBuild(directory) {
        var deferred = Q.defer();
        var expressApp = express();
        gutil.log("[Static Server]", gutil.colors.green("[Launching server for application...]"));
        expressApp.use(express.static(directory));
        var port = +appConfig.server.port;
        var host = appConfig.server.host;
        var url = appConfig.server.publicUrl();
        var expressServer = expressApp.listen(port, host, function onStart(err) {
            if (err) {
                gutil.log("[Static Server]", gutil.colors.red(err));
                deferred.reject(err);
            }
            gutil.log("[Static Server]", gutil.colors.green('==> Listening on port ' + port +
                ' Open up ' + url + ' in your browser.'));
        });
        socketIoUtil.serverListenEvent(expressServer, 'asyncComplete', function () {
            deferred.resolve();
        });
        openUrl.open(url);
        return deferred.promise;
    }

    function _runDevWebpackConfig(callback) {
        var webpackConfig = require("./webpack.config");
        var devConfig = _.cloneDeep(webpackConfig);
        devConfig.devtool = "sourcemap";
        // create a single instance of the compiler to allow caching
        var devCompiler = webpack(devConfig);
        //run webpack
        devCompiler.run(function (err, stats) {
            if (err) {
                throw new gutil.PluginError("webpack:build", err);
            }
            gutil.log("[webpack:build]", stats.toString({
                colors: true
            }));
            callback();
        });
    }

    function _runReleaseWebpackConfig(callback) {
        var webpackConfig = require("./webpack.config");
        webpack(webpackConfig, function (err, stats) {
            if (err) {
                throw new gutil.PluginError("webpack:build", err);
            }
            gutil.log("[webpack:build]", stats.toString({
                colors: true,
                chunks: false
            }));
            callback();
        });
    }

    function _webpackBuildTask(callback) {
        var production = environments.production;
        if (production()) {
            _runReleaseWebpackConfig(callback);
        } else {
            _runDevWebpackConfig(callback);
        }
    }

    function _serveBuildTask() {
        if (environments.production()) {
            return _serverStaticBuild(appConfig.releaseDir());
        } else {
            return _serverStaticBuild(appConfig.devDir());
        }
    }

    function _stopKarmaServer() {
        karmaStopper.stop({
            port: appConfig.testConfig.karma.serverPort
        }, function (exitCode) {
            if (exitCode === 0) {
                gutil.log("[Karma] : Test server stopped");
            }
            process.exit(exitCode);
        });
    }

    function _karmaJunitTestTaks(cb) {
        var server = new KarmaServer({
            configFile: __dirname + '/karma.conf.js',
            singleRun: true
        }, function (err) {
            if (err === 0) {
                cb();
            } else {
                gutil.log("[Karma] : Test Task exited with status code : " + err);
                process.exit(err);
            }
        });
        server.start();
        server.on('run_complete', function (browsers, result) {
            if (result.failed > 0) {
                gutil.log(gutil.colors.red("[Karma]") + " : Test task failed due to " +
                    gutil.colors.red(result.failed) + " failed test case/s.");
                process.exit(result.exitCode);
            }
            cb();
        });
    }

    function _runWebpackDevServerTask(cb) {
        var baseUrl = _getPublicUrl();
        var webpackConfig = require("./webpack.config");
        // modify some webpack config options
        var config = _.cloneDeep(webpackConfig);
        config.devtool = "eval";
        config.entry.app.unshift("webpack-dev-server/client?" + baseUrl, "webpack/hot/dev-server");
        // Start a webpack-dev-server
        var server = new WebpackDevServer(webpack(config), {
            stats: 'errors-only',
            quiet: true,
            noInfo: true,
            historyApiFallback: true,
        }).listen(appConfig.server.port, appConfig.server.host, function (err) {
            if (err) {
                throw new gutil.PluginError("webpack-dev-server", err);
            }
            var msg = baseUrl + '/webpack-dev-server/index.html';
            openUrl.open(baseUrl);
            gutil.log("[webpack-dev-server]", gutil.colors.green(msg));
        });
    }

    function _tsLintTask(files, type) {
        var tempType = type !== 1 && type !== 2 ? "" : "test";
        tempType = type === 2 ? "e2e" : tempType;

        var reportFileName = appConfig.tsLint.reportFileName;
        if (type > 0) {
            var length = appConfig.tsLint.reportFileName.length;
            var index = appConfig.tsLint.reportFileName.lastIndexOf(".");
            var name = appConfig.tsLint.reportFileName.substr(0, index);
            var ext = appConfig.tsLint.reportFileName.substr(-(length - index));
            reportFileName = name + '.' + tempType + ext;
        }
        return gulp.src(files).pipe(gulpTsLint({
            configuration: appConfig.tsLint.configFile,
            formatter: appConfig.tsLint.formatter
        })).pipe(gulpTsLint.report({
            summarizeFailureOutput: true,
            emitError: false,
            sort: true,
            bell: true
        })).pipe(tslintReporter({
            sort: true,
            filename: appConfig.tsLintReportDir() + '/' + reportFileName,
            severity: appConfig.tsLint.serverity
        }));
    }

    function _deleteTask(pathArray) {
        return del(pathArray);
    }

    function _seleniumWebDriverUpdate(done, cmd) {
        var webDrv = path.resolve(cwd, './node_modules/webdriver-manager/bin/webdriver-manager');
        util.runSpawn(done, 'node', [webDrv, cmd], 'inherit');
        done();
    }

    function _esLint() {
        var reportDestination = appConfig.esLintReportDir() + '/' +
            appConfig.esLint.htmlReportFileName;
        util.createDirectoryIfNotExists(appConfig.esLintReportDir());
        return gulp.src(appConfig.esLint.files)
            .pipe(eslint({
                configFile: appConfig.esLint.configFile
            }))
            .pipe(eslint.format())
            .pipe(eslint.format(reporter, function (results) {
                fs.writeFileSync(reportDestination, results);
            }))
            .pipe(eslint.failAfterError());
    }

    /** Clean Tasks **/
    gulp.task('clean:dev', function () {
        var paths = [appConfig.directory.temp,
            appConfig.directory.reports,
            appConfig.devDir()
        ];
        return _deleteTask(paths);
    });

    gulp.task('clean:release', function () {
        var paths = [appConfig.directory.temp,
            appConfig.directory.reports,
            appConfig.releaseDir()
        ];
        return _deleteTask(paths);
    });
    /** Clean Tasks End **/

    /**
     * Task to set environment to production for build
     */
    gulp.task('setenv:prod', function (cb) {
        var prod = environments.make("production");
        environments.current(prod);
        cb();
    });

    gulp.task('webpack-dev-server', _runWebpackDevServerTask);

    gulp.task('webpack:build', _webpackBuildTask);

    gulp.task('serve-static', _serveBuildTask);

    gulp.task('clean', gulp.series('clean:dev', 'clean:release'));

    // Rerun the task when a file changes
    gulp.task('watch', function () {
        gulp.watch(appConfig.directory.src);
    });

    gulp.task('serve', gulp.series('webpack:build', 'webpack-dev-server'));

    /** Test Tasks **/
    gulp.task('test:unit', _karmaJunitTestTaks);

    /** Test Tasks End **/

    /** Lint Task **/
    gulp.task('lint:es', _esLint);

    gulp.task('lint:ts', function () {
        return _tsLintTask(appConfig.tsLint.files, 0);
    });

    gulp.task('lint:ts:test', function () {
        return _tsLintTask(appConfig.tsLint.testFiles, 1);
    });

    gulp.task('lint:ts:e2e', function () {
        return _tsLintTask(appConfig.tsLint.e2eFiles, 2);
    });
    /** Lint Task End **/

    /** Selenium Webdriver tasks **/
    gulp.task('webdriver:update', function (done) {
        _seleniumWebDriverUpdate(done, 'update');
    });

    gulp.task('protractor', function (done) {
        var url = appConfig.server.publicUrl();
        return gulp.src(appConfig.e2eTestConfig.tsE2eSpecFile)
            .pipe(protractor({
                configFile: appConfig.e2eTestConfig.configFile
            }))
            .on('end', function (e) {
                gutil.log(gutil.colors.green("[Protractor] : E2E testing completed."));
                socketIoUtil.emitEvent(url, 'asyncComplete');
                done();
            })
            .on('error', function (e) {
                socketIoUtil.emitEvent(url, 'asyncComplete');
                done();
            });
    });

    gulp.task('test:e2e', gulp.series('webpack:build', 'webdriver:update',
        gulp.parallel('protractor', 'serve-static')));

    /** Selenium Webdriver tasks End **/

    /** Build Tasks **/
    var developmentBuild = gulp.series('clean:dev', 'lint:ts', 'webpack:build', 'serve-static');
    gulp.task('build:dev', developmentBuild);

    var releaseBuild = gulp.series('setenv:prod', 'clean:release', 'lint:ts', 'test:unit', 'test:e2e');
    gulp.task('build:release', releaseBuild);
    /** Build Tasks End **/

    gulp.task('default', gulp.series('clean', 'serve'));
}());