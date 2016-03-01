![](http://res.cloudinary.com/jollen/image/upload/h_110/v1455862763/devify-logo_rh63vl.png)

A new way to write IoT application server code.

# devify-server-send-sms

This project shows how to send alert SMS.

## Quickstart

```
var server = require('./websocket-broker');

// Twilio Credentials 
var accountSid = '<YOUR-SID>'; 
var authToken = '<YOUR-TOKEN>'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 

var sms = 0;

// override '.onData()' event handler
var sms = function(message) {
	var obj = JSON.parse(message.data);

	if (obj.temperature >= 50) {
		client.messages.create({ 
			to: "<TO-PHONE-NUMBER>", 
			from: "<FROM-PHONE-NUMBER>", 
			body: "Wearning! Temperature is too high: " + obj.temperature,   
		}, function(err, result) { 
			console.log(result.sid); 
		});
	}
}

server.start({
	onmessage: sms
});
