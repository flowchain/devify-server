![](http://res.cloudinary.com/jollen/image/upload/h_110/v1455862763/devify-logo_rh63vl.png)

# devify-server

[![Build Status](https://travis-ci.org/DevifyPlatform/devify-server.svg?branch=master)](https://travis-ci.org/DevifyPlatform/devify-server)

devify-server, or *Devify* in short, is a light weight and very simple IoT server for communication with hardware devices. It aims to provide a as easy as possible boilerplate for communicating with IoT devices over the web.

devify-server is also a boilerplate for getting started with IoT cloud servers. It gets you up to speed using IoT and web technologies.

## Design

Devify has a simplified design of WoT framework.

* Take advantage of broker pattern architecture
* Thing modeling (thing description in JSON)
* URI based communications (supoprt CoAP/WebSocket)

##Quickstart

A cli tool [devify-cli](https://github.com/DevifyPlatform/devify-cli) is available for getting started with *devify*.

```
$ npm install -g devify-cli
$ devify <your_new_project_dir>
$ cd <your_new_project_dir>
$ node esp8266-coap-server.js 
```

## License

devify-server is released under the [MIT License](http://www.opensource.org/licenses/MIT).
