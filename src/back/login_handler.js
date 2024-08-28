const { userExists, addUser } = require('./db_handler');
const tokenUrl = 'https://sso-portal.isep.fr';
const infoUrl = 'https://sso-portal.isep.fr/session/my/global';

async function getToken() {
    const response = await fetch(tokenUrl);
    const text = await response.text();
    return text.split('token" value="')[1].split('"')[0];
}

async function login(user, password) {
    const token = await getToken();
    const data = `&token=${token}&user=${user}&password=${password}`;
    const headers = {
        'Host': 'sso-portal.isep.fr',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    };

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: headers,
        body: data,
        redirect: 'manual'
    });

    const cookies = response.headers.get('Set-Cookie');
    return cookies.split("lemonldap=")[1].split(";")[0];
}

async function getUserData(token) {
    const headers = {
        'Cookie': `lemonldap=${token}`
    };

    const response = await fetch(infoUrl, {
        headers: headers,
        redirect: 'manual'
    });

    return await response.json();
}

async function mainLogin(username, password) {
    console.log('Attempting to log in user:', username);
    try {
        const token = await login(username, password);
        if (token) {
            const userData = await getUserData(token);
            if (userData.login === username) {
                if (await userExists(username)) {
                    console.log('User authenticated successfully:', username);
                    return { success: true };
                } else {
                    console.log('User does not exist, creating new user:', username);
                    await addUser(username, userData.prenom, userData.nom, token);
                    console.log('New user created:', username);
                    return { success: true, message: 'New user created' };
                }
            } else {
                console.log('Username mismatch:', username);
                return { success: false, error: 'Username mismatch' };
            }
        } else {
            console.log('Invalid credentials for user:', username);
            return { success: false, error: 'Invalid credentials' };
        }
    } catch (err) {
        console.error('Error during login:', err);
        return { success: false, error: 'Database error' };
    }
}

module.exports = { mainLogin };