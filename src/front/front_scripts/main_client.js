import {setTimeoutWithRAF} from "/src/scripts/utils.js";
/*
import {socket} from './websocket_setup.js';

// Use the `socket` object for sending messages, etc.
socket.send("Message specific to admin_orders_fetcher functionality.");
*/

const orderDataDummy = [{
    "orderName": "Cirrus Vision Jet",
    "orderState": "pending",
    "orderClient": "Jane Doe",
    "orderClientEmail": "jane.doe@example.com",
    "orderMaterial": "Aluminum",
    "orderTotalWeight": "5kg",
    "orderQuantity": 100,
    "orderPrice": "$2000",
    "orderQuestion": "Beautiful but underpowered lul"
},
    {
        "orderName": "Airbus A220",
        "orderState": "finished",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": "300g",
        "orderQuantity": 1,
        "orderPrice": "8€",
        "orderQuestion": "Bombardier on vous aime"
    },
    {
        "orderName": "Boeing 787",
        "orderState": "sliced",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": "300g",
        "orderQuantity": 1,
        "orderPrice": "8€",
        "orderQuestion": "Belle machine faite par des sagouins"
    },
    {
        "orderName": "Embraer E190",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": "300g",
        "orderQuantity": 1,
        "orderPrice": "8€",
        "orderQuestion": "Faites attention les winglets sont fragiles"
    },
    {
        "orderName": "Figurine Harry Potterdsdsdsds",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": "300g",
        "orderQuantity": 1,
        "orderPrice": "8€",
        "orderQuestion": "Faites attention les winglets sont fragiles"
    },
    {
        "orderName": "Trophée",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": "300g",
        "orderQuantity": 1,
        "orderPrice": "8€",
        "orderQuestion": "Faites attention les winglets sont fragiles"
    },
    {
        "orderName": "Embraer E190",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": "300g",
        "orderQuantity": 1,
        "orderPrice": "8€",
        "orderQuestion": "Faites attention les winglets sont fragiles"
    },
    {
        "orderName": "Embraer E190",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": "300g",
        "orderQuantity": 1,
        "orderPrice": "8€",
        "orderQuestion": "Faites attention les winglets sont fragiles"
    },
    {
        "orderName": "Embraer E190",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": "300g",
        "orderQuantity": 1,
        "orderPrice": "8€",
        "orderQuestion": "Faites attention les winglets sont fragiles"
    }];


const orderContainer = document.getElementById('orderContainer');
const newOrder = document.getElementById('newOrder');
const ordersList = document.getElementById('ordersList');

/*--------------------------

Main logic

--------------------------*/

