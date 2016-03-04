/**
 *
 * The MIT License (MIT)
 *
 * Devify Platform
 * 
 * Copyright (c) 2016-present, Mokoid Capital Limited. All rights reserved.
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
 * WoT.City Framework
 */
var wotcity = require('wotcity.io');

/**
 * DropBox API
 */
var fs      = require("fs");
var dbox  = require("dbox");

var root = '/components/io.devify.dropbox/';
var app_cfg = JSON.parse(fs.readFileSync(__dirname + root + "/app.json.conf"));
var access_token = JSON.parse(fs.readFileSync(__dirname + root +"/access_token.json.conf"));

var app   = dbox.app(app_cfg);
var client = app.client(access_token);

client.put(filename, data, function(status, reply) {
    console.log('DBOX Status: ' + status);

    return workflow.emit('sendEmail');
});


exports.getComponent = function() {
  var component = new wotcity.Component;

  component.name = "io.devify.dropbox";
  component.description = "This component prints the received data on the console.";

  // Register ports and event handlers
  component.inPorts.add('in', function(event, payload) {
    switch (event) {
      case 'data':
        // Data received
        console.log(JSON.stringify(payload));
        return 0;
      case 'disconnect':
        // Input port disconnects
        return 0;
    }
  });

  component.outPorts.add('out');

  // Return process (the instance of component)
  return component;
};
