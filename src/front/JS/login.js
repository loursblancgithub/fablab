import {fiveElements, showCustomAlert} from '/src/front/JS/utils.js';
import {sendMessage, addMessageListener} from '/src/front/JS/ws_client.js';

const bodyContainer = document.getElementById('bodyContainer');
const loginButton = document.getElementById('login');
const usernameInput = document.getElementById('codeEleve');
const passwordInput = document.getElementById('password');

document.addEventListener('DOMContentLoaded', () => {
    fiveElements(bodyContainer);
    usernameInput.focus();

    loginButton.addEventListener('click', () => {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (!username || !password) {
            showCustomAlert('Veuillez rentrer votre nom d\'utilisateur et votre mot de passe', 'red');
            return;
        }

        sendMessage({checkUser: {username}});
        addMessageListener((response) => {
            if (response.userExists) {
                sendMessage({login: {username, password}});
            } else {
                showTermsPopup(() => {
                    sendMessage({login: {username, password}});
                });
            }

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
});

function showTermsPopup(onAccept) {
    const pageMask = document.createElement('div');
    pageMask.className = 'pageMask';
    document.body.appendChild(pageMask);
    console.log('showTermsPopup');

    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <p>Vous devez accepter les termes et conditions pour vous connecter au site</p>
        <button id="consultButton">Consulter</button>
        <button id="acceptButton">Accepter</button>
        <button id="refuseButton">Refuser</button>
    `;
    document.body.appendChild(popup);

    document.getElementById('consultButton').addEventListener('click', () => {
        window.open('/src/front/HTML/terms_conditions.html', '_blank');
    });

    document.getElementById('acceptButton').addEventListener('click', () => {
        onAccept();
        document.body.removeChild(popup);
        document.body.removeChild(pageMask);
    });

    document.getElementById('refuseButton').addEventListener('click', () => {
        document.body.removeChild(popup);
        document.body.removeChild(pageMask);
    });
}