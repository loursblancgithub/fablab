import {logout, showCustomAlert, sanitizeOutput} from "/src/front/JS/utils.js";
import {sendMessage, addMessageListener, sendOrder} from "/src/front/JS/ws_client.js";

// Variables declaration
const wipeInputs = document.querySelectorAll('input[type="text"], input[type="password"],input[type="quantity"], input[type="checkbox"], input[type="select"], textarea');
let printParameters;
const expertModeSwitch = document.getElementById('expertModeSwitch');
const orderPrintSettings = document.getElementById('orderPrintSettings');
const orderPrintSettingsTitle = document.getElementById('orderPrintSettingsTitle');

// Main logic
document.addEventListener('DOMContentLoaded', async () => {
    logout(document.getElementById('logoutButton'));

    // Initializing inputs
    wipeInputs.forEach(input => {
        input.value = '';
        input.state = false;
    });

    document.getElementById('goodPracticesCheck').checked = false;

    // Initializing the expert mode switch
    initializeSlider();

    printParameters = await fetchPrintParameters();

    expertModeSwitch.addEventListener('change', function () {
        orderPrintSettings.innerHTML = '';
        orderPrintSettings.style.display = this.checked ? 'block' : 'none';
        orderPrintSettings.style.padding = this.checked ? '0.1vh 0.5vw 0.5vw 0.5vw' : '0';

        orderPrintSettingsTitle.style.display = this.checked ? 'block' : 'none';

        generateParametersHTML(printParameters, orderPrintSettings);
    });

    // Retrieving, formatting and sending the order informations
    document.getElementById('submit').addEventListener('click', function () {
        console.log('Submit button clicked'); // Debug log

        const requiredFields = ['orderName', 'orderTool', 'orderQuantity', 'orderMaterial'];

        const allFieldsFilled = requiredFields.every(fieldId => {
            const field = document.getElementById(fieldId);
            return field && field.value.trim() !== '';
        });

        const file = document.getElementById('orderFile').files[0];

        if (allFieldsFilled) {
            if (file) {
                const now = new Date();
                const options = { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                const parisTimeString = now.toLocaleString('fr-FR', options).replace(',', '');
                const dateTimeString = parisTimeString.toString();

                if (document.getElementById('goodPracticesCheck').checked) {
                    // Retrieve client information using cookie
                    const cookie = document.cookie.split('; ').find(row => row.startsWith('fablabCookie=')).split('=')[1];
                    sendMessage({getUser: {cookie}});

                    addMessageListener(response => {
                        let user;
                        if (response.user) {
                            user = response.user;
                        }

                        sendOrder({
                            orderName: sanitizeOutput(document.getElementById('orderName').value),
                            orderTool: sanitizeOutput(document.getElementById('orderTool').value),
                            orderMaterial: sanitizeOutput(document.getElementById('orderMaterial').value),
                            orderColor: sanitizeOutput(document.getElementById('orderColor').value),
                            orderQuantity: parseInt(document.getElementById('orderQuantity').value),
                            orderQuestions: sanitizeOutput(document.getElementById('orderQuestions').value),
                            orderDateTime: dateTimeString,
                            orderClient: user.client,
                            orderGoodPracticesCheck: document.getElementById('goodPracticesCheck').checked,
                            orderAdditionalParameters: {}
                        }, file);

                        addMessageListener((response) => {
                            if (response.redirect) {
                                showCustomAlert('Commande envoyée avec succès !', "green");
                                setTimeout(() => {
                                    window.location.replace(`/src/front/HTML/${response.redirect}`);
                                }, 2000);
                            } else if (response.error) {
                                showCustomAlert('Erreur lors de l\'envoi du fichier, merci de réessayer plus tard', "red");
                            } else {
                                showCustomAlert('Erreur lors de l\'envoi de la commande, merci de réessayer plus tard', "red");
                            }
                        });

                    });
                } else {
                    showCustomAlert('Il faut lire et accepter les points importants afin de pouvoir valider la commande !', "red");
                }
            } else {
                showCustomAlert('Merci de joindre un fichier à votre commande !', "red");
            }
        } else {
            showCustomAlert('Merci de remplir tous les champs obligatoires !', "red");
        }
    });
});

// Functions
async function fetchPrintParameters() {
    try {
        const response = await fetch('../JSON/print_parameters.json');
        if (!response.ok) {
            console.error(`Network response was not ok: ${response.statusText}`)
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching print parameters:', error);
        return null;
    }
}

function initializeSlider() {
    const expertModeSwitch = document.getElementById('expertModeSwitch');
    const slider = document.querySelector('.slider');

    function updateSliderStyle() {
        if (expertModeSwitch.checked) {
            slider.style.backgroundColor = '#2E4798';
        } else {
            slider.style.backgroundColor = '#ccc';
        }
    }

    expertModeSwitch.checked = false;
    updateSliderStyle();
    expertModeSwitch.addEventListener('change', updateSliderStyle);
}

function generateParametersHTML(parameters, parentElement, depth = 0) {
    Object.entries(parameters).forEach(([key, value]) => {
        if (typeof value === "object" && value.defaultValue !== undefined) {
            const container = document.createElement('div');
            container.className = 'parameterItem';
            container.style.paddingLeft = `${20 * depth}px`;

            const label = document.createElement('label');
            label.htmlFor = key;
            label.textContent = key;
            label.style.fontSize = '0.9em';
            container.appendChild(label);

            if (value.type === "select") {
                const select = document.createElement('select');
                select.id = key + 'Value';
                select.classList.add('expertModeInput');
                select.classList.add('inputStyle');

                value.options.forEach(optionValue => {
                    const option = document.createElement('option');
                    option.value = optionValue;
                    option.textContent = optionValue;
                    select.appendChild(option);
                });

                if (value.defaultValue) {
                    select.value = value.defaultValue;
                }

                container.appendChild(select);
            } else {
                if (value.unit) {
                    const unit = document.createElement('span');
                    unit.textContent = ` (${value.unit})`;
                    unit.style.fontSize = '0.9em';
                    unit.style.display = 'inline-block';
                    container.appendChild(unit);
                }

                const input = document.createElement('input');
                input.id = key + 'Value';
                input.type = value.type || 'text';
                input.classList.add('inputStyle');
                input.size = 10;

                if (input.type === 'checkbox') {
                    input.checked = value.defaultValue === "Yes";
                } else {
                    input.value = value.defaultValue;
                }

                container.appendChild(input);
            }

            parentElement.appendChild(container);
        } else if (typeof value === "object") {
            const categoryContainer = document.createElement('div');
            categoryContainer.className = 'categoryContainer';
            const categoryTitle = document.createElement('div');
            categoryTitle.className = 'categoryTitle';
            categoryTitle.style.cursor = 'pointer';
            categoryTitle.style.color = '#2E4798';
            categoryTitle.textContent = key;
            categoryTitle.style.paddingLeft = `${20 * depth}px`;

            categoryContainer.appendChild(categoryTitle);
            parentElement.appendChild(categoryContainer);

            generateParametersHTML(value, categoryContainer, depth + 1);
        }
    });
}