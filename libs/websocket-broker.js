/**
 *
 * The MIT License (MIT)
 *
 * Devify Platform
 *
 * Copyright (c) 2016 Devify, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

'use strict';

/**
 * Main WoT Framework
 */
var WoT = require('wotcity.io');

/**
 * WoT Modules
 */
var Framework = WoT.Framework
  , WebsocketBroker = WoT.WebsocketBroker
  , WebsocketRouter = WoT.WebsocketRouter
  , RequestHandlers = WoT.WebsocketRequestHandlers
  , Runtime = WoT.Runtime;

/**
 * Util Modules
 */
var merge = require('utils-merge');

/**
 * Websocket URL Router
 */
var wsHandlers = {
   "/object/([A-Za-z0-9-]+)/send": RequestHandlers.send,
   "/object/([A-Za-z0-9-]+)/viewer": RequestHandlers.viewer,
   "/object/([A-Za-z0-9-]+)/status": RequestHandlers.status
};

/*
 * Prototype and Class
 */
var Server = function () {
  this.server = null;
  this.callbacks = {
    ondata: function() { return 0; },
    onnewthing: function() { return 0; },
    onstart: function() { return 0; }
  };    
};

/**
 * Event callback factory
 */
Server.prototype.onNewThing = function(thing) {
  // at this server, the thing description is included via a local file
  // or it can be accessed by invoking HTTP api from remote device
  var def = require('./thing');
  var thing = merge(def, thing);

  // register a new thing to WoT framework
  this.registerThing(thing);

  this.callbacks['onnewthing'](thing);
};

/**
 * Event callback factory
 */
Server.prototype.onData = function(payload) {
  this.callbacks['ondata'](payload);

  // Send hardware data to FBP network.
  var data = {
    upproc: 'devify-device',
    upport: 'out',
    payload: payload
  };
  this._network.send(data);
};

/**
 * Event callback factory
 */
Server.prototype.onStart = function(payload) {
  this.callbacks['onstart'](payload);
};

/**
 * Create an WoT server.
 *
 * @return {Object}
 * @api public
 */
function createServer(options) {
  var instance = new Server();

  // Create FBP Runtime
  var network = new Runtime();
  instance._network = network;

  return merge(instance, options);
}

/**
 * Start a Websocket server.
 *
 * @return {None}
 * @api public
 */
Server.prototype.start = function(options) {
  var port = process.env.PORT || 8000;
  var host = process.env.HOST || 'localhost';
  var options = options || {};

  if (options && options.ondata && typeof options.ondata === 'function') 
    this.callbacks['ondata'] = options.ondata;

  if (options && options.onnewthing && typeof options.onnewthing === 'function')   
    this.callbacks['onnewthing'] = options.onnewthing;

  if (options && options.onstart && typeof options.onstart === 'function')   
    this.callbacks['onstart'] = options.onstart;

  // Load components
  this._network.load(this._options.components || {});

  // Start FBP Network Runtime
  this._network.runtime(this._options.graph || {});

  var server = new WebsocketBroker({
    port: port,
    host: host
  });
  var router = new WebsocketRouter();

  // Events callback factory
  server.on('newThing', this.onNewThing.bind(this));
  server.on('data', this.onData.bind(this));
  server.on('start', this.onStart.bind(this));

  server.start(router.route, wsHandlers);

  this.server = server;
};

Server.prototype.shutdown = function(cb) {
  if (this.server)
    this.server.shutdown(cb);
}

/**
 * Create the server instance.
 */
var wsBrokerImpl = createServer({});

/**
 * Combined server with framework instance.
 */
var wsServer = new Framework({
	server: wsBrokerImpl
});

/**
 * Export the server.
 */
module.exports = wsServer;
