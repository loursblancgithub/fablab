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

/*--------------------------

Main logic

--------------------------*/

document.addEventListener('DOMContentLoaded', () => {

    // Sort order list
    const ordersList = document.getElementById('ordersList');

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

    // Order Element Header
    const orderElementHeader = document.createElement('div');
    orderElementHeader.classList.add('orderElementHeader');

    const orderNameElement = document.createElement('div');
    orderNameElement.textContent = `${order.orderName}`;
    orderNameElement.style.fontSize = '2em';
    orderElementHeader.appendChild(orderNameElement);

    const orderStateElement = document.createElement('div');
    orderStateElement.classList.add('orderStateElement');
    orderStateElement.textContent = `${order.orderState}`;
    orderStateElement.style.backgroundColor = getColorForState(order.orderState).background;
    orderStateElement.style.color = getColorForState(order.orderState).font;
    orderStateElement.textContent = getColorForState(order.orderState).frText;
    orderElementHeader.appendChild(orderStateElement);

    orderElementDiv.appendChild(orderElementHeader);


    // Order Element Body
    const orderElementBody = document.createElement('div');
    orderElementBody.classList.add('orderElementBody');

    // Order Element Summary
    const orderElementSummary = document.createElement('div');
    orderElementSummary.classList.add('orderElementSummary');
    orderElementSummary.style.width = '50%';

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
    orderElementSummaryQuantity.textContent = `Quantité: ${order.orderQuantity}`;
    orderElementDetails.appendChild(orderElementSummaryQuantity);

    const orderElementSummaryPrice = document.createElement('div');
    orderElementSummaryPrice.textContent = `Prix: ${order.orderPrice}`;
    orderElementDetails.appendChild(orderElementSummaryPrice);

    const orderElementSummaryQuestions = document.createElement('div');
    orderElementSummaryQuestions.textContent = `Questions et commentaires: ${order.orderQuestion}`;
    orderElementDetails.appendChild(orderElementSummaryQuestions);

    orderElementSummary.appendChild(orderElementDetails);

    orderElementBody.appendChild(orderElementSummary);

    // Order files/chat container

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
    orderElementDiv.appendChild(orderElementHeader);
    orderElementDiv.appendChild(orderElementBody);

    orderContainer.appendChild(orderElementDiv);
    setTimeoutWithRAF(() => {
        orderElementDiv.classList.add('active');
    }, 10);
}

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


// Function to properly show the order element animation
function setTimeoutWithRAF(callback, delay) {
    const start = performance.now();

    function frame(time) {
        if (time - start >= delay) {
            callback();
        } else {
            requestAnimationFrame(frame);
        }
    }

    requestAnimationFrame(frame);
}