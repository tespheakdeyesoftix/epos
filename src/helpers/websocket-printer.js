export default function WebSocketPrinter(options) {
 
    var defaults = {
        // we have setting in pos config to change url
        url: "ws://192.168.10.81:12212/print/",
        onConnect: function () {
        },
        onDisconnect: function () {
        },
        onUpdate: function () {
        },
    };
 
    var settings = Object.assign({}, defaults, options);
 

    var websocket;
    var connected = false;

    var onMessage = function (evt) {
        settings.onUpdate(evt.data);
    };

    var onConnect = function () {
        connected = true;
        settings.onConnect();
    };

    var onDisconnect = function () {
        connected = false;
        settings.onDisconnect();
        reconnect();
    };

    var connect = function () {
        websocket = new WebSocket(settings.url);
        websocket.onopen = onConnect;
        websocket.onclose = onDisconnect;
        websocket.onmessage = onMessage;
    };

    var reconnect = function () {
        connect();
    };

    this.submit = function (data) {
        if (Array.isArray(data)) {
            data.forEach(function (element) {
                websocket.send(JSON.stringify(element));
            });
        } else {
            websocket.send(JSON.stringify(data));
        }
    };

    this.isConnected = function () {
        return connected;
    };

    connect();
}