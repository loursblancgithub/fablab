/*
import {socket} from './websocket_setup.js';

// Use the `socket` object for sending messages, etc.
socket.send("Message specific to admin_orders_fetcher functionality.");
*/

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


document.addEventListener('DOMContentLoaded', () => {
    const ordersList = document.getElementById('ordersList');
    const orderContainer = document.getElementById('orderContainer');

    orderDataDummy.forEach((orderElement) => {
        const ordersListElement = document.createElement('div');
        ordersListElement.classList.add('ordersListElement');

        const ordersListElementName = document.createElement('div');
        ordersListElementName.classList.add('ordersListElementName');
        ordersListElementName.textContent = orderElement.orderName;

        const ordersListElementState = document.createElement('div');
        ordersListElementState.classList.add('ordersListElementState');
        ordersListElementState.textContent = orderElement.orderState;

        ordersListElement.appendChild(ordersListElementName);
        ordersListElement.appendChild(ordersListElementState);

        ordersList.appendChild(ordersListElement);
    });
});