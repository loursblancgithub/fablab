import {removeAllChildren} from "../../scripts/utils.js";
import {applyHoverIfNecessary} from "../../scripts/utils.js";

/*
import {socket} from './websocket_setup.js';

// Use the `socket` object for sending messages, etc.
socket.send("Message specific to admin_orders_fetcher functionality.");
*/


const stateOptions = {
    pending: 'En attente',
    billed: 'Facturé',
    printed: 'Imprimé',
    sliced: 'Slicé',
    printing: 'En cours d\'impression',
    finished: 'Terminé'
}

const orderDataDummy = [
    {
        "id": 0,
        "orderName": "Cirrus Vision Jet",
        "orderState": "pending",
        "orderClient": "Jane Doe",
        "orderClientEmail": "jane.doe@example.com",
        "orderMaterial": "Aluminum",
        "orderTotalWeight": "5kg",
        "orderQuantity": 100,
        "orderPrice": "$2000",
        "details": false
    },
    {
        "id": 1,
        "orderName": "Airbus A220",
        "orderState": "finished",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": "300g",
        "orderQuantity": 1,
        "orderPrice": "8€",
        "details": false
    },
    {
        "id": 2,
        "orderName": "Boeing 787",
        "orderState": "sliced",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": "300g",
        "orderQuantity": 1,
        "orderPrice": "8€",
        "details": false
    },
    {
        "id": 3,
        "orderName": "Embraer E190",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": "300g",
        "orderQuantity": 1,
        "orderPrice": "8€",
        "orderQuestion": "Faites attention les winglets sont fragiles",
        "details": false
    }
];


const contentContainer = document.getElementById('contentContainer');

document.addEventListener('DOMContentLoaded', () => {

    /*// Use the `socket` object for sending messages, etc.
    socket.send("Requesting order data");

    socket.addEventListener('message', (event) => {
        // Assuming the server sends a JSON string with order data
        const orderData = JSON.parse(event.data);
    });*/


    document.querySelectorAll('.sidePanelStateButton').forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            document.querySelectorAll('.sidePanelStateButton').forEach(btn => {
                btn.classList.remove('active');
            });

            // Add active class to the clicked buttons
            this.classList.add('active');
        });
    });


    //afficher toutes les commandes par défaut
    document.getElementById('sidePanelStateButtonAll').classList.add('active');
    createOrderElements(orderDataDummy);

    document.getElementById('sidePanelStateButtonAll').addEventListener('click', () => {
        console.log('Button clicked');

        contentContainer.innerHTML = '';
        createOrderElements(orderDataDummy);
    });

    document.getElementById('sidePanelStateButtonToDo').addEventListener('click', () => {
        console.log('Button clicked');

        contentContainer.innerHTML = '';
        createOrderElements(orderDataDummy.filter(order => order.orderState === "pending"));
    });

    document.getElementById('sidePanelStateButtonOngoing').addEventListener('click', () => {
        console.log('Button clicked');

        contentContainer.innerHTML = '';
        createOrderElements(orderDataDummy.filter(order => order.orderState !== "pending" && order.orderState !== "finished"));
    });

    document.getElementById('sidePanelStateButtonFinished').addEventListener('click', () => {
        console.log('Button clicked');

        contentContainer.innerHTML = '';
        createOrderElements(orderDataDummy.filter(order => order.orderState === "finished"));
    });
});

//-------------------------->

//Functions

//-------------------------->

