var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
    process.exit(0);
});

client.on('connect', function(connection) {
    console.log('WebSocket client connected');
    process.exit(0);
});

client.connect('ws://localhost:8000/object/5550937980d51931b3000009/viewer', '');
