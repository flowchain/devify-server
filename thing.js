/**
 * The thing definition which includes 
 *  - name
 *  - model
 *  - implementation
 */
module.exports = {
    "name": "esp8266",
    "model": {
        "events": {
            "ac_power": function () {
            }
        },
        "properties": {
            "battery": function() {
            }
        },
        "actions": {
            "unlock": function () {
            },
            "lock": function () {
            }
        }
    },
    "implementation": {
        notify: function (thing) { 
        },
    }
};