document.addEventListener('DOMContentLoaded', () => {

    // If clicking #newOrder, redirect to the order page
    newOrder.addEventListener('click', function () {
        window.location.href = "../HTML/order.html";
    });

    // Sort order list
    // By state
    orderDataDummy.sort((a, b) => {
        if (a.orderState === 'pending') return -1;
        if (b.orderState === 'pending') return 1;
        if (a.orderState === 'finished') return 1;
        if (b.orderState === 'finished') return -1;
        return 0;
    });

    // Fill order list
    orderDataDummy.forEach((orderElement) => {
        const ordersListElement = document.createElement('div');
        ordersListElement.classList.add('ordersListElement');
        ordersListElement.classList.add('hoverButton');

        const ordersListElementName = document.createElement('div');
        ordersListElementName.classList.add('ordersListElementName');
        ordersListElementName.textContent = orderElement.orderName;

        const ordersListElementState = document.createElement('div');
        ordersListElementState.classList.add('ordersListElementState');
        ordersListElementState.style.backgroundColor = getColorForState(orderElement.orderState).background;
        ordersListElementState.style.color = getColorForState(orderElement.orderState).font;
        ordersListElementState.textContent = getColorForState(orderElement.orderState).frText;

        ordersListElement.appendChild(ordersListElementName);
        ordersListElement.appendChild(ordersListElementState);

        ordersListElement.addEventListener('click', () => {
            displayOrderDetails(orderElement);
        });

        ordersList.appendChild(ordersListElement);
    });

    // When clicking on any element with the class .ordersListElement, add the class .active to change the background color
    document.querySelectorAll('.ordersListElement').forEach(element => {
        element.addEventListener('click', function () {
            document.querySelectorAll('.ordersListElement').forEach(el => el.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

/*--------------------------

Functions

--------------------------*/

// Function to display order details in #orderContainer
function displayOrderDetails(order) {

    if (document.getElementById('orderElement')) {
        document.getElementById('orderElement').remove();
    }

    const orderElementDiv = document.createElement('div');
    orderElementDiv.classList.add('orderElement');
    orderElementDiv.id = 'orderElement';

    // Order Element Body
    const orderElementBody = document.createElement('div');
    orderElementBody.classList.add('orderElementBody');

    // Order Element Summary Container (Left part)
    const orderElementSummary = document.createElement('div');
    orderElementSummary.classList.add('orderElementSummary');
    orderElementSummary.style.width = '50%';

    const orderNameElement = document.createElement('div');
    orderNameElement.textContent = `${order.orderName}`;
    orderNameElement.style.fontSize = '2em';
    orderElementSummary.appendChild(orderNameElement);

    const orderStateElement = document.createElement('div');
    orderStateElement.classList.add('orderStateElement');
    orderStateElement.textContent = `${order.orderState}`;
    orderStateElement.style.color = getColorForState(order.orderState).background;
    orderStateElement.textContent = getColorForState(order.orderState).frText;
    orderElementSummary.appendChild(orderStateElement);

    const orderElementSummaryTitle = document.createElement('div');
    orderElementSummaryTitle.textContent = 'Vue d\'ensemble';
    orderElementSummaryTitle.classList.add('orderElementSummaryTitle');
    orderElementSummary.appendChild(orderElementSummaryTitle);

    const orderElementDetails = document.createElement('div');
    orderElementDetails.classList.add('orderElementDetails');

    // Order Details
    const orderElementSummaryMaterial = document.createElement('div');
    orderElementSummaryMaterial.textContent = `Matériau: ${order.orderMaterial}`;
    orderElementDetails.appendChild(orderElementSummaryMaterial);

    const orderElementSummaryTotalWeight = document.createElement('div');
    orderElementSummaryTotalWeight.textContent = `Poids total: ${order.orderTotalWeight}`;
    orderElementDetails.appendChild(orderElementSummaryTotalWeight);

    const orderElementSummaryQuantity = document.createElement('div');
    if (order.orderQuantity > 1) {
        orderElementSummaryQuantity.textContent = `${order.orderQuantity} pièces`;
    } else {
        orderElementSummaryQuantity.textContent = `${order.orderQuantity} pièce`;
    }
    orderElementDetails.appendChild(orderElementSummaryQuantity);

    const orderElementSummaryPrice = document.createElement('div');
    orderElementSummaryPrice.textContent = `Prix: ${order.orderPrice}`;
    orderElementDetails.appendChild(orderElementSummaryPrice);

    orderElementSummary.appendChild(orderElementDetails);

    orderElementBody.appendChild(orderElementSummary);

    // Order files/chat container (Right part)

    // Header
    const orderElementFilesMessage = document.createElement('div');
    orderElementFilesMessage.classList.add('orderElementFilesMessage');

    const orderElementFilesMessageHeader = document.createElement('div');
    orderElementFilesMessageHeader.classList.add('orderElementFilesMessageHeader');

    const orderElementFilesButton = document.createElement('div');
    orderElementFilesButton.textContent = 'Fichiers';
    orderElementFilesButton.classList.add('orderElementFilesMessageButton');
    orderElementFilesButton.classList.add('hoverButton');
    orderElementFilesMessageHeader.appendChild(orderElementFilesButton);

    const orderElementMessageButton = document.createElement('div');
    orderElementMessageButton.textContent = 'Discussion';
    orderElementMessageButton.classList.add('orderElementFilesMessageButton');
    orderElementMessageButton.classList.add('hoverButton');
    orderElementFilesMessageHeader.appendChild(orderElementMessageButton);

    const orderElementFilesMessageContent = document.createElement('div');
    orderElementFilesMessageContent.classList.add('orderElementFilesMessageContent');

    orderElementFilesMessage.appendChild(orderElementFilesMessageHeader);
    orderElementFilesMessage.appendChild(orderElementFilesMessageContent);
    orderElementBody.appendChild(orderElementFilesMessage);

    // Adding all parts to the order element division
    orderElementDiv.appendChild(orderElementBody);

    orderContainer.appendChild(orderElementDiv);
    setTimeoutWithRAF(() => {
        orderElementDiv.classList.add('active');
    }, 10);
}

// Show the files list for each order
function displayFilesList(orderID) {

}


// Set color state for each order
function getColorForState(state) {
    const stateColorMapping = {
        pending: {background: '#215a6c', font: '#ffffff', frText: "En attente"},
        billed: {background: '#5A3286', font: '#ffffff', frText: "En cours"},
        printed: {background: '#5A3286', font: '#ffffff', frText: "En cours"},
        sliced: {background: '#5A3286', font: '#ffffff', frText: "En cours"},
        printing: {background: '#5A3286', font: '#ffffff', frText: "En cours"},
        finished: {background: '#0A53A8', font: '#ffffff', frText: "Terminée"},
    };

    return stateColorMapping[state] || {background: '#bdbdbd', font: '#000000'}; // Default colors
}