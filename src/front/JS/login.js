import {fiveElements} from '/src/front/JS/utils.js';
import {sendMessage, addMessageListener} from '/src/front/JS/ws_client.js';

const bodyContainer = document.getElementById('bodyContainer');
const loginButton = document.getElementById('login');
const usernameInput = document.getElementById('codeEleve');
const passwordInput = document.getElementById('password');

document.addEventListener('DOMContentLoaded', () => {
    fiveElements(bodyContainer);

    loginButton.addEventListener('click', () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        sendMessage({login: {username, password}});

        addMessageListener((response) => {
            if (response.redirect) {
                window.location.replace(`/src/front/HTML/${response.redirect}`);
            } else {
                showCustomAlert('Erreur lors de l\'envoi de la commande, merci de réessayer plus tard');
            }
        });
    });
});