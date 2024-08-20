// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:8080");

// Connection opened
socket.addEventListener("open", (event) => {
    console.log("WebSocket connection opened.");
});

// Listen for messages
socket.addEventListener("message", (event) => {
    console.log("Message from server: ", event.data);
});

// Handle WebSocket errors
socket.addEventListener("error", (error) => {
    console.error("WebSocket error: ", error);
});

// Connection closed
socket.addEventListener("close", (event) => {
    console.log("WebSocket connection closed.");
});

export { socket };