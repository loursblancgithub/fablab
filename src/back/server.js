// src/back/server.js
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');
const {userExists, addUser} = require('./db_handler');
const {mainLogin} = require('./login_handler');

// Function to serve static files with correct MIME types
function serveStaticFile(res, filePath) {
    const extname = path.extname(filePath);
    let contentType = 'application/octet-stream';

    switch (extname) {
        case '.html':
            contentType = 'text/html';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'application/javascript';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.ico':
            contentType = 'image/x-icon';
            break;
        default:
            contentType = 'application/octet-stream';
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end(`${contentType} file not found`);
        } else {
            res.writeHead(200, {'Content-Type': contentType});
            res.end(data);
        }
    });
}

// Create HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        if (req.url === '/') {
            // Serve the login page
            serveStaticFile(res, path.join(__dirname, '../front/HTML/login.html'));
        } else if (req.url === '/src/front/HTML/order.html') {
            // Serve the order page
            serveStaticFile(res, path.join(__dirname, '../front/HTML/order.html'));
        } else if (req.url === '/src/front/HTML/main_client.html') {
            // Serve the main client page
            serveStaticFile(res, path.join(__dirname, '../front/HTML/main_client.html'));
        } else if (req.url === '/src/front/HTML/main_admin.html') {
            // Serve the main admin page
            serveStaticFile(res, path.join(__dirname, '../front/HTML/main_admin.html'));
        } else if (req.url.startsWith('/src/front/CSS/')) {
            // Serve CSS files
            serveStaticFile(res, path.join(__dirname, '..', '..', req.url));
        } else if (req.url.startsWith('/src/front/Assets/')) {
            // Serve Assets files
            serveStaticFile(res, path.join(__dirname, '..', '..', req.url));
        } else if (req.url.startsWith('/src/front/JS/')) {
            // Serve JavaScript files
            serveStaticFile(res, path.join(__dirname, '..', '..', req.url));
        } else {
            res.writeHead(404);
            res.end('Not Found');
        }
    } else {
        res.writeHead(405);
        res.end('Method Not Allowed');
    }
});

// Create WebSocket server
const wss = new WebSocket.Server({server});

wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.login) {
            const {username, password} = parsedMessage.login;
            const response = await mainLogin(username, password);
            if (response.success) {
                if (await userExists(username)) {
                    ws.send(JSON.stringify({redirect: 'main_client.html'}));
                } else {
                    ws.send(JSON.stringify({redirect: 'order.html'}));
                }
            } else {
                ws.send(JSON.stringify(response));
            }
        } else if (parsedMessage.newOrder) {
            const response = await createOrder(parsedMessage.newOrder);
            ws.send(JSON.stringify(response));
        } else {
            const {userCode, userName, userPassword} = parsedMessage;

            if (await userExists(userCode)) {
                ws.send(JSON.stringify({page: 'existing_user.html'}));
            } else {
                await addUser(userCode, userName, userPassword);
                ws.send(JSON.stringify({page: 'new_user.html'}));
            }
        }
    });
});

// Start the server
server.listen(8080, () => {
    console.log('Server is listening on port 8080');
});