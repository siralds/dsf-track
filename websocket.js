const WebSocket = require('ws');
message = 'hello world'
function initializeWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', function connection(ws) {
        console.log('WebSocket connection established.');

        ws.on('message', function incoming(message) {
            console.log('Received message:', message);
        });

        ws.on('error', function(error) {
            console.error('WebSocket error:', error);
        });

        ws.on('close', function() {
            console.log('WebSocket connection closed.');
        });
    });
}

module.exports = { initializeWebSocket };