// Dynamically create elements based on the order data
function createOrderElements(orderElements) {
    orderElements.sort((a, b) => b.id - a.id);
    orderElements.forEach(function (orderElement) {
        const orderElementDiv = document.createElement('div');
        orderElementDiv.classList.add('orderElement');

        const orderElementHeader = document.createElement('div');
        orderElementHeader.classList.add('orderElementHeader');

        const orderElementHeaderColumn1 = document.createElement('div');
        orderElementHeaderColumn1.classList.add('orderElementHeaderColumn');
        orderElementHeaderColumn1.id = 'orderElementHeaderColumn1';

        // Order Name
        const orderNameElement = document.createElement('div');
        orderNameElement.textContent = `${orderElement.orderName}`;
        orderNameElement.classList.add('orderElementText');
        applyHoverIfNecessary(orderNameElement, `${orderElement.orderName}`);
        orderElementHeaderColumn1.appendChild(orderNameElement);

        // Client Name
        const orderClientElement = document.createElement('div');
        orderClientElement.textContent = `${orderElement.orderClient}`;
        orderClientElement.classList.add('orderElementText');
        applyHoverIfNecessary(orderClientElement, `${orderElement.orderClient}`);
        orderElementHeaderColumn1.appendChild(orderClientElement);

        orderElementHeader.appendChild(orderElementHeaderColumn1);

        const orderElementHeaderColumn2 = document.createElement('div');
        orderElementHeaderColumn2.classList.add('orderElementHeaderColumn');
        orderElementHeaderColumn2.style.justifyContent = 'flex-start';

        // Order State
        const orderStateDropdown = createStateDropdown(orderElement.orderState);
        orderStateDropdown.style.margin = '1vh 0 1vh 0';
        applyHoverIfNecessary(orderStateDropdown, stateOptions[orderElement.orderState]);
        orderElementHeaderColumn2.appendChild(orderStateDropdown);

        orderElementHeader.appendChild(orderElementHeaderColumn2);
        orderElementDiv.appendChild(orderElementHeader);

        // Details
        const orderDetailsElement = document.createElement('button');
        orderDetailsElement.classList.add('orderElementDetails');

        const buttonText = document.createElement('span');
        buttonText.textContent = 'Détails';
        buttonText.classList.add('orderElementDetailsText');

        const buttonIcon = document.createElement('span');
        buttonIcon.classList.add('orderElementDetailsIcon');
        orderElement.details ? buttonIcon.textContent = '⯅' : buttonIcon.textContent = '⯆';

        orderDetailsElement.appendChild(buttonText);
        orderDetailsElement.appendChild(buttonIcon);

        orderDetailsElement.addEventListener('click', () => {
            orderElement.details = !orderElement.details;
            console.log("Button clicked");
            removeAllChildren(orderElementDiv);
            removeAllChildren(contentContainer);
            createOrderElements(orderElements);

            if (orderElement.details) {
                orderElementDiv.classList.add('expanded');
            } else {
                orderElementDiv.classList.remove('expanded');
            }
        });

        if (orderElement.details) {
            // Client Email
            const orderClientEmailElement = document.createElement('div');
            orderClientEmailElement.textContent = `E-mail: ${orderElement.orderClientEmail}`;
            applyHoverIfNecessary(orderClientEmailElement, `${orderElement.orderClientEmail}`);
            orderClientEmailElement.classList.add('orderElementText');
            //orderClientEmailElement.classList.add('orderResponsive');

            orderElementDiv.appendChild(orderClientEmailElement);

            // Material
            const orderMaterialElement = document.createElement('div');
            orderMaterialElement.textContent = `Matériau: ${orderElement.orderMaterial}`;
            orderMaterialElement.classList.add('orderElementText');
            //orderMaterialElement.classList.add('orderResponsive');

            orderElementDiv.appendChild(orderMaterialElement);

            // Total Weight
            const orderTotalWeightElement = document.createElement('div');
            orderTotalWeightElement.textContent = `Poids total: ${orderElement.orderTotalWeight}`;
            orderTotalWeightElement.classList.add('orderElementText');
            //orderTotalWeightElement.classList.add('orderResponsive');
            orderElementDiv.appendChild(orderTotalWeightElement);

            // Quantity
            const orderQuantityElement = document.createElement('div');
            orderQuantityElement.textContent = `Quantité: ${orderElement.orderQuantity}`;
            orderQuantityElement.classList.add('orderElementText');
            //orderQuantityElement.classList.add('orderResponsive');
            orderElementDiv.appendChild(orderQuantityElement);

            // Price
            const orderPriceElement = document.createElement('div');
            orderPriceElement.textContent = `Price: ${orderElement.orderPrice}`;
            orderPriceElement.classList.add('orderElementText');
            //orderPriceElement.classList.add('orderResponsive');
            orderElementDiv.appendChild(orderPriceElement);

            orderDetailsElement.appendChild(buttonText);
            orderDetailsElement.appendChild(buttonIcon);
        }

        orderElementDiv.appendChild(orderDetailsElement);
        // Append the order element to the content container
        contentContainer.appendChild(orderElementDiv);
    })
}


// Function to create the order state dropdown
function createStateDropdown(currentState) {
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

// Apply colors to the dropdown
function getColorForState(state, fontColor = false) {
    const stateColorMapping = {
        pending: {background: '#215a6c', font: '#ffffff', frText: "En attente"},
        billed: {background: '#5A3286', font: '#ffffff', frText: "En cours"},
        printed: {background: '#5A3286', font: '#ffffff', frText: "En cours"},
        sliced: {background: '#5A3286', font: '#ffffff', frText: "En cours"},
        printing: {background: '#5A3286', font: '#ffffff', frText: "En cours"},
        finished: {background: '#0A53A8', font: '#ffffff', frText: "Terminée"},
    };

    if (fontColor) {
        return stateColorMapping[state] ? stateColorMapping[state].font : '#000000'; // Default font color
    } else {
        return stateColorMapping[state] ? stateColorMapping[state].background : '#bdbdbd'; // Default background color
    }
}

//Par défaut tout est affiché, quand on récup on récup toutes les commandes,
// ajouter un truc qui les trie déjà en statuts généraux au début
