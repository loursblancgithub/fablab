const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'plateforme_fablab',
    password: '!Fablabisep2023',
    port: 5432,
});

async function query(text, params) {
    const dbClient = await pool.connect();
    try {
        return await dbClient.query(text, params);
    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    } finally {
        dbClient.release();
    }
}

// Check if the user who logged in exists in the database
async function userExists(studentCode) {
    try {
        const res = await query('SELECT 1 FROM public."userdata" WHERE studentcode = $1', [studentCode]);
        return res.rows.length > 0;
    } catch (err) {
        console.error('Error checking if user exists:', err);
        throw err;
    }
}

// Add a new user to the database
async function addUser(studentCode, firstName, lastName) {
    await query(
        'INSERT INTO public."userdata" (studentcode, privilegelevel, chat, firstname, lastname) VALUES ($1, $2, $3, $4, $5)',
        [studentCode, 1, '{}', firstName, lastName]
    );
}

// Add a new cookie to the database
async function createCookie(cookie, studentCode) {
    await query(
        'INSERT INTO public."cookie" (cookie, fablabuser) VALUES ($1, $2)',
        [cookie, studentCode]
    );
}

// Save order information in the database
async function createOrder(order) {
    const res = await query(
        'INSERT INTO public."order" (fablabuser, orderdata) VALUES ($1, $2) RETURNING id',
        [order.fablabuser, order.orderdata]
    );
    return { success: true, orderID: res.rows[0].id };
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

    return { success: true };
}

// Get all orders of a specific user
async function getOrders(user) {
    const res = await query('SELECT * FROM public."order" WHERE fablabuser = $1', [user]);
    return res.rows;
}

// Get the user student code using the cookie from the client's browser
async function getUserByCookie(cookie) {
    const res = await query('SELECT fablabuser FROM public."cookie" WHERE cookie = $1', [cookie]);
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

    return { success: true };
}

// Get user information using the student code
async function getUserInfos(studentCode) {
    const res = await query('SELECT * FROM public."userdata" WHERE studentcode = $1', [studentCode]);
    return res.rows[0];
}

// Get the user privilege level of a user with the student code
async function getUserPrivilegeLevel(studentCode) {
    const query = 'SELECT privilegelevel FROM public."userdata" WHERE studentcode = $1';
    const values = [studentCode];
    const res = await pool.query(query, values);
    return res.rows[0] ? res.rows[0].privilegelevel : null;
}

// Save sent feedback in the database
async function saveFeedback(data) {
    await query(`INSERT INTO public."feedback" (content, fablabuser)
                 VALUES ($1, $2)`, [data.content, data.fablabuser]);
    return { feedbackSaved: true };
}

// For admin use, retrieve all orders from the database
async function adminGetOrders() {
    const res = await query('SELECT * FROM public."order"');
    return res.rows;
}

// For admin use, retrieve all users from the database (only the first name, last name and student code)
async function adminGetUsers() {
    const res = await query('SELECT studentcode, firstname, lastname FROM public."userdata"');
    return res.rows;
}

// For admin use, update a specific field of a specific order in the database
async function adminUpdateOrder(data) {
    console.log("data received: ", data);
    await query(
        `UPDATE public."order" SET ${data.field} = $1 WHERE id = $2`,
        [data.newValue, data.orderID]
    );
    return { success: true, fieldToUpdate: data.field };
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
    saveChatMessage,
    getUserInfos,
    getUserPrivilegeLevel,
    adminGetOrders,
    adminGetUsers,
    adminUpdateOrder,
    saveFeedback
};