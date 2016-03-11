![](http://res.cloudinary.com/jollen/image/upload/h_110/v1455862763/devify-logo_rh63vl.png)

ESP8266 over the Web: Getting started with IoT System Architecture

## Project Goal

The use scenario of this project.

* Connect an Air Quality sensor with ESP8266
* Programming ESP8266 in Lua programming language
* Setup a CoAP server at your host PC
* Print the data on the screen when CoAP server receives the data from ESP8266

## Quickstart

![The use cases that we're going to achieve in the next two lessons](https://cloud.githubusercontent.com/assets/1126021/13699804/b9498212-e7b7-11e5-99e3-734ac6bf91da.png)

### Device Side

* Connect your ESP8266 to WiFi AP
* Run [coap-air-quality.lua](esp8266/coap-air-quality.lua) in this project

### Server Side

* Run *server.js* in this project at your host PC

```
$ npm install
$ export HOST=<server-ip-address>
$ export PORT=<listening-port>
$ npm start
```

## Getting Started

For IoT developers, *Devify* is a software framework which makes it easy to build IoT server using CoAP and WebSocket. It minimizes the time to write a **Hello, World** IoT server. The following explains how ```esp8266-coap-server.js``` works.

First, it requires ```devify-server``` library and get a CoAP server instance.

```
var server = require('devify-server').coapBroker;
```
Then, it invokes ```start()``` method to start the server.

```
server.start();
```

## Use *onmessage* callback

The ```server.js``` demo doesn't print any thing on the screen. To print data received from NodeMCU at the terminal console, you need to implement the ```onmessage``` callback function. 

To print the data sent from NodeMCU, give a ```onmessage``` function callback to ```start()```.

```
var onmessage = function(message) {
	// Parse strings to JSON object.
	var obj = JSON.parse(message.data);
	// Print strings.
	console.log('<DATA> ' + message.data);
};

server.start({
	onmessage: onmessage,
});
```
Once there is an incoming message from NodeMCU, the ```onmessage``` function will be called with one parameter of *Object* type. The data from ESP8266 is stored at the ```data``` property. The data from ESP8266 is in JSON string format. To read this data, it should be parsed into *Object* type.

```
var obj = JSON.parse(message.data);
```

This demo is simple. However, it's not the best practice to get data from NodeMCU. The best practice is explained at [Understanding Resource-Oriented](README.md#understanding-resource-oriented).

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

Please modify the ```uri``` variable to the real CoAP server URI. Basically, the IP address and the listening port need to be fixed.

The ```buf``` variable stores the JSON string (aka JSON document) which includes the air quality data. Finally, the JSON string will be sent to your server over the web via COAP.

## Understanding Resource-Oriented

The best practice to achieve the purpose of getting data from NodeMCU is to use ```coap://192.168.0.100:8000/object/12345678/viewer```.

Devify framework will automatically generate this URI for your NodeMCU device. The URI is the resource name of *NodeMCU data*.

Write Node.js code to read the resource of this URI ```coap://192.168.0.100:8000/object/12345678/viewer``` is easy.

```
var coap = require('coap');

var clientWriable = coap.request('coap://192.168.0.100:8000/object/12345678/viewer');

clientWriable.on('response', function(res) {
    res.pipe(process.stdout)
});

clientWriable.end();
```

Please save the code under your project folder (*esp_air_iot/* at this tutorial) as the file name *coap-view-data.js*. Then, execute *coap-view-data.js* by running ```node coap-view-data.js```.

## Understanding the URI Design

Devify has a simplified design of WoT framework.

* Take advantage of broker pattern architecture
* Thing modeling (thing description in JSON)
* URI based communications (supoprt CoAP/WebSocket)

The URI style is as the following.

```
coap://127.0.0.1:8000/object/<ObjectID>/send
```

* **object** is the resource name
* **&lt;ObjectID&gt;** is the unique ID of the resource. Please assign a string for your device.
* **send** or **viewer** is the property of this resource. Use **send** to *send data to CoAP server*, and **viewer** to *view data from CoAP server*

This URI style is defined in the underlying of Devify framework.

## Flow-Based Programming

**NOTE:** This is under development, and which is planned to be first released on June, 2016. Please refer to [devify-graph](https://github.com/DevifyPlatform/devify-graph) project later for flow-based IoT programming.

This chapter explains two different programming models. One is the monolithic application (aka single process) with conventional *if..else...* programming model. The other is the concept of resource-oriented using URI model.

However, both of these two programming models are not the vision of Devify project. The vision **A new way to write IoT application server code** is implemented by so-called flow-based programming (FBP).

## Next

* [101-air-quality-sensor-text-messaging-twilio](../101-air-quality-sensor-text-messaging-twilio)
