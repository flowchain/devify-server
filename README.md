![](http://res.cloudinary.com/jollen/image/upload/h_110/v1455862763/devify-logo_rh63vl.png)

# devify-server

[![Build Status](https://travis-ci.org/DevifyPlatform/devify-server.svg?branch=master)](https://travis-ci.org/DevifyPlatform/devify-server)

devify-server, or [*Devify*](https://github.com/DevifyPlatform/devify-server) in a short, is a simple IoT server boilerplate. 

*Devify* is extremely light weight, and is very easy to use. It aims to help developers to create IoT application servers, faster.

## Introduction

Devify is an open source project to develop the boilerplates for getting started with IoT cloud servers. It gets you up to speed using IoT and web technologies.

Devify open source project, or **Devify** in short, is a software framework. Devify is trying to create a new way to write IoT server code.

## Quickstart

A cli tool [devify-cli](https://github.com/DevifyPlatform/devify-cli) is available for getting started with *devify*.

```
$ npm install -g devify-cli
$ devify <your_new_project_dir>
$ cd <your_new_project_dir>
$ node esp8266-coap-server.js 
```

## Toturial

This section introduces a new way to write a CoAP server for getting data from an NodeMCU (ESP8266) device.

The following instructions show how to connect NodeMCU to your localhost (PC/Notebook) and send ADC data to localhost  over CoAP.

### 1. Get *devify-cli*

```
$ npm install -g devify-cli 
```

*devify-cli* a cli app aimed to get you speed up.

### 2. Create a new project

```
$ devify esp_air_iot
```
Create a new *Devify* project by *devify-cli*. *Devify-cli* will automatically create a new folder and download the project template at this folder. The folder name is *esp_air_iot* at this example.

Please make sure that *git* was installed at your host.

### 3. Install dependencies

```
$ cd esp_air_iot && npm install
```

*Devify* project template is an isomorphic JavaScript app using Node.js. Please run ```npm install``` to get Node.js modules installed.

### 4. Start the server

You need to export the host IP through ```HOST``` environment variable before starting the CoAP server. 

```
$ export HOST=192.168.0.100
$ node esp8266-coap-server.js 
WoT/CoAP server is listening at coap://192.168.0.100:8000
```
The message shows that the server is listening at ```coap://192.168.0.100:8000```.

### 5. Programing IoT device

The simplest way to send sensor data to IoT server via CoAP is using NodeMCU and Lua programming language.

```
-- Configure the ESP as a station (client)
wifi.setmode(wifi.STATION)  
wifi.sta.config("<SSID>", "<PASSWORD>")  
wifi.sta.autoconnect(1)

-- Create a CoAP client
cc = coap.Client()

-- Make a POST request
uri="coap://192.168.0.100:8000/object/12345678/send"

tmr.alarm(0, 1000, 1, function() 
    cc:post(uri, "{\"temp\":20}\r\n")
end)
```

## Developer

For IoT developers, *Devify* is a tool which makes it easy to build IoT server using CoAP and WebSocket. It minimizes the time to write a **Hello, World** IoT server. The following explains how ```esp8266-coap-server.js``` works.

First, it requires ```./libs/coap-broker``` to get a CoAP server instance.

```
var server = require('./libs/coap-broker');
```
Then, it invokes ```start()``` method to start the server.

```
server.start();
```

The ```esp8266-coap-server.js``` demo doesn't print any thing on the screen. To print data received from NodeMCU at terminal console, you need to extend ```esp8266-coap-server.js```. Devify 101 section shows how to achieve this purpose. 

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
Once there is an incoming message from NodeMCU, the ```onmessage``` function will be called with one parameter of *Object* type. The  data is stored at ```data``` property of the object.

Please add the above code to your ```esp8266-coap-server.js``` file, and get it restarted.

Devify has a simplified design of WoT framework.

* Take advantage of broker pattern architecture
* Thing modeling (thing description in JSON)
* URI based communications (supoprt CoAP/WebSocket)

Device is still under development. This project needs your help and contribution.

## License

devify-server is released under the [MIT License](http://www.opensource.org/licenses/MIT).
