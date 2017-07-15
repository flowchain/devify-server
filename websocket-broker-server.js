var server = require('./libs/websocket-broker');

var onmessage = function(payload) {
	var obj = JSON.parse(payload.data);
	var paths = payload.pathname.split('/');
	var deviceId = paths[2];

	console.log('[', deviceId, ']', payload.data);
};

var onnewthing = function(thing) {
	var data = JSON.stringify(thing);

	console.log('<NEW_THING> ' + data);
};

server.start({
	onmessage: onmessage,
	onnewthing: onnewthing
});
