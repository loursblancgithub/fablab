const url = 'https://sso-portal.isep.fr/';

// Function to get the token
async function getToken() {
    const response = await fetch(url);
    const text = await response.text();
    const token = text.split('token" value="')[1].split('"')[0];
    console.log(token);
    return token;
}

async function login(user, password) {
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
    console.log(response.headers.get('Set-Cookie'));
}

export {login}