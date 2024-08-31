const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'plateforme_fablab',
    password: '!Fablabisep2023',
    port: 5432,
});

async function query(text, params) {
    const client = await pool.connect();
    try {
        return await client.query(text, params);
    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    } finally {
        client.release();
    }
}

// Check if the user who logged in exists in the database
async function userExists(studentCode) {
    const res = await query('SELECT 1 FROM public."user" WHERE studentcode = $1', [studentCode]);
    return res.rows.length > 0;
}

// Add a new user to the database
async function addUser(studentCode, firstName, lastName) {
    await query(
        'INSERT INTO public."user" (studentcode, privilegelevel, chat, firstname, lastname) VALUES ($1, $2, $3, $4, $5)',
        [studentCode, 0, '{}', firstName, lastName]
    );
}

// Add a new cookie to the database
async function createCookie(cookie, studentCode) {
    await query(
        'INSERT INTO public."cookie" (cookie, client) VALUES ($1, $2)',
        [cookie, studentCode]
    );
}

// Save order information in the database
async function createOrder(order) {
    const res = await query(
        'INSERT INTO public."order" (name, tool, material, color, quantity, questions, datetime, client, state, goodpracticescheck, additionalparameters) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id',
        [order.orderName, order.orderTool, order.orderMaterial, order.orderColor, order.orderQuantity, order.orderQuestions, order.orderDateTime, order.orderClient, "pending", order.orderGoodPracticesCheck, order.orderAdditionalParameters]
    );
    return {success: true, orderID: res.rows[0].id};
}

// Update the order with the new file information
async function updateOrderFiles(orderID, fileInfo) {
    const res = await query('SELECT files FROM public."order" WHERE id = $1', [orderID]);
    const currentFiles = res.rows[0].files || {};

    const fileID = `file${Object.keys(currentFiles).length + 1}`;
    currentFiles[fileID] = fileInfo;

    await query(
        'UPDATE public."order" SET files = $1 WHERE id = $2',
        [currentFiles, orderID]
    );

    return {success: true};
}

// Get all orders of a specific user
async function getOrders(client) {
    const res = await query('SELECT * FROM public."order" WHERE client = $1', [client]);
    return res.rows;
}

// Get the user student code using the cookie from the client's browser
async function getUserByCookie(cookie) {
    const res = await query('SELECT client FROM public."cookie" WHERE cookie = $1', [cookie]);
    return res.rows[0];
}

// Delete a cookie when the user logs out from a device
async function deleteCookie(cookie) {
    await query('DELETE FROM public."cookie" WHERE cookie = $1', [cookie]);
}

// Save a chat message in the database
async function saveChatMessage(message) {
    const res = await query('SELECT chat FROM public."order" WHERE id = $1', [message.orderID]);
    const currentChat = res.rows[0].chat || {};

    currentChat.chatMessages = currentChat.chatMessages || {};
    currentChat.chatMessages[message.msgID] = message;

    await query(
        'UPDATE public."order" SET chat = $1 WHERE id = $2',
        [currentChat, message.orderID]
    );

    return {success: true};
}

module.exports = {
    query,
    userExists,
    addUser,
    createCookie,
    createOrder,
    updateOrderFiles,
    getOrders,
    getUserByCookie,
    deleteCookie,
    saveChatMessage
};