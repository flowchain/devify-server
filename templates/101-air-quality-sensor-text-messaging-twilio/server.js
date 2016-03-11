var server = require('devify-server').coapBroker;

// Twilio Credentials 
// Sendgrid credentials.
var fs = require('fs');
var app = JSON.parse(fs.readFileSync(__dirname + '/config.json'));
 
//require the Twilio module and create a REST client 
var client = require('twilio')(app.accountSid, app.authToken); 

var sms = 0;

// override '.onData()' event handler
var sms = function(message) {
	var obj = JSON.parse(message.data);

	if (obj.quality >= 350) {
		client.messages.create({ 
			to: "<TO-PHONE-NUMBER>", 
			from: "<FROM-PHONE-NUMBER>", 
			body: "The air is too bad: " + obj.quality,   
		}, function(err, result) { 
			console.log(result.sid); 
		});
	}
}

server.start({
	onmessage: sms
});