const { Client } = require('pg');

const client = new Client({
    user: 'yourusername',
    host: 'localhost',
    database: 'mydatabase',
    password: 'yourpassword',
    port: 5432,
});

client.connect();

async function userExists(userCode) {
    const res = await client.query('SELECT * FROM users WHERE userCode = $1', [userCode]);
    return res.rows.length > 0;
}

async function addUser(userCode, userName) {
    await client.query('INSERT INTO users (userCode, userName) VALUES ($1, $2)', [userCode, userName]);
}

module.exports = { userExists, addUser };