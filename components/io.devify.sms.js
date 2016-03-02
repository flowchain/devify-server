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

// Twilio Credentials 
var accountSid = '<YOUR-SID>'; 
var authToken = '<YOUR-TOKEN>'; 

//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
var count = 0;

exports.getComponent = function() {
  var component = new wotcity.Component;

  component.name = "io.devify.sms";
  component.description = "This component receives data on a single input port.";

  // Register ports and event handlers
  component.inPorts.add('in', function(event, payload) {
    var data = JSON.parse(payload.data);

    switch (event) {
      case 'data':
        // Data received
        if (data.temperature >= 30 && count === 0 && accountSid !== '<YOUR-SID>') {
          client.messages.create({ 
            to: "+886956590989", 
            from: "+16828881456", 
            body: "現在溫度：" + data.temperature,   
          }, function(err, result) { 
            console.log(result.sid); 
          });
          count = count + 1;
        }
        component.outPorts.out.send(payload);
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