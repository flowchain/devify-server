var server = require('devify-server').coapBroker;


/**
 * DropBox API
 */
var fs      = require("fs");
var dbox  = require("dbox");

var app_cfg = JSON.parse(fs.readFileSync(__dirname + "/config.app.json"));
var access_token = JSON.parse(fs.readFileSync(__dirname +"/config.access_token.json"));

var app   = dbox.app(app_cfg);
var client = app.client(access_token);

/**
 * Internal Variables
 */
var data = [];

var onmessage = function(message) {
    // Parse strings to JSON object.
    var obj = JSON.parse(message.data);

    // Put a timestamp in the message
    var now = Math.floor(Date.now() / 1000); 
    obj.timestamp = now;

    // Put to array
	data.push(obj);

    // Put to DropBox
    var filename = new Date() + '.json';

    if (data.length >= 10) {
		client.put(filename, JSON.stringify(data), function(status, reply) {
		    console.log('DBOX Status: ' + status);
		    data = [];
		});
	}
};

server.start({
    onmessage: onmessage,
});
