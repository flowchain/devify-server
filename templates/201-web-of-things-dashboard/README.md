![](http://res.cloudinary.com/jollen/image/upload/h_110/v1455862763/devify-logo_rh63vl.png)

The simplest tutorial to build the Web of Things architecture - with ESP8266 and Microsoft Azure

## Project Goal

Real-time Sensor Dashboard: Get Started with WebSockets, CoAP and Web of Things

The Web of Things (WoT) provides an Application Layer that simplifies the creation of Internet of Things applications[1]. WoT reuses existing web technologies, such as REST, HTTP, Websockets, CoAP and etc. [1].

This project aims to architect the Web of Things for wireless sensor networks.

![](https://cloud.githubusercontent.com/assets/1126021/13872864/54542382-ed28-11e5-8d11-5c4d1c62f239.gif)

## Abstraction

The wireless sensor network is built from "nodes"[2]. A node in a sensor network is capable of gathering information and communicating with other nodes.

![](https://upload.wikimedia.org/wikipedia/commons/2/21/WSN.svg)

Figure-1: Wireless Sensor Network (Source: https://en.wikipedia.org/wiki/Wireless_sensor_network. License: Public Domain)

One of the simple topologies of the wireless network network is Star Network[3].

![](https://upload.wikimedia.org/wikipedia/commons/8/84/Star_Topology.png)

Figure-2: Star Network (Source: https://en.wikipedia.org/wiki/Star_network. License: CC BY-SA 3.0)

In a star network, every node is connected to Gateway Sensor Node. A node in a star network will gather sensory information and send it to Gateway Sensor Node. We will use star network to architect the Web of Things in this project.

## Goal and Architecture

![](https://cloud.githubusercontent.com/assets/1126021/13871103/b0f09960-ed1c-11e5-810b-33f4aa8f0e70.png)

Figure-3: Goal of 201-web-of-things-dashboard

Figure-3 is a simple Web of Things architecture. In the figure:

* We will call Gateway Sensor Node as "Proxy"
* We will take advantge of ESP8266 as "Temperature Node", marked as "Node" in Figure-3
* Temperature Node will gather temperature information and send it to Proxy over "CoAP"
* We will connect Proxy to an IoT cloud server, the IoT cloud server is called "Endpoint"
* We will deploy "Endpoint" at Microsoft Azure through App Service
* We will build a web frontend "Dashboard" and connect "Dashboard" to "Endpoint" for viewing temperature information

Some technical details:

* "Temperature Node" sends temperature information to "Proxy" over CoAP
* "Proxy" is real-time pushing temperature information to "Endpoint" over Websockets
* "Endpoint" is real-time pushing temperature information to "Dashboard" over Websockets

We will implement "Endpoint", "Proxy", "Node" and "Dashboard" in sequence.

## Setup "Endpoint"

The following steps show that how to deploy "Endpoint" to Azure web service.

Please change your working directory to this project.

```
$ cd <your-path>/devify-server/templates/201-web-of-things-dashboard
```

The project structre is as the following.

```
.
├── README.md
├── esp8266
│   └── coap-temperature.lua  The sample code of "Temperature Node"
├── package.json
├── server.js                 The sample code of "Endpoint"
└── server.proxy.js           The sample code of "Proxy"
```

We will deploy this project to Azure App Service. Azure App Service will run ```server.js``` automatically after we finish deploying our project.

You may need to visit [Microsoft Azure](https://azure.microsoft.com/) if you want to know more about Microsoft Azure, or you have to sign up a new Azure account.

It's suggested that you read [App Service](https://azure.microsoft.com/en-us/services/app-service/) if it's the first time to use App Service of Microsoft Azure.

### Step 1: Install azure-cli

```
$ npm install azure-cli -g
```

### Step 2: Create Azure Site

You must login to Azure in advance:

```
azure config mode asm
azure login
```

Then use the command line to create an Aure site:

```
azure site create --git
```
Input your site information at the prompt mode. This is an example:

```
$ azure site create --git
info:    Executing command site create
help:    Need a site name
Name: devify-temperature
+ Getting locations                                                            
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
-info:    Created website at devify-temperature.azurewebsites.net              
+
info:    Executing `git init`
info:    Creating default iisnode.yml file
info:    Initializing remote Azure repository
+ Updating site information                                                    
info:    Remote azure repository initialized
+ Getting site information                                                     
+ Getting user information                                                     
info:    Executing `git remote add azure https://jollen@devify-temperature.scm.azurewebsites.net/devify-temperature.git`
info:    A new remote, 'azure', has been added to your local git repository
info:    Use git locally to make changes to your site, commit, and then use 'git push azure master' to deploy to Azure
info:    site create command OK

```

Please append ```--git``` option to the command line. This option could make Azure CLI to add the remote git of our new created site to local project. We will use ```git``` to deploy our site.

### Step 3: Get Endpoint

After finishing creating site, remember the name of your site. Please looking for the ```Created website at``` message line to get your endpoint name.

The endpoint name is ```devify-temperature.azurewebsites.net``` in this example.

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
$ git commit -m 'deploy to azure'
$ git push azure master
```

The is an example:

```
$ git add --all
$ git commit -m 'deploy to azure'
$ git push azure master
Password for 'https://jollen@devify-temperature.scm.azurewebsites.net': 
fatal: Authentication failed for 'https://jollen@devify-temperature.scm.azurewebsites.net/devify-temperature.git/'
Moko365de-iMac:201-web-of-things-dashboard apple$ git push azure master
Password for 'https://jollen@devify-temperature.scm.azurewebsites.net': 
Counting objects: 10, done.
Delta compression using up to 2 threads.
Compressing objects: 100% (8/8), done.
Writing objects: 100% (10/10), 5.16 KiB | 0 bytes/s, done.
Total 10 (delta 1), reused 0 (delta 0)
remote: Updating branch 'master'.
remote: Updating submodules.
remote: Preparing deployment for commit id '0f244b55bf'.
remote: Generating deployment script.
remote: Generating deployment script for node.js Web Site
remote: Generated deployment script files
remote: Running deployment command...
remote: Handling node.js deployment.
remote: KuduSync.NET from: 'D:\home\site\repository' to: 'D:\home\site\wwwroot'
remote: Deleting file: 'hostingstart.html'
remote: Copying file: '.gitignore'
remote: Copying file: 'iisnode.yml'
remote: Copying file: 'package.json'
remote: Copying file: 'README.md'
remote: Copying file: 'server.js'
remote: Copying file: 'server.proxy.js'
remote: Copying file: 'esp8266\coap-temperature.lua'
remote: Using start-up script server.js from package.json.
remote: Generated web.config.
remote: The package.json file does not specify node.js engine version constraints.
remote: The node.js application will run with the default node.js version 4.2.3.
remote: Selected npm version 3.5.1
remote: ....
.
.
remote: Finished successfully.
remote: Running post deployment command(s)...
remote: Deployment successful.
To https://jollen@devify-temperature.scm.azurewebsites.net/devify-temperature.git
 * [new branch]      master -> master
```

### Step 5: Enable Websockets

To enable web sockets:

```
azure site set -w
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
$ cd <your-path>/devify-server/templates/201-web-of-things-dashboard
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

Please install Devify CLI to speed up setup "Dahsboard".

```
$ npm install devify-cli
```

Download a sample dashboard.

```
$ devify ui ui-moving-line
```

It will download [ui-moving-line](https://github.com/wotcity/ui-moving-line) repo, a simple web frontend of moving line chart.

Change directory to ```ui-moving-line```, and start a web server to serve *ui-moving-line*.

```
$ cd ui-moving-line
$ devify serve ./
```
Open your browser with ```http://localhost:3000/index.html#testman/wot.city/temperature```. You will immediately see a demo.

The URL format is as ```index.html#<DeviceID>/<Endpoint>/<Y-Axis-Key>```. 

* **&lt;DeviceID&gt;** is the device ID, please check it out with the URI in [coap-temperature.lua](esp8266/coap-temperature.lua)
* **&lt;Endpoint&gt;** is the "Endpoint"
* **&lt;Y-Axis-Key&gt;** is the key of the display value, please check it out with JSON output in [coap-temperature.lua](esp8266/coap-temperature.lua)

This is an example:

```
index.html#5550937980d51931b3000009/devify-temperature.azurewebsites.net/temperature
```

[1]: https://en.wikipedia.org/wiki/Web_of_Things
[2]: https://en.wikipedia.org/wiki/Wireless_sensor_network
[3]: https://en.wikipedia.org/wiki/Star_network
