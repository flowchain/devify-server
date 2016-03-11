![](http://res.cloudinary.com/jollen/image/upload/h_110/v1455862763/devify-logo_rh63vl.png)

ESP8266 over the Web: Getting started with IoT System Architecture

# Project Goal

The use scenario of this project.

* Send an alert message by email when the air quality is not good
* Lean how to invoke SendGrid APIs

This project shows how to extend devify-server biolerplate to send an alert SMS. Please read [Devify](https://github.com/DevifyPlatform/devify-server/blob/master/README.md) to understand Devify in a bit before continue to this project.

## Prerequisites

0. Understanding [101-air-quality-sensor-console-print](../101-air-quality-sensor-console-print)

1. This project uses SendGrid APIs for sending emails. Please signup and get your own credentials at [SendGrid](https://sendgrid.com/).

2. Please copy ```config.json.example``` to ```config.json```.

## Getting Started

Please open ```config.json``` and put on your username and password of SendGrid.

```
var server = require('devify-server').coapBroker;

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

```

## NodeMCU

The full source list is as the following.

```
-- Configure the ESP as a station (client)
wifi.setmode(wifi.STATION)  
wifi.sta.config("<SSID>", "<PASSWORD>")  
wifi.sta.autoconnect(1)

-- Create a CoAP client
cc = coap.Client()

-- Make a POST request
uri="coap://192.168.0.100:8000/object/12345678/send"

-- Setup a timer to send ADC data
tmr.alarm(0, 8000, 1, function() 
    buf = 
          "{" ..
          "\"quality\":" ..
          adc.read(0) ..
          "}"
    
    cc:post(uri, buf)
    print(buf)
end)
```

The work of modifying the code is just the same with the chapter [101-air-quality-sensor-console-print](../101-air-quality-sensor-console-print).

Please read [Quickstart](101-air-quality-sensor-console-print#quickstart) to run this project.

## Next

* To be continued.