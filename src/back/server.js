const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');
const {
    userExists,
    createOrder,
    getOrders,
    getUserByCookie,
    deleteCookie,
    saveChatMessage,
    updateOrderFiles,
    getUserInfos,
    getUserPrivilegeLevel,
    adminGetOrders,
    adminGetUsers,
    adminUpdateOrder, saveFeedback
} = require('./db_handler');
const {mainLogin} = require('./login_handler');
const {saveFileToOrder} = require('./files_handler.js');

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
        const privilegeLevel = await getUserPrivilegeLevel(user.fablabuser);
        if (privilegeLevel >= 2) {
            serveStaticFile(res, path.join(__dirname, '../front/HTML/main_admin.html'));
        } else {
            const hasOrders = await checkUserOrders(user.fablabuser);
            if (hasOrders) {
                serveStaticFile(res, path.join(__dirname, '../front/HTML/main_client.html'));
            } else {
                res.writeHead(302, {'Location': '/src/front/HTML/order.html'});
                res.end();
            }
        }
    } else {
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
                res.writeHead(302, {'Location': '/src/front/HTML/login.html'});
                res.end();
            }
        } else if (req.url === '/src/front/HTML/main_client.html' || req.url === '/src/front/HTML/main_admin.html') {
            if (cookieValue) {
                await handleUserRedirection(res, cookieValue);
            } else {
                res.writeHead(302, {'Location': '/src/front/HTML/login.html'});
                res.end();
            }
        } else if (req.url === '/src/front/HTML/order.html') {
            serveStaticFile(res, path.join(__dirname, '../front/HTML/order.html'));
        } else if (req.url === '/src/front/HTML/login.html') {
            serveStaticFile(res, path.join(__dirname, '../front/HTML/login.html'));
        } else if (req.url.startsWith('/src/front/CSS/')) {
            serveStaticFile(res, path.join(__dirname, '..', '..', req.url));
        } else if (req.url.startsWith('/src/front/Assets/')) {
            serveStaticFile(res, path.join(__dirname, '..', '..', req.url));
        } else if (req.url.startsWith('/src/front/JS/')) {
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

        for (const key in parsedMessage) {
            if (parsedMessage.hasOwnProperty(key)) {
                if (key === 'checkUser') {
                    const {username} = parsedMessage.checkUser;
                    const userExistsResult = await userExists(username);
                    ws.send(JSON.stringify({userExists: userExistsResult}));
                } else if (key === 'getClientUserData') {
                    const user = await getUserByCookie(parsedMessage.cookie);
                    if (user) {
                        const untrimmedClientUserData = await getUserInfos(user.fablabuser);
                        ws.send(JSON.stringify({
                            clientUserData: {
                                firstName: untrimmedClientUserData.firstname,
                                lastName: untrimmedClientUserData.lastname,
                                studentCode: untrimmedClientUserData.studentcode,
                                chat: untrimmedClientUserData.chat
                            }
                        }));
                    } else {
                        ws.send(JSON.stringify({error: 'Could not get client infos'}));
                    }
                } else if (key === 'adminOrdersRequest') {
                    const user = await getUserByCookie(parsedMessage.cookie);
                    if (user) {
                        const privilegeLevel = await getUserPrivilegeLevel(user.fablabuser);
                        if (privilegeLevel >= 2) {
                            const adminOrders = await adminGetOrders();
                            const adminUsers = await adminGetUsers();
                            ws.send(JSON.stringify({adminOrders, adminUsers}));
                        } else {
                            ws.send(JSON.stringify({error: 'Insufficient privileges'}));
                        }
                    } else {
                        ws.send(JSON.stringify({error: 'Authentication failed'}));
                    }
                } else if (key === 'login') {
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
                } else if (key === 'logout') {
                    await deleteCookie(parsedMessage.cookie);
                    ws.send(JSON.stringify({redirect: 'login.html'}));
                } else if (key === 'fetchOrders') {
                    const {cookie} = parsedMessage.fetchOrders;
                    const userID = await getUserByCookie(cookie);
                    const user = await getUserInfos(userID.fablabuser);
                    if (user) {
                        const orders = await getOrders(user.studentcode);
                        ws.send(JSON.stringify({
                            orders,
                            user: {
                                firstName: user.firstname,
                                lastName: user.lastname,
                                studentCode: user.studentcode
                            }
                        }));
                    } else {
                        ws.send(JSON.stringify({error: 'Authentication failed'}));
                    }
                } else if (key === 'newChatMessage') {
                    const response = await saveChatMessage(parsedMessage.newChatMessage);
                    if (response.success) {
                        ws.send(JSON.stringify({success: true}));
                    } else {
                        ws.send(JSON.stringify(response));
                    }
                } else if (key === 'newOrder') {
                    const newOrder = parsedMessage.newOrder;
                    const {fileName, fileExtension, fileData, fileDateTime, fileWeight} = parsedMessage.newFile;

                    if (!fileData) {
                        ws.send(JSON.stringify({error: 'File data is missing'}));
                        return;
                    }

                    const buffer = Buffer.from(fileData);

                    try {
                        const orderCreationResponse = await createOrder(newOrder);
                        if (orderCreationResponse.success) {
                            const orderID = orderCreationResponse.orderID;
                            await saveFileToOrder(orderID, `${fileName}.${fileExtension}`, buffer);

                            const filePath = path.join(__dirname, 'storage', 'orders', orderID.toString(), `${fileName}.${fileExtension}`);
                            fs.writeFile(filePath, buffer, async (err) => {
                                if (err) {
                                    console.error('File could not be saved:', err);
                                    ws.send(JSON.stringify({error: 'File could not be saved'}));
                                } else {
                                    const fileInfo = {
                                        fileName: fileName,
                                        fileExtension: fileExtension,
                                        fileDateTime: fileDateTime,
                                        fileWeight: fileWeight
                                    };
                                    await updateOrderFiles(orderID, fileInfo);
                                    ws.send(JSON.stringify({success: true, redirect: 'main_client.html'}));
                                }
                            });
                        } else {
                            console.error('Error creating order:', orderCreationResponse);
                            ws.send(JSON.stringify({error: 'Erreur lors de l\'envoi de la commande'}));
                        }
                    } catch (error) {
                        console.error('Error processing order:', error);
                        ws.send(JSON.stringify({error: 'Erreur lors de l\'envoi du fichier, merci de réessayer plus tard'}));
                    }
                } else if (key === 'newFile') {
                    const {fileName, fileExtension, fileData, fileDateTime, fileWeight} = parsedMessage.newFile;
                    const orderID = parsedMessage.orderID;
                    const cookie = parsedMessage.cookie;

                    console.log('Received newFile message:', parsedMessage.newFile); // Log the newFile object

                    if (!fileData) {
                        console.error('File data is missing');
                        ws.send(JSON.stringify({error: 'File data is missing'}));
                        return;
                    }

                    const buffer = Buffer.from(fileData);
                    console.log('Buffer created from fileData:', buffer); // Log the buffer

                    try {
                        const userVerification = await getUserByCookie(cookie);
                        if (userVerification) {
                            const dirPath = path.join(__dirname, 'storage', 'orders', orderID.toString());
                            const filePath = path.join(dirPath, `${fileName}.${fileExtension}`);

                            fs.mkdirSync(dirPath, {recursive: true});

                            fs.writeFile(filePath, buffer, async (err) => {
                                if (err) {
                                    console.error('File could not be saved:', err);
                                    ws.send(JSON.stringify({error: 'File could not be saved'}));
                                } else {
                                    const fileInfo = {
                                        fileName: fileName,
                                        fileExtension: fileExtension,
                                        fileDateTime: fileDateTime,
                                        fileWeight: fileWeight
                                    };
                                    await updateOrderFiles(orderID, fileInfo);
                                    ws.send(JSON.stringify({newFileSendSuccess: true}));
                                }
                            });
                        }
                    } catch (error) {
                        console.error('Error processing file:', error);
                        ws.send(JSON.stringify({error: 'Error processing file'}));
                    }
                } else if (key === 'adminOrderUpdate') {
                    try {
                        const user = await getUserByCookie(parsedMessage.adminOrderUpdate.cookie);
                        if (user) {
                            const privilegeLevel = await getUserPrivilegeLevel(user.fablabuser);
                            if (privilegeLevel >= 2) {
                                const response = await adminUpdateOrder(parsedMessage.adminOrderUpdate.newData);
                                if (response.success) {
                                    ws.send(JSON.stringify(response));
                                } else {
                                    console.log('Update failed');
                                    ws.send(JSON.stringify({error: 'Error editing the order'}));
                                }
                            } else {
                                console.log('Privilege level too low');
                                ws.send(JSON.stringify({error: 'Error editing the order'}));
                            }
                        } else {
                            console.log('User not found');
                            ws.send(JSON.stringify({error: 'Error editing the order'}));
                        }
                    } catch (error) {
                        console.error('Error processing message:', error);
                        ws.send(JSON.stringify({error: 'Error processing request'}));
                    }
                } else if (key === 'newFeedback') {
                    const feedbackSaved = await saveFeedback(parsedMessage.newFeedback);
                    if (feedbackSaved) {
                        ws.send(JSON.stringify({feedbackReceived: true}));
                    }
                } else if (key === 'fileRequest') {
                    const {fileName, fileExtension, orderID} = parsedMessage.fileRequest;
                    const filePath = path.join(__dirname, 'storage', 'orders', orderID.toString(), `${fileName}.${fileExtension}`);
                    fs.readFile(filePath, (err, data) => {
                        if (err) {
                            console.error('Error reading file:', err);
                            ws.send(JSON.stringify({fileDownloadError: 'Error reading file'}));
                        } else {
                            const fileDownload = {
                                fileName: fileName,
                                fileExtension: fileExtension,
                                fileData: Array.from(data)
                            };
                            ws.send(JSON.stringify({fileDownload: fileDownload}));
                        }
                    });
                }
            }
        }
    });
});

// Start the server
server.listen(8080, () => {
    console.log('Server is listening on port 8080');
});