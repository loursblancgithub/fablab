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

// Add an order to the database
async function createOrder(orderData) {
    await query(
        'INSERT INTO public."order" (id, name, tool, quantity, material, questions, datetime, client, goodpracticescheck, chat, additionalparameters, color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
        [orderData.orderId, orderData.orderName, orderData.orderTool, orderData.orderQuantity, orderData.orderMaterial, orderData.orderQuestions, orderData.orderDateTime, orderData.orderClient, orderData.orderGoodPracticesCheck, {}, orderData.orderAdditionalParameters, orderData.orderColor]
    );
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

module.exports = {
    query,
    userExists,
    addUser,
    createCookie,
    createOrder,
    getOrders,
    getUserByCookie,
    deleteCookie
};