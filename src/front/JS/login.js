import { fiveElements, showCustomAlert } from '/src/front/JS/utils.js';
import { sendMessage, addMessageListener } from '/src/front/JS/ws_client.js';

const bodyContainer = document.getElementById('bodyContainer');
const loginButton = document.getElementById('login');
const usernameInput = document.getElementById('codeEleve');
const passwordInput = document.getElementById('password');

document.addEventListener('DOMContentLoaded', () => {
    fiveElements(bodyContainer);

    loginButton.addEventListener('click', () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        sendMessage({ login: { username, password } });

        addMessageListener((response) => {
            if (response.redirect) {
                if (response.cookie) {
                    document.cookie = `fablabCookie=${response.cookie}; path=/`;
                }
                window.location.replace(`/src/front/HTML/${response.redirect}`);
            } else {
                showCustomAlert('Erreur de connexion, merci de réessayer plus tard', "orange");
            }
        });
    });
});