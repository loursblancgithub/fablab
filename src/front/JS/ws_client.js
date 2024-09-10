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

// Function to send a file through WebSocket
function sendFile(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const binaryData = event.target.result;
        const fileDateTime = new Date().toISOString();
        const fileWeight = file.size;

        console.log('Sending file:', file.name); // Debug log

        wsReadyPromise.then(() => {
            ws.send(JSON.stringify({
                file: {
                    fileName: file.name,
                    fileExtension: file.name.split('.').pop(),
                    fileData: Array.from(new Uint8Array(binaryData)),
                    fileDateTime: fileDateTime,
                    fileWeight: fileWeight
                }
            }));
        });
    };
    reader.readAsArrayBuffer(file);
}

// Function to send an order through WebSocket
function sendOrder(order, file) {
    sendFile(file);
    wsReadyPromise.then(() => {
        ws.send(JSON.stringify({ newOrder: order }));
    });
}

wsReadyPromise = initializeWebSocket();

export {sendMessage, addMessageListener, sendOrder, sendFile};