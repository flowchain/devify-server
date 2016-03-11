![](http://res.cloudinary.com/jollen/image/upload/h_110/v1455862763/devify-logo_rh63vl.png)

ESP8266 over the Web: Getting started with IoT System Architecture

# Project Goal

The use scenario of this project.

* Send an alert message by SMS when the air quality is not good
* Understanding Devify

This project shows how to extend devify-server biolerplate to send an alert SMS. Please read [Devify](https://github.com/DevifyPlatform/devify-server/blob/master/README.md) to understand Devify in a bit before continue to this project.

## Prerequisites

0. Understanding [101-air-quality-sensor-console-print](../101-air-quality-sensor-console-print)

1. This project uses twilio APIs for text messaging. Please signup and get your own credentials at [twilio](https://www.twilio.com).

2. This project uses [twilio](https://www.npmjs.com/package/twilio) npm module to invoke twilio REST APIs. Please run `$ npm install twilio` to install the latest version.

3. Please copy ```config.json.example``` to ```config.json```.

## Getting Started

Twilio credentials consists of Sid and Token. Please open ```config.json``` and put on your credentials.

```
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


## Next

* [102-air-quality-sensor-email](../102-air-quality-sensor-email)