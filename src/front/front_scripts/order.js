/*
import {socket} from './websocket_setup.js';

// Use the `socket` object for sending messages, etc.
socket.send("Message specific to admin_orders_fetcher functionality.");
*/

//-------------------------->

//Variables declaration

//-------------------------->

const wipeInputs = document.querySelectorAll('input[type="text"], input[type="password"],input[type="quantity"], input[type="checkbox"], input[type="select"], textarea');
let printParameters;
const expertModeSwitch = document.getElementById('expertModeSwitch');
const orderPrintSettings = document.getElementById('orderPrintSettings');
const orderPrintSettingsTitle = document.getElementById('orderPrintSettingsTitle');

//-------------------------->

//Main logic

//-------------------------->

document.addEventListener('DOMContentLoaded', async () => {

    //Initializing inputs

    wipeInputs.forEach(input => {
        input.value = '';
        input.state = false;
    });

    document.getElementById('goodPracticesCheck').checked = false;

    //Initializing the expert mode switch
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
        if (document.getElementById('goodPracticesCheck').checked) {
            const requiredFields = ['orderName', 'orderTool', 'orderQuantity', 'orderMaterial'];

            const allFieldsFilled = requiredFields.every(fieldId => {
                const field = document.getElementById(fieldId);
                return field && field.value.trim() !== '';
            });

            if (allFieldsFilled) {

                const now = new Date().toLocaleString().replace(',', '');
                const dateTimeString = now.toString();

                const orderDetails = {
                    orderName: escapeOutput(document.getElementById('orderName').value),
                    orderTool: escapeOutput(document.getElementById('orderTool').value),
                    orderQuantity: escapeOutput(document.getElementById('orderQuantity').value),
                    orderMaterial: escapeOutput(document.getElementById('orderMaterial').value),
                    orderQuestions: escapeOutput(document.getElementById('orderQuestions').value),
                    goodPracticesCheck: document.getElementById('goodPracticesCheck').checked,
                    expertModeCheck: expertModeSwitch.checked,
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

// Function to retrieve print parameters from print_parameters.json
async function fetchPrintParameters() {
    try {
        const response = await fetch('../JSON/print_parameters.json');
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching print parameters:', error);
        return null;
    }
}

// Function to initialize the slider
function initializeSlider() {
    const expertModeSwitch = document.getElementById('expertModeSwitch');
    const slider = document.querySelector('.slider');

    // Function to update slider style based on switch state
    function updateSliderStyle() {
        if (expertModeSwitch.checked) {
            slider.style.backgroundColor = '#2E4798'; // Expert mode on
        } else {
            slider.style.backgroundColor = '#ccc'; // Expert mode off
        }
    }

    // Set default state and style
    expertModeSwitch.checked = false;
    updateSliderStyle();

    // Add event listener to toggle style on change
    expertModeSwitch.addEventListener('change', updateSliderStyle);
}

// Function to generate HTML for the parameters
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