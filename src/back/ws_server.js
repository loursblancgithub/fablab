const WebSocket = require('ws');
const { userExists, addUser } = require('./db_handler');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
        const { userCode, userName, userPassword } = JSON.parse(message);

        if (await userExists(userCode)) {
            ws.send(JSON.stringify({ page: 'existing_user.html' }));
        } else {
            await addUser(userCode, userName, userPassword);
            ws.send(JSON.stringify({ page: 'new_user.html' }));
        }
    });
});