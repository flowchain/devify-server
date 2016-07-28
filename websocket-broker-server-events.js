var server = require('../libs/websocket-broker');

var onmessage = function(message) {
	var obj = JSON.parse(message.data);

	console.log('<DATA> ' + message.data);
};

var onnewthing = function(thing) {
	var data = JSON.stringify(thing);

	console.log('<NEW_THING> ' + data);
};

server.start({
	onmessage: onmessage,
	onnewthing: onnewthing
});
