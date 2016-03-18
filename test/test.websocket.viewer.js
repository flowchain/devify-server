var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

client.on('connect', function(connection) {
    console.log('WebSocket client connected');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });
});

client.connect('ws://127.0.0.1:8000/object/5550937980d51931b3000009/viewer', '');
process.exit(0);
