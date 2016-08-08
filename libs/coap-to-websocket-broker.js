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
  , CoapBroker = WoT.CoapBroker
  , Router = WoT.CoapRouter
  , RequestHandlers = WoT.CoapRequestHandlers
  , Runtime = WoT.Runtime;

/**
 * Util Modules
 */
var merge = require('utils-merge');

/**
 * CoAP URL Router
 */
var coapHandlers = {
   "/object/([A-Za-z0-9-]+)/send": RequestHandlers.proxyingWebSocket,
   "/object/([A-Za-z0-9-]+)/viewer": RequestHandlers.viewer,
   "/object/([A-Za-z0-9-]+)/status": RequestHandlers.status
};

/*
 * Prototype and Class
 */
var Server = function () {

};

/**
 * The server event handlers
 */
Server.prototype.onNewThing = function(thing) {
  // at this server, the thing description is included via a local file
  // or it can be accessed by invoking HTTP api from remote device
  var def = require('./thing');
  var thing = merge(def, thing);

  // register a new thing to WoT framework
  this.registerThing(thing);

  if (typeof(this._options.onnewthing) === 'function') {
    this._options.onnewthing(thing);
  }
};

Server.prototype.onData = function(payload) {
  if (typeof(this._options.onmessage) === 'function') {
    this._options.onmessage(payload);
  }

  // Send hardware data to FBP network.
  var data = {
    upproc: 'devify-device',
    upport: 'out',
    payload: payload
  };
  this._network.send(data);
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
 * Start a CoAP server.
 *
 * @return {None}
 * @api public
 */
Server.prototype.start = function(options) {
  var port = process.env.PORT || 8000;
  var host = process.env.HOST || 'localhost';
  var endpoint = process.env.ENDPOINT || 'wot.city';
  var options = options || {};
  
  for (var prop in options) {
    if (options.hasOwnProperty(prop) 
        && typeof(this._options[prop]) === 'undefined')
      this._options[prop] = options[prop];
  }

  // Load components
  this._network.load(this._options.components || {});

  // Start FBP Network Runtime
  this._network.runtime(this._options.graph || {});

  var server = new CoapBroker({
    port: port,
    host: host,
    endpoint: endpoint
  });
  var router = new Router();

  // Thing events from WoT framework
  server.on('newThing', this.onNewThing.bind(this));
  server.on('data', this.onData.bind(this));

  server.start(router.route, coapHandlers);
};

/**
 * Create the server instance.
 */
var coapBrokerImpl = createServer({
  events: {
  }
});

/**
 * Combined server with framework instance.
 */
var coapServer = new Framework({
  server: coapBrokerImpl
});

/**
 * Export the server.
 */
module.exports = coapServer;
