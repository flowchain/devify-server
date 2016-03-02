var server = require('../libs/coap-broker');

// Components
var sms = require('../components/io.devify.sms').getComponent();
var con = require('../components/io.devify.console').getComponent();

// Graph
var graph = {
	author: 'jollen',
	connections: [
		{
			upproc: 'io.devify.console',
		 	upport: 'out',
		 	downproc: 'io.devify.sms',
		 	downport: 'in'
		},
		{
			upproc: 'io.devify.sms',
		 	upport: 'out',
		 	downproc: 'io.devify.console',
		 	downport: 'in'
		}
	]
};

server.start({
	graph: graph,
	components: [sms, con]
});