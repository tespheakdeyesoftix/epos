export default function WebSocketPrinter(options) {

    var defaults = {
        url: "ws://192.168.10.81:12212/print/",
        onConnect: function () {},
        onDisconnect: function () {},
        onUpdate: function () {},
        onPrinterList: function () {},
    };

    var settings = Object.assign({}, defaults, options);

    var websocket;
    var connected = false;

    var onMessage = function (evt) {
        let message;
        try {
            message = JSON.parse(evt.data);
        } catch (e) {
            console.error("Invalid JSON:", evt.data);
            return;
        }
        if (message.cmd === "get_printers") {
            settings.onPrinterList && settings.onPrinterList(message.printers);
        } else {
            settings.onUpdate(evt.data);
        }
    };

    var onConnect = function () {
        connected = true;
        settings.onConnect();
        websocket.send(JSON.stringify({ cmd: "get_printers" }));
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
        setTimeout(connect, 2000);
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

    this.getPrinterList = function () {
        if (connected) {
            websocket.send(JSON.stringify({ cmd: "get_printers" }));
        }
    };

    this.isConnected = function () {
        return connected;
    };

    connect();
}
