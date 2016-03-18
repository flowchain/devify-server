![](http://res.cloudinary.com/jollen/image/upload/h_110/v1455862763/devify-logo_rh63vl.png)

ESP8266 over the Web: Getting started with IoT System Architecture

## Project Goal

The Web of Things (WoT) provides an Application Layer that simplifies the creation of Internet of Things applications[1]. WoT reuses existing web technologies, such REST, HTTP, Websockets, CoAP and etc. [1].

This project aims to architect the Web of Things for wireless sensor networks.

## Abstraction

The wireless sensor network is built from "nodes"[2]. A node in a sensor network is capable of gathering information and communicating with other nodes.

![](https://upload.wikimedia.org/wikipedia/commons/2/21/WSN.svg)

Figure-1: Wireless Sensor Network (Source: https://en.wikipedia.org/wiki/Wireless_sensor_network. License: Public Domain)

One of the simple topologies of the wireless network network is Star Network[3].

![](https://upload.wikimedia.org/wikipedia/commons/8/84/Star_Topology.png)

Figure-2: Star Network (Source: https://en.wikipedia.org/wiki/Star_network. License: CC BY-SA 3.0)

In a star network, every node is connected to Gateway Sensor Node. A node in a star network will gather sensory information and send it the Gateway Sensor Node. We will use star network to architect the Web of Things for this project.

## Goal and Architecture


In the figure:

* We will call Gateway Sensor Node as "Proxy"
* We will take advantge of ESP8266 as "Temperature Node"
* Temperature Node will gather temperature information and send it to Proxy over "CoAP"
* We will connect Proxy to an IoT cloud server, the IoT cloud server is called "Endpoint"
* We will deploy "Endpoint" at Microsoft Azure through App Service
* We will buil a web frontend "Dashboard" and connect "Dashboard" to "Endpoint" for viewing temperature information

## Setup "Endpoint"

The following steps show that how to deploy this project to Azure web service.

### Step 1: Install azure-cli

```
$ npm install azure-cli -g
```

### Step 2: Create Azure Site

You must login to Azure in advance:

```
azure login
```

Then use the command line to create an Aure site:

```
azure site create
```

Input your site information at the prompt model. This is an example:

```
$ azure site create --git
info:    Executing command site create
help:    Need a site name
Name: devify-temperature 
+ Getting sites                                                                
+ Getting locations                                                            
help:    Choose a location
  1) East Asia
  2) North Europe
  3) West Europe
  4) Southeast Asia
  5) West US
  6) East US
  7) Japan West
  8) Japan East
  9) South Central US
  10) East US 2
  11) North Central US
  12) Central US
  13) Brazil South
  : 7
info:    Creating a new web site at devify-temperature.azurewebsites.net
/info:    Created website at devify-temperature.azurewebsites.net              
+
info:    site create command OK
```
### Step 3: Get Endpoint

After finishing creating site, remember the DNS endpoint name of your site. Please looking for the ```Created website at``` message line to get your endpoint name.

the endpoint name is ```devify-temperature.azurewebsites.net``` in this example.

### Step 4: Create Site Credentials

Run the command line to create credentials (the username and password):

```
azure site deployment user set
```

This is an example: 

```
$ azure site deployment user set
info:    Executing command site deployment user set
Git username: jollen
Git password: *********
Confirm password: *********
+ Setting user credentials                                                     
info:    site deployment user set command OK
```

### Step 5: Deploy Site

Use ```git``` to commit and push your project files to web site:

```
$ git add --all
$ git commit -m 'first commit'
$ git push azure master
```

The example output:

```
Username for 'https://devify-temperature.scm.azurewebsites.net': jollen
Password for 'https://jollen@devify-temperature.scm.azurewebsites.net': 
Counting objects: 7, done.
Delta compression using up to 2 threads.
Compressing objects: 100% (6/6), done.
Writing objects: 100% (7/7), 3.93 KiB | 0 bytes/s, done.
Total 7 (delta 0), reused 0 (delta 0)
remote: Updating branch 'master'.
remote: Updating submodules.
remote: Preparing deployment for commit id '50707cad8d'.
remote: Generating deployment script.
remote: Generating deployment script for node.js Web Site
remote: Generated deployment script files
remote: Running deployment command...
remote: Handling node.js deployment.
remote: KuduSync.NET from: 'D:\home\site\repository' to: 'D:\home\site\wwwroot'
remote: Deleting file: 'hostingstart.html'
remote: Copying file: 'package.json'
remote: Copying file: 'README.md'
remote: Copying file: 'server.js'
remote: Copying file: 'esp8266\coap-air-quality.lua'
remote: Using start-up script server.js from package.json.
remote: Generated web.config.
remote: The package.json file does not specify node.js engine version constraints.
remote: The node.js application will run with the default node.js version 4.2.3.
remote: Selected npm version 3.5.1
remote: .................................
.
.
.
```

### Step 5: Enable Websockets

To enable web sockets:

```
$ azure site set -w
```

This is an example:

```
$ azure site set -w
info:    Executing command site set
Web site name: devify-temperature
Web site slot [enter for none]: 
\ Updating site config information                     
```

## Setup "Proxy"

The simplest way to run "Proxy" is to use the laptop. 

```
$ cd <your-path>/devify-server/templates/201-web-of-things
$ npm install
$ export ENDPOINT=devify-temperature.azurewebsites.net
$ export HOST=192.168.1.100
$ export PORT=8000
$ node server.proxy.js
```

There are three variables for configuration options.

* **ENDPOINT** is the endpoint name of "Endpoint" server
* **HOST** is the IP address of the laptop
* **PORT** is the listening port

## Setup "Node"

Open [coap-temperature.lua](esp8266/coap-temperature.lua) file. Fill in with the WiFi hotspot name and password.

```
wifi.sta.config("<SSID>", "<PASSWORD>")  
```

Then, please find this line, fix the IP address and listening port.

```
uri="coap://192.168.1.100:8000/object/5550937980d51931b3000009/send"
```

The "Proxy" and "Node" should be connected to the same WiFi station.

## Setup "Dashboard"



[1]: https://en.wikipedia.org/wiki/Web_of_Things
[2]: https://en.wikipedia.org/wiki/Wireless_sensor_network
[3]: https://en.wikipedia.org/wiki/Star_network
