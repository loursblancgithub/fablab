const fetch = require('node-fetch');

const url = 'https://sso-portal.isep.fr';
const user = 'situ62394';
const password = encodeURIComponent('azerty');

// Function to get the token
async function getToken() {
    const response = await fetch(url);
    const text = await response.text();
    const token = text.split('token" value="')[1].split('"')[0];
    console.log(token);
    return token;
}

async function login() {
    const token = await getToken();
    const data = `&token=${token}&user=${user}&password=${password}`;

    const headers = {
        'Host': 'sso-portal.isep.fr',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: data,
        redirect: 'manual'
    });

    console.log(response.headers.get('set-cookie'));
}

login().then(() => console.log('Successfully logged in')).catch(e => console.error(e));