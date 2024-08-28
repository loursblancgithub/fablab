// src/back/db_handler.js
const { Pool } = require('pg');

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

async function userExists(studentCode) {
    const res = await query('SELECT 1 FROM public."user" WHERE studentcode = $1', [studentCode]);
    return res.rows.length > 0;
}

async function addUser(studentCode, firstName, lastName, cookie) {
    await query(
        'INSERT INTO public."user" (studentcode, privilegelevel, chat, firstname, lastname, cookie) VALUES ($1, $2, $3, $4, $5, $6)',
        [studentCode, 0, '{}', firstName, lastName, cookie]
    );
}

async function createOrder(orderData){
    await query(
        'INSERT INTO public."order" (id, name, tool, quantity, material, questions, datetime, client, goodpracticescheck, chat, additionalparameters, color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
        [orderData.orderId, orderData.orderName, orderData.orderTool, orderData.orderQuantity, orderData.orderMaterial, orderData.orderQuestions, orderData.orderDateTime, orderData.orderClient, orderData.orderGoodPracticesCheck, {}, orderData.orderAdditionalParameters, orderData.orderColor]
    );
}

async function getOrders(client){
    const res = await query('SELECT * FROM public."order" WHERE client = $1', [client]);
    return res.rows;
}

module.exports = {
    query,
    userExists,
    addUser,
    createOrder,
    getOrders
};