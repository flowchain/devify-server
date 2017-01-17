![](http://res.cloudinary.com/jollen/image/upload/h_110/v1455862763/devify-logo_rh63vl.png)

A fast way to write IoT application server code running on devices.

# devify-server

[![Join the chat at https://gitter.im/DevifyPlatform/devify-server](https://badges.gitter.im/DevifyPlatform/devify-server.svg)](https://gitter.im/DevifyPlatform/devify-server?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/DevifyPlatform/devify-server.svg?branch=master)](https://travis-ci.org/DevifyPlatform/devify-server)
[![GitHub license](https://img.shields.io/github/license/DevifyPlatform/devify-server.svg)](https://github.com/DevifyPlatform/devify-server)

**devify-server**, or [*Devify*](https://github.com/DevifyPlatform/devify-server), is a set of IoT device server boilerplate. 

*Devify* is written in 100% JavaScript and designed to be light-weight. It aims to help developers to create IoT application servers, faster.

## What's a Devify ?

Devify is a sub-project of [WoT.City](https://wotcity.com/WoTCity-WhitePaper.pdf) software framework that it proposes a new design software architecture for the development of interoperable Internet of Things (IoT) application server on IoT devices. To begin creating and developing customized such IoT application servers, the Devify provides several boilerplates (project templates) that can be used instantly.

## Introduction

Devify is an open source project to develop a set of boilerplates for getting started with interoperable IoT device servers. It aims to help you developing device server running on IoT devices and using emerging web technologies. 

## Technology

Devify itself is a broker server that implements REST-style RPC operations. Moreover, the code size of the Devify is extremely light weight; thus, it can run on laptops, mobile devices, and even resource-constrained devices.

## Quickstart

A cli tool [devify-cli](https://github.com/DevifyPlatform/devify-cli) is available for getting started with *devify*.

```
$ npm install -g devify-cli
$ devify new <new_project_dir>
$ cd <new_project_dir> && npm install
$ node coap-broker-server-events.js
```

## Tutorial

This section introduces the steps to write a CoAP device server to collaborate with an ESP8266 (NodeMCU) IoT device that the device server will receive data from the ESP8266 device.

The following instructions show how to connect NodeMCU to your localhost (PC/Notebook) and send ADC data to localhost  over CoAP.

### Step 1. Get *devify-cli*

```
$ npm install -g devify-cli 
```

*devify-cli* a cli app aimed to get you speed up.

### Step 2. Create a new project

```
$ devify esp_air_iot
```
Create a new *Devify* project by *devify-cli*. *Devify-cli* will automatically create a new folder and download the project template at this folder. The folder name is *esp_air_iot* at this example.

Please make sure that *git* was installed at your host.

### Step 3. Install dependencies

```
$ cd esp_air_iot && npm install
```

*Devify* project template is an isomorphic JavaScript app using Node.js. Please run ```npm install``` to get Node.js modules installed.

### Step 4. Start the server

You need to export the host IP through ```HOST``` environment variable before starting the CoAP server. 

```
$ export HOST=192.168.0.100
$ node coap-broker-server-events.js
WoT/CoAP server is listening at coap://192.168.0.100:8000
```
The message shows that the server is listening at ```coap://192.168.0.100:8000```.

### Step 5. Programing IoT device

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

### Step 6. Deploy

A Devify application server might be installed and run on a cloud-based server, an application processor-based high-performance device or a microcontroller device. The following section introduces how to install a Devify application server on Azure, the cloud-based server.

## Deploy: Cloud-Based Server

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

## Biolerplates


Currently, the Devify provices 5 templates to introduce the usage of *devify-server* open source project.

* Chapter 1 - [101-air-quality-sensor-console-print](templates/101-air-quality-sensor-console-print): Connected an air quality sensor to NodeMCU and send data to an IoT server locally (in local area network).
* Chapter 2 -[101-air-quality-sensor-text-messaging-twilio](templates/101-air-quality-sensor-text-messaging-twilio): Send an alert message by SMS when the air quality is not good
* Chapter 3 -[102-air-quality-sensor-dropbox](templates/102-air-quality-sensor-dropbox): Save hardware data to Dropbox files
* Chapter 4 -[102-air-quality-sensor-email](templates/102-air-quality-sensor-email): Send an alert message by email when the air quality is not good
* Chapter 5 -[201-web-of-things-dashboard](templates/201-web-of-things-dashboard): An advanced chapter. Build a real-time sensor information dashboard. Get understood of WebSockets, CoAP and Web of Things (WoT).

## License

devify-server is released under the [MIT License](http://www.opensource.org/licenses/MIT). See [LICENSE.md](LICENSE.md).
