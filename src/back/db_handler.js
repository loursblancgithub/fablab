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

async function userExists(studentcode) {
    const res = await query('SELECT 1 FROM public."user" WHERE studentcode = $1', [studentcode]);
    return res.rows.length > 0;
}

async function addUser(studentcode) {
    await query(
        'INSERT INTO public."user" (studentcode, privilegelevel, chat) VALUES ($1, $2, $3)',
        [studentcode, 0, '{}']
    );
}

module.exports = {
    query,
    userExists,
    addUser,
};