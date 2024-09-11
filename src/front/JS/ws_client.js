let ws;
let wsReadyPromise;

// Function to initialize WebSocket connection
function initializeWebSocket() {
    return new Promise((resolve, reject) => {
        ws = new WebSocket('ws://localhost:8080');
        ws.onopen = () => resolve(ws);
        ws.onerror = (err) => reject(err);
    });
}

// Function to send a message through WebSocket
function sendMessage(message) {
    wsReadyPromise.then(() => {
        ws.send(JSON.stringify(message));

        if (message.newChatMessage) {
            const {orderID, msgID, msgSender, msgDate, msgContent} = message.newChatMessage;
            const order = orderData.find(order => order.id === orderID);
            if (order) {
                if (!order.chat) {
                    order.chat = {chatMessages: {}};
                }
                order.chat.chatMessages[msgID] = {msgID, msgSender, msgDate, msgContent};
            }
        }
    });
}

// Function to add a message listener to WebSocket
function addMessageListener(callback) {
    wsReadyPromise.then(() => {
        ws.addEventListener('message', (event) => {
            const response = JSON.parse(event.data);
            callback(response);

            if (response.success && response.newChatMessage) {
                const {orderID, msgID, msgSender, msgDate, msgContent} = response.newChatMessage;
                const order = orderData.find(order => order.id === orderID);
                if (order) {
                    if (!order.chat) {
                        order.chat = {chatMessages: {}};
                    }
                    order.chat.chatMessages[msgID] = {msgID, msgSender, msgDate, msgContent};
                }
            }
        });
    });
}

wsReadyPromise = initializeWebSocket();

export {sendMessage, addMessageListener};