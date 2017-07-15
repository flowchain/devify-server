var server = require('devify-server').CoapToWebsocketProxy;

var onmessage = function(message) {
    // Parse strings to JSON object.
    var obj = JSON.parse(message.data);
};

server.start({
    onmessage: onmessage,
});
