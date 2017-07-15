var server = require('devify-server').CoapBroker;

// The email utility
var email = require('./utilities/email');

// Sendgrid credentials.
var fs = require('fs');
var credentials = JSON.parse(fs.readFileSync(__dirname + '/config.json'));

// Last time we have sent an email.
var last = 0;
        
var onmessage = function(message) {
    // Parse strings to JSON object.
    var obj = JSON.parse(message.data);

    // Put a timestamp in the message
    var now = Math.floor(Date.now() / 1000); 
    obj.timestamp = now;

    // Don't send too many emails.
    if (now - last < 60)
    	// We have sent an email in 60 seconds.
    	return;

	email({
		credentials: credentials,

	    from: 'jollen <jollen@jollen.org>',
	    to: 'jollen <jollen@jollen.org>',
	    replyTo: 'jollen <jollen@jollen.org>',
	    subject: 'ESP8266 Air Quality',
	    text: JSON.stringify(message.data),

	    success: function(message) {
	    	last = now;
	        console.log('Email sent: ' + last);
	    },
	    error: function(err) {
	        console.log('Email failed: ' + err);
	    }
	});
};

server.start({
    onmessage: onmessage,
});
