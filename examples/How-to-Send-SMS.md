![](http://res.cloudinary.com/jollen/image/upload/h_110/v1455862763/devify-logo_rh63vl.png)

A new way to write IoT application server code.

# How-to-Send-SMS

This project shows how to extend devify-server biolerplate to send an alert SMS.

## Prerequisites

1. This project uses twilio APIs for text messaging. Please signup and get your own credentials at [twilio](https://www.twilio.com).

2. This project uses [twilio](https://www.npmjs.com/package/twilio) npm module to invoke twilio REST APIs. Please run `$ npm install twilio` to install the latest version.

## Quickstart

Twilio credentials consists of Sid and Token. Please replace ```<YOUR-SID>``` with your sid gave by twilio, and replace ```<YOUR-TOKEN>``` with your token.

```
var server = require('./coap-broker');

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
```

## NodeMCU

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
          "\"temperature\":" ..
          adc.read(0) ..
          "}"
    
    cc:post(uri, buf)
    print(buf)
end)
```
