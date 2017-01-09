var amqp = require('amqp10');
var linkCache = require('amqp10-link-cache');
var AMQPClient = require('amqp10').Client;
var Policy = require('amqp10').Policy;
var eventHubName = process.env.EVENTHUB_NAME;

amqp.use(linkCache());


var eventHubConnectionString = createEventHubConnectionString();

var eventhubOpt = {
    senderLink: {
        attach: {
            maxMessageSize: 256000, // Max eventhub size
        }
    }
}

var eventHubPolicy = amqp.Policy.merge(eventhubOpt, Policy.EventHub)
var webViewClient = new AMQPClient(eventHubPolicy);

webViewClient.on(AMQPClient.ErrorReceived, function (err) {
    console.log(err);
});

webViewClient.on(AMQPClient.ConnectionClosed, function () { isconnected = false; });
webViewClient.on("disconnected", function () { isconnected = false; });
webViewClient.on("connected", function () { isconnected = true; console.log('connected') });

var webClientPromise = webViewClient.connect(createEventHubConnectionString());

function errorCallback(err) {
    console.error("error while sending", err)
};



function sendToEventHub(payload, cb) {
    if (!payload) {
        return;
    }

    if (!isconnected){
        setTimeout(function() {
            //to simulate kill the tcp connection and ensure your server is under stress
            console.warn("called function to send data later to eventhub connection is broken")
            _callSendToEventHub(payload, cb);
        }, 5000);
    }
    else {
        process.nextTick(_callSendToEventHub, payload, cb);
        //_callSendToEventHub(payload);
    }
}

function _callSendToEventHub(payload,cb) {
     webClientPromise.then(
            function () {
                return webViewClient.createSender(eventHubName).then(function (sender) {
                     var options = {
                        'messageAnnotations': { 'x-opt-partition-key': 'pk' + 1 }
                    };
                    return sender.send(payload, options).then(cb).catch(errorCallback);
                }).catch(errorCallback);
            }
        ).catch(errorCallback);
}


function createEventHubConnectionString() {
    var protocol = 'amqps';
    var serviceBusHost = process.env.SERVICE_BUS_HOST + '.servicebus.windows.net';
    if (process.env.SERVICE_BUS_HOST.indexOf(".") !== -1) {
        serviceBusHost = process.env.SERVICE_BUS_HOST;
    }
    var sasName = process.env.SAS_KEY_NAME;
    var sasKey = process.env.SAS_KEY;
    var eventHubName = process.env.EVENTHUB_NAME;

    var uri = protocol + '://' + encodeURIComponent(sasName) + ':' + encodeURIComponent(sasKey) + '@' + serviceBusHost;

    return uri;
}

module.exports = sendToEventHub;