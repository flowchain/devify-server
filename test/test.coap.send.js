var coap = require('coap');

var sendNumber = function() {
    // 1 to 100
    var number = Math.round(Math.random() * 100 + 1);
    var obj = {temperature: number, temp: number};
    var data = JSON.stringify(obj);

    console.log('Pushing: ' + data);

    var clientWriable = coap.request('coap://192.168.1.100:8000/object/5550937980d51931b3000009/send');
    clientWriable.end(new Buffer(data));
};

sendNumber();

process.exit(0);
