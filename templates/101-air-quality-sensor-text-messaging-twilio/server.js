var server = require('devify-server').coapBroker;

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