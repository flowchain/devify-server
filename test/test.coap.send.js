var coap = require('coap');

var sendNumber = function() {
    // 20 to 27
    var number = Math.round(Math.random() * 27 + 1);
    var obj = {temperature: number, temp: number};
    var data = JSON.stringify(obj);
    var clientWriable = coap.request('coap://localhost:8000/object/5550937980d51931b3000009/send');

    console.log('Pushing: ' + data);
    clientWriable.end(new Buffer(data));

    process.exit(0);
};

sendNumber();
