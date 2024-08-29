// src/front/JS/ws_client.js
let ws;
let wsReadyPromise;

function initializeWebSocket() {
    return new Promise((resolve, reject) => {
        ws = new WebSocket('ws://localhost:8080');
        ws.onopen = () => resolve(ws);
        ws.onerror = (err) => reject(err);
    });
}

function sendMessage(message) {
    wsReadyPromise.then(() => {
        ws.send(JSON.stringify(message));
    });
}

function addMessageListener(callback) {
    wsReadyPromise.then(() => {
        ws.addEventListener('message', (event) => {
            const response = JSON.parse(event.data);
            callback(response);
        });
    });
}

wsReadyPromise = initializeWebSocket();

export { sendMessage, addMessageListener };