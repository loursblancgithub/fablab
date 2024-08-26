// src/front/JS/ws_client.js
const ws = new WebSocket('ws://localhost:8080/');

ws.addEventListener('open', () => {
    console.log('Connected to WebSocket server');
});

ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    console.log('Message from server:', message);
});

ws.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
});

ws.addEventListener('close', () => {
    console.log('WebSocket connection closed');
});

export function sendMessage(message) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        console.error('WebSocket is not open. ReadyState:', ws.readyState);
    }
}

export function addMessageListener(callback) {
    ws.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        callback(message);
    });
}