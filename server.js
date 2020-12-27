const express = require('express');
const app = express();
const http = require('http');
const WebSocket = require('ws');

const port = process.env.PORT || 6969;
const server = http.createServer(express);
const webSocketServer = new WebSocket.Server({ server: server });

app.use(express.static(__dirname + "/"));

webSocketServer.on('connection', (webSocketClient) => {
    webSocketClient.on('message', (incomingMessage) => {
        const message = incomingMessage ? JSON.parse(incomingMessage) : {};
        webSocketServer.clients.forEach((client) => {
            if (client !== webSocketClient && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: message.type,
                    text: message.text,
                    user: message.user + ":",
                }));
            }
        })
    })
});

server.listen(port, () => {
    console.log(`Server is listening on ${port}!`)
});
