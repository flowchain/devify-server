var server = require('../libs/coap-broker');

var onmessage = function(message) {
	var obj = JSON.parse(message.data);

	console.log('<DATA> ' + message.data);
};

var onnewthing = function(thing) {
	var data = JSON.stringify(thing);
};

server.start({
	onmessage: onmessage,
	onnewthing: onnewthing
});
