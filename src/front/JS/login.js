import {fiveElements} from "./utils.js";
import {login} from "./login_handler.js";

const bodyContainer = document.getElementById('bodyContainer');
document.addEventListener('DOMContentLoaded', () => {
    fiveElements(bodyContainer);
    document.getElementById('login').addEventListener('click', function (event) {
        login(document.getElementById('codeEleve').value, document.getElementById('password').value).then(
            () => {
                window.location.href = 'src/front/HTML/order.html';
            }
        );
    });
});