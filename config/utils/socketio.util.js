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
    var ioClient = require('socket.io-client');
    var ioServer = require('socket.io');

    function _serverListenEvent(server, event, callback) {
        var socketIoServer = ioServer(server);
        socketIoServer.on('connection', function(socketServer) {
            socketServer.on(event, function() {
                callback.apply(this, arguments);
            });
        });
    }

    function _clientEmitEvent(url, event, callback) {
        if (!callback) {
            callback = function() {
                setTimeout(function() {
                    process.exit(0);
                }, 1000);
            };
        }

        var socketClient = ioClient.connect(url);
        socketClient.on('connect', function() {
            socketClient.emit(event);
            callback.apply(this, arguments);
        });
    }

    module.exports = {
        emitEvent: _clientEmitEvent,
        serverListenEvent: _serverListenEvent
    };
}());