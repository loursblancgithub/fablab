/*
import {socket} from './websocket_setup.js';

// Use the `socket` object for sending messages, etc.
socket.send("Message specific to admin_orders_fetcher functionality.");
*/

document.addEventListener('DOMContentLoaded', () => {
    const wipeInputs = document.querySelectorAll('input[type="text"], input[type="password"],input[type="quantity"], input[type="checkbox"], input[type="select"], textarea');
    const orderForm = document.getElementById('orderForm');
    const loginForm = document.getElementById('loginForm');

    wipeInputs.forEach(input => {
        input.value = '';
        input.state = false;
    });

    document.getElementById('goodPracticesCheck').checked = false;

    let loginMask = document.createElement('div');
    loginMask.id = 'loginMask';

    // When successfully logged in, removing the login form
    document.addEventListener("keypress", function (event) {
        if (event.key === "f") {
            console.log('Successfully logged in');

            loginForm.style.zIndex = '-15';

            if (orderForm) {
                orderForm.style.transition = 'transform 1.5s';
                orderForm.style.transform = 'translateY(-30vh)';
            }

            document.getElementById('loginForm').classList.add('disappear');
            orderForm.style.filter = 'blur(0)';
            orderForm.style.pointerEvents = 'all';
            loginForm.style.pointerEvents = 'none';
        }
    });

    // Retrieving, formatting and sending the order informations
    document.getElementById('submit').addEventListener('click', function () {
        if (document.getElementById('goodPracticesCheck').checked) {
            const requiredFields = ['orderName', 'orderTool', 'orderQuantity', 'orderMaterial'];

            const allFieldsFilled = requiredFields.every(fieldId => {
                const field = document.getElementById(fieldId);
                return field && field.value.trim() !== '';
            });

            if (allFieldsFilled) {
                let inputsContent = document.querySelectorAll('input[type="text"], input[type="password"], textarea');
                inputsContent.forEach(input => {
                    input.value = input.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                });

                const now = new Date();
                const dateTimeString = now.toString();
                console.log(dateTimeString);

                const orderDetails = {
                    orderName: escapeOutput(document.getElementById('orderName').value),
                    orderTool: escapeOutput(document.getElementById('orderTool').value),
                    orderQuantity: escapeOutput(document.getElementById('orderQuantity').value),
                    orderMaterial: escapeOutput(document.getElementById('orderMaterial').value),
                    orderQuestions: escapeOutput(document.getElementById('orderQuestions').value),
                    goodPracticesCheck: document.getElementById('goodPracticesCheck').checked,
                    orderDateTime: dateTimeString
                };

                console.log(orderDetails);
                /*socket.send(JSON.stringify(orderDetails));*/
            } else {
                alert('Merci de remplir tous les champs obligatoires');
            }
        } else {
            alert('Il faut lire et accepter les points importants afin de pouvoir valider la commande');
        }
    })
});

/*--------------------------

Functions

--------------------------*/


// Input sanitizer
function escapeOutput(toOutput) {
    return toOutput.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}