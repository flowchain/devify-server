![](http://res.cloudinary.com/jollen/image/upload/h_110/v1455862763/devify-logo_rh63vl.png)

A new way to write IoT application server code.

# devify-server

[![Join the chat at https://gitter.im/DevifyPlatform/devify-server](https://badges.gitter.im/DevifyPlatform/devify-server.svg)](https://gitter.im/DevifyPlatform/devify-server?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/DevifyPlatform/devify-server.svg?branch=master)](https://travis-ci.org/DevifyPlatform/devify-server)
[![GitHub license](https://img.shields.io/github/license/DevifyPlatform/devify-server.svg)](https://github.com/DevifyPlatform/devify-server)

devify-server, or [*Devify*](https://github.com/DevifyPlatform/devify-server) in a short, is a simple IoT server boilerplate. 

*Devify* is extremely light weight, and is very easy to use. It aims to help developers to create IoT application servers, faster.

## Introduction

Devify is an open source project to develop the boilerplates for getting started with IoT cloud servers. It gets you up to speed using IoT and web technologies.

Devify open source project, or **Devify**, is a software framework. Its goal is to create a new way to write IoT server code.

## Quickstart

A cli tool [devify-cli](https://github.com/DevifyPlatform/devify-cli) is available for getting started with *devify*.

```
$ npm install -g devify-cli
$ devify new <new_project_dir>
$ cd <new_project_dir> && npm install
$ node esp8266-coap-server.js 
```

## Tutorial

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

-- Setup a timer to send ADC data
tmr.alarm(0, 1000, 1, function() 
    buf = 
          "{" ..
          "\"quality\":" ..
          adc.read(0) ..
          "}"
    
    cc:post(uri, buf)
    print(buf)
end)
```

## Developer

For IoT developers, *Devify* is a software framework which makes it easy to build IoT server using CoAP and WebSocket. It minimizes the time to write a **Hello, World** IoT server. The following explains how ```esp8266-coap-server.js``` works.

First, it requires ```./libs/coap-broker``` to get a CoAP server instance.

```
var server = require('./libs/coap-broker');
```
Then, it invokes ```start()``` method to start the server.

```
server.start();
```

The ```esp8266-coap-server.js``` demo doesn't print any thing on the screen. To print data received from NodeMCU at the terminal console, you need to modify ```esp8266-coap-server.js```. 

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

This demo is simple. However, it's not the best practice to get data from NodeMCU.

### Resource-Oriented

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

### Design

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

The above sections explain two different programming models. One is the monolithic application (aka single process) with conventional *if..else...* programming model. The other is the concept of resource-oriented using URI model.

However, both of these two programming models are not the vision of Devify project. The vision **A new way to write IoT application server code** is implemented by so-called flow-based programming (FBP).

## More Examples

A simple project of single process application (the monolithic application) and *IF-ELSE* programming model.

* [How to Send SMS: The single process model](examples/How-to-Send-SMS.md)

## Deployment

[](https://cloud.githubusercontent.com/assets/1126021/13560959/4e687ede-e461-11e5-83de-448bdf116e99.png)

* Please click above button for one click to azure. Be sure to [Enable Web Sockets](https://azure.microsoft.com/zh-tw/blog/introduction-to-websockets-on-windows-azure-web-sites/) after deploying your Devify web site

 * Go to the [Windows Azure Management Console](https://portal.azure.com/)
 * Select **App Services**
 * Select your web site, and go to the **All settings* page
 * Scroll down and select **Application settings** in the GENERAL label
 * Scroll down and switch **Web sockets ** to **On**
 * Click the **Save** icon

* Use your web site URL to access Devify server. 

 * Go to the [Windows Azure Management Console](https://portal.azure.com/)
 * Select **App Services**
 * Select your web site
 * Find **URL** here, for example ```devify-server88de.azurewebsites.net```

## Contribution

Devify is still under development. This project needs your help and contribution.

## License

devify-server is released under the [MIT License](http://www.opensource.org/licenses/MIT).
