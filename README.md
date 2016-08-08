![](http://res.cloudinary.com/jollen/image/upload/h_110/v1455862763/devify-logo_rh63vl.png)
es
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
$ node coap-broker-server-events.js
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
$ node coap-broker-server-events.js
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

The sample ```coap-broker-server-events.js``` will print messages from IoT devices on the console. Please read [101-air-quality-sensor-console-print](https://github.com/DevifyPlatform/devify-server/tree/master/templates/101-air-quality-sensor-console-print) for getting started.

## Developer Quickstart

[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://deploy.azure.com/?repository=https://github.com/DevifyPlatform/devify-server)

Before starting to develop your own IoT server. You may want to have a try. By click the **Deploy to Azure** button, it takes couple minutes to have *devify-server* deployed at Microsoftt Azure web service. The following instructions show how to deploy devify-server, and have a try by using test scripts.

* Please click above button to deploy this project.

* Be sure to [Enable Web Sockets](https://azure.microsoft.com/zh-tw/blog/introduction-to-websockets-on-windows-azure-web-sites/) after deploy.azure.com has finished deploying this project.

 * Go to the [Windows Azure Management Console](https://portal.azure.com/)
 * Select **App Services**
 * Select your web site, and go to the **All settings** page
 * Scroll down and select **Application settings** in the GENERAL label
 * Scroll down and switch the button of **Web sockets** to **On**
 * Click the **Save** icon

* Use your web site URL to access Devify server. 

 * Go to the [Windows Azure Management Console](https://portal.azure.com/)
 * Select **App Services**
 * Select your web site
 * Find **URL** here, for example ```devify-server88de.azurewebsites.net```

* Use WebSocket broker server.

 * Open *test/test.websocket.send.js* file
 * Modify this line: ```client.connect('ws://localhost:8000/object/5550937980d51931b3000009/send', '');``` to meet your web site URL. For the example above ```client.connect('ws://devify-server88de.azurewebsites.net/object/5550937980d51931b3000009/send', '');```
 * The Devify framework will generate a URI for sending the received messages, use ```ws://devify-server88de.azurewebsites.net/object/5550937980d51931b3000009/viewer``` to receive real-time messages from the server. Please open *test/test.websocket.viewer.js*, and modify the URL string.
 * The string ```5550937980d51931b3000009``` is the device ID. You can modify it and give a favor string.

## Developer Get Started

There are several IoT server templates with different use scenraio. Please go to the ebook [ESP8266 over the Web: Getting started with IoT System Architecture](templates/).

## Better IoT Programming

For better IoT programming with flow-based paradigm, please read [Flowchain](https://github.com/flowchain/flowchain).

## Contribution

Devify is still under development. This project needs your help and contribution.

## License

devify-server is released under the [MIT License](http://www.opensource.org/licenses/MIT). See [LICENSE.md](LICENSE.md).
