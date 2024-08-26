import { fiveElements } from '/src/front/JS/utils.js';
import { sendMessage, addMessageListener } from '/src/front/JS/ws_client.js';

const bodyContainer = document.getElementById('bodyContainer');
const loginButton = document.getElementById('login');
const usernameInput = document.getElementById('codeEleve');
const passwordInput = document.getElementById('password');

document.addEventListener('DOMContentLoaded', () => {
    fiveElements(bodyContainer);

    addMessageListener((response) => {
        if (response.success) {
            console.log('Successfully logged in');
            window.location.replace("/src/front/HTML/order.html");
        } else {
            console.error('Login failed:', response.error);
        }
    });

    loginButton.addEventListener('click', () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        sendMessage({ login: { username, password } });
    });
});