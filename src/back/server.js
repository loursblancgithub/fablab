const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');
const {userExists, createOrder, getOrders, getUserByCookie, deleteCookie, saveChatMessage} = require('./db_handler');
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

// Function to check if the user has orders
async function checkUserOrders(studentCode) {
    const orders = await getOrders(studentCode);
    return orders.length > 0;
}

// Function to handle user redirection based on orders
async function handleUserRedirection(res, cookieValue) {
    const user = await getUserByCookie(cookieValue);
    if (user) {
        const hasOrders = await checkUserOrders(user.client);
        if (hasOrders) {
            // Serve the main client page if the user has orders
            serveStaticFile(res, path.join(__dirname, '../front/HTML/main_client.html'));
        } else {
            // Redirect to the order page if the user has no orders
            res.writeHead(302, {'Location': '/src/front/HTML/order.html'});
            res.end();
        }
    } else {
        // Redirect to the login page if the cookie is invalid or missing
        res.writeHead(302, {'Location': '/src/front/HTML/login.html'});
        res.end();
    }
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
    if (req.method === 'GET') {
        const cookies = req.headers.cookie;
        const fablabCookie = cookies && cookies.split('; ').find(row => row.startsWith('fablabCookie='));
        const cookieValue = fablabCookie && fablabCookie.split('=')[1];

        if (req.url === '/') {
            if (cookieValue) {
                await handleUserRedirection(res, cookieValue);
            } else {
                // Redirect to the login page if the cookie is invalid or missing
                res.writeHead(302, {'Location': '/src/front/HTML/login.html'});
                res.end();
            }
        } else if (req.url === '/src/front/HTML/main_client.html') {
            if (cookieValue) {
                await handleUserRedirection(res, cookieValue);
            } else {
                // Redirect to the login page if the cookie is invalid or missing
                res.writeHead(302, {'Location': '/src/front/HTML/login.html'});
                res.end();
            }
        } else if (req.url === '/src/front/HTML/order.html') {
            // Serve the order page
            serveStaticFile(res, path.join(__dirname, '../front/HTML/order.html'));
        } else if (req.url === '/src/front/HTML/login.html') {
            // Serve the login page
            serveStaticFile(res, path.join(__dirname, '../front/HTML/login.html'));
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

        if (parsedMessage.checkUser) {
            const {username} = parsedMessage.checkUser;
            const userExistsResult = await userExists(username);
            ws.send(JSON.stringify({userExists: userExistsResult}));
        } else if (parsedMessage.login) {
            const {username, password} = parsedMessage.login;
            const response = await mainLogin(username, password);
            if (response.success === true) {
                const userExistsResult = await userExists(username);
                const userOrders = await getOrders(username);
                const redirectPage = userExistsResult && userOrders.length > 0 ? 'main_client.html' : 'order.html';
                ws.send(JSON.stringify({redirect: redirectPage, cookie: response.cookie}));
            } else {
                ws.send(JSON.stringify(response));
            }
        } else if (parsedMessage.logout) {
            await deleteCookie(parsedMessage.cookie);
            ws.send(JSON.stringify({redirect: 'login.html'}));
        } else if (parsedMessage.newOrder) {
            const response = await createOrder(parsedMessage.newOrder);
            if (response.success) {
                ws.send(JSON.stringify({redirect: 'main_client.html'}));
            } else {
                ws.send(JSON.stringify(response));
            }
        } else if (parsedMessage.fetchOrders) {
            const {cookie} = parsedMessage.fetchOrders;
            const user = await getUserByCookie(cookie);
            if (user) {
                const orders = await getOrders(user.client);
                ws.send(JSON.stringify({orders}));
            } else {
                ws.send(JSON.stringify({error: 'User not found'}));
            }
        } else if (parsedMessage.newChatMessage) {
            const response = await saveChatMessage(parsedMessage.newChatMessage);
            if (response.success) {
                ws.send(JSON.stringify({success: true}));
            } else {
                ws.send(JSON.stringify(response));
            }
        }
    });
});

// Start the server
server.listen(8080, () => {
    console.log('Server is listening on port 8080');
});