var server = require('../libs/coap-broker');

// Components
var fs = require('../components/io.devify.fs').getComponent();
var con = require('../components/io.devify.console').getComponent();

// Graph
var graph = {
	author: 'jollen',
	connections: [
		{
			upproc: 'io.devify.console',
		 	upport: 'out',
		 	downproc: 'io.devify.fs',
		 	downport: 'in'
		},
		{
			upproc: 'io.devify.fs',
		 	upport: 'out',
		 	downproc: 'io.devify.console',
		 	downport: 'in'
		},
	]
};

server.start({
	graph: graph,
	components: [fs, con]
});