/*
import {socket} from './websocket_setup.js';

// Use the `socket` object for sending messages, etc.
socket.send("Message specific to admin_orders_fetcher functionality.");
*/

document.addEventListener('DOMContentLoaded', () => {
    const contentContainer = document.getElementById('contentContainer');

    const orderDataDummy = [{
        "orderName": "Custom Widget",
        "orderState": "billed",
        "orderClient": "Jane Doe",
        "orderClientEmail": "jane.doe@example.com",
        "orderMaterial": "Aluminum",
        "orderTotalWeight": "5kg",
        "orderQuantity": 100,
        "orderPrice": "$2000"
    },
        {
            "orderName": "Airbus A220",
            "orderState": "printed",
            "orderClient": "John Doe",
            "orderClientEmail": "john.doe@example.com",
            "orderMaterial": "PLA",
            "orderTotalWeight": "300g",
            "orderQuantity": 1,
            "orderPrice": "8€"
        },
        {
            "orderName": "Airbus A220",
            "orderState": "sliced",
            "orderClient": "John Doe",
            "orderClientEmail": "john.doe@example.com",
            "orderMaterial": "PLA",
            "orderTotalWeight": "300g",
            "orderQuantity": 1,
            "orderPrice": "8€"
        },
        {
            "orderName": "Airbus A220",
            "orderState": "printing",
            "orderClient": "John Doe",
            "orderClientEmail": "john.doe@example.com",
            "orderMaterial": "PLA",
            "orderTotalWeight": "300g",
            "orderQuantity": 1,
            "orderPrice": "8€"
        }];

    /*// Use the `socket` object for sending messages, etc.
    socket.send("Requesting order data");

    socket.addEventListener('message', (event) => {
        // Assuming the server sends a JSON string with order data
        const orderData = JSON.parse(event.data);
    });*/
    document.getElementById('sidePanelStateButtonAll').addEventListener('click', () => {
        console.log('Button clicked');

        contentContainer.innerHTML = '';

        // Dynamically create elements based on the order data
        orderDataDummy.forEach(function (orderElement) {
            const orderElementDiv = document.createElement('div');
            orderElementDiv.classList.add('orderElement');

            const orderElementHeader = document.createElement('div');
            orderElementHeader.classList.add('orderElementHeader');

            const orderElementHeaderColumn1 = document.createElement('div');
            orderElementHeaderColumn1.classList.add('orderElementHeaderColumn');

            // Order Name
            const orderNameElement = document.createElement('div');
            orderNameElement.textContent = `${orderElement.orderName}`;
            orderNameElement.classList.add('orderElementText');
            orderElementHeaderColumn1.appendChild(orderNameElement);

            // Client Name
            const orderClientElement = document.createElement('div');
            orderClientElement.textContent = `${orderElement.orderClient}`;
            orderClientElement.classList.add('orderElementText');
            orderElementHeaderColumn1.appendChild(orderClientElement);

            orderElementHeader.appendChild(orderElementHeaderColumn1);

            const orderElementHeaderColumn2 = document.createElement('div');
            orderElementHeaderColumn2.classList.add('orderElementHeaderColumn');
            orderElementHeaderColumn2.style.justifyContent = 'flex-start';

            // Order State
            const orderStateDropdown = createStateDropdown(orderElement.orderState);
            orderStateDropdown.style.margin = '1vh 0 1vh 0';
            orderElementHeaderColumn2.appendChild(orderStateDropdown);

            orderElementHeader.appendChild(orderElementHeaderColumn2);
            orderElementDiv.appendChild(orderElementHeader);

            // Client Email
            const orderClientEmailElement = document.createElement('div');
            orderClientEmailElement.textContent = `E-mail: ${orderElement.orderClientEmail}`;
            orderClientEmailElement.classList.add('orderElementText');
            orderElementDiv.appendChild(orderClientEmailElement);

            // Material
            const orderMaterialElement = document.createElement('div');
            orderMaterialElement.textContent = `Matériau: ${orderElement.orderMaterial}`;
            orderMaterialElement.classList.add('orderElementText');
            orderElementDiv.appendChild(orderMaterialElement);

            // Total Weight
            const orderTotalWeightElement = document.createElement('div');
            orderTotalWeightElement.textContent = `Poids total: ${orderElement.orderTotalWeight}`;
            orderTotalWeightElement.classList.add('orderElementText');
            orderElementDiv.appendChild(orderTotalWeightElement);

            // Quantity
            const orderQuantityElement = document.createElement('div');
            orderQuantityElement.textContent = `Quantité: ${orderElement.orderQuantity}`;
            orderQuantityElement.classList.add('orderElementText');
            orderElementDiv.appendChild(orderQuantityElement);

            // Price
            const orderPriceElement = document.createElement('div');
            orderPriceElement.textContent = `Price: ${orderElement.orderPrice}`;
            orderPriceElement.classList.add('orderElementText');
            orderElementDiv.appendChild(orderPriceElement);

            // Append the order element to the content container
            contentContainer.appendChild(orderElementDiv);
        });
    });
});

// Function to create the order state dropdown
function createStateDropdown(currentState) {
    const stateOptions = {
        billed: 'Facturé',
        printed: 'Imprimé',
        sliced: 'Slicé',
        printing: 'En cours d\'impression'
    };

    const dropdown = document.createElement('select');
    dropdown.classList.add('orderStateDropdown');

    Object.entries(stateOptions).forEach(([value, text]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        option.selected = value === currentState;
        option.style.fontFamily = 'Lexend Deca, sans-serif';
        dropdown.appendChild(option);
    });

    // Set initial background and font color based on the current state
    dropdown.style.backgroundColor = getColorForState(currentState);
    dropdown.style.color = getColorForState(currentState, true);

    // Event listener for changing the dropdown value and colors
    dropdown.addEventListener('change', function () {
        this.style.backgroundColor = getColorForState(this.value);
        this.style.color = getColorForState(this.value, true);
    });

    dropdown.style.width = 'fit-content';

    return dropdown;
}

function getColorForState(state, fontColor = false) {
    const stateColorMapping = {
        billed: {background: '#215a6c', font: '#ffffff'},
        printed: {background: '#5a3286', font: '#ffffff'},
        sliced: {background: '#0a53a8', font: '#ffffff'},
        printing: {background: '#ffe5a0', font: '#000000'}
    };

    if (fontColor) {
        return stateColorMapping[state] ? stateColorMapping[state].font : '#000000'; // Default font color
    } else {
        return stateColorMapping[state] ? stateColorMapping[state].background : '#bdbdbd'; // Default background color
    }
}

//Par défaut tout est affiché, quand on récup on récup toutes les commandes,
// ajouter un truc qui les trie déjà en statuts généraux au début
