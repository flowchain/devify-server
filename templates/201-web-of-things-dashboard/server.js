var server = require('devify-server').WebsocketBroker;

var onmessage = function(message) {
    // Parse strings to JSON object.
    var obj = JSON.parse(message.data);
};

server.start({
    onmessage: onmessage,
});
