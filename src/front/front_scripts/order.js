/*
import {socket} from './websocket_setup.js';

// Use the `socket` object for sending messages, etc.
socket.send("Message specific to admin_orders_fetcher functionality.");
*/

//-------------------------->

//Constants

//-------------------------->

// Define the parameters tree
const parametersTree = {
    "Vitesse": {
        "Inner Wall Speed": {defaultValue: 50, unit: "mm/s"},
        "Outer Wall Speed": {defaultValue: 40, unit: "mm/s"},
        "Infill Speed": {defaultValue: 60, unit: "mm/s"}
    },
    "Rigidite": {
        "Infill Pattern": {
            type: "select",
            options: ["Grid", "Triangles", "Lines"],
            defaultValue: "Grid"
        },
        "Infill Density": {defaultValue: 20, unit: "%"}
    },
    "Supports": {
        "Enable Supports": {defaultValue: "No", unit: "", type: "checkbox"},
        "Build Plate Only": {defaultValue: "No", unit: "", dependsOn: "Enable Supports"},
        "Support Infill Density": {defaultValue: 15, unit: "%", dependsOn: "Enable Supports"}
    }
};

const wipeInputs = document.querySelectorAll('input[type="text"], input[type="password"],input[type="quantity"], input[type="checkbox"], input[type="select"], textarea');
const expertModeSwitch = document.getElementById('expertModeSwitch');
const orderPrintSettings = document.getElementById('orderPrintSettings');
const orderPrintSettingsTitle = document.getElementById('orderPrintSettingsTitle');

//-------------------------->

//Main logic

//-------------------------->

document.addEventListener('DOMContentLoaded', () => {

    //Initializing inputs

    wipeInputs.forEach(input => {
        input.value = '';
        input.state = false;
    });

    document.getElementById('goodPracticesCheck').checked = false;

    //Initializing the expert mode switch
    initializeSlider();

    expertModeSwitch.addEventListener('change', function () {
        orderPrintSettings.innerHTML = '';
        orderPrintSettings.style.display = this.checked ? 'block' : 'none';
        orderPrintSettings.style.padding = this.checked ? '0.1vh 0.5vw 0.5vw 0.5vw' : '0';

        orderPrintSettingsTitle.style.display = this.checked ? 'block' : 'none';

        generateParametersHTML(parametersTree, orderPrintSettings);
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
                // Create a select element
                const select = document.createElement('select');
                select.id = key + 'Value';
                select.classList.add('inputStyle');

                // Populate the select element with options
                value.options.forEach(optionValue => {
                    const option = document.createElement('option');
                    option.value = optionValue;
                    option.textContent = optionValue;
                    select.appendChild(option);
                });

                // Set the default selected option if specified
                if (value.defaultValue) {
                    select.value = value.defaultValue;
                }

                // Append the select element to the container
                container.appendChild(select);
            } else {
                // Create and append input element only if not handling a select
                const input = document.createElement('input');
                input.id = key + 'Value';
                input.type = value.type || 'text';
                input.classList.add('inputStyle');

                if (input.type === 'checkbox') {
                    input.checked = value.defaultValue === "Yes";
                } else {
                    input.value = value.defaultValue;
                }

                container.appendChild(input);

                if (value.unit) {
                    const unit = document.createElement('span');
                    unit.textContent = value.unit;
                    unit.style.fontSize = '0.9em';
                    container.appendChild(unit);
                }
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