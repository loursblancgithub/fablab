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

const orderDataDummy = [{
    orderID: 158436,
    orderName: "Cirrus Vision Jet",
    orderState: "pending",
    userID: 62194,
    orderMaterial: "PETG",
    orderTotalWeight: 5000,
    orderQuantity: 100,
    orderPrice: 2000,
    orderQuestion: "Beautiful but underpowered lul",
    orderFiles: {
        file1: {fileID: 1, fileName: "fuselage.3mf", fileDateTime: "31/07/2024 10:25:32", fileWeight: 3000},
        file2: {fileID: 2, fileName: "aileron.3mf", fileDateTime: "02/08/2024 10:12:29", fileWeight: 500}
    },
    orderDateTime: "31/07/2024 10:25:32"
},
    {
        orderID: 158486,
        orderName: "Airbus A220",
        orderState: "finished",
        userID: 62194,
        orderMaterial: "PLA",
        orderTotalWeight: 300,
        orderQuantity: 1,
        orderPrice: 8,
        orderQuestion: "Bombardier on vous aime",
        orderFiles: {
            file1: {fileID: 1, fileName: "Fuselage", fileDateTime: "02/08/2024 10:12:29", fileWeight: 3000},
            file2: {fileID: 2, fileName: "Aileron", fileDateTime: "05/08/2024 10:12:29", fileWeight: 3000}
        },
        orderDateTime: "02/08/2024 10:12:29"
    },
    {
        orderID: 154436,
        orderName: "Boeing 787",
        orderState: "sliced",
        userID: 62194,
        orderMaterial: "PLA",
        orderTotalWeight: 3000,
        orderQuantity: 1,
        orderPrice: 15,
        orderQuestion: "Belle machine faite par des sagouins",
        orderFiles: {
            file1: {fileID: 1, fileName: "Fuselage", fileDateTime: "03/08/2024 10:12:29", fileWeight: 3000},
            file2: {fileID: 2, fileName: "Aileron", fileDateTime: "07/08/2024 10:12:29", fileWeight: 3000}
        },
        orderDateTime: "03/08/2024 10:12:29"
    },
    {
        orderID: 168436,
        orderName: "Embraer E190",
        orderState: "printing",
        userID: 62194,
        orderMaterial: "PLA",
        orderTotalWeight: 500,
        orderQuantity: 1,
        orderPrice: 4,
        orderQuestion: "Faites attention les winglets sont fragiles",
        orderFiles: {
            file1: {fileID: 1, fileName: "Fuselage", fileDateTime: "04/08/2024 10:12:29", fileWeight: 3000},
            file2: {fileID: 2, fileName: "Aileron", fileDateTime: "05/08/2024 10:12:29", fileWeight: 3000}
        },
        orderDateTime: "04/08/2024 10:12:29"
    },
    {
        orderID: 158431,
        orderName: "Lockheed Martin F-35",
        orderState: "printing",
        userID: 62194,
        orderMaterial: "PLA",
        orderTotalWeight: 1500,
        orderQuantity: 1,
        orderPrice: 12,
        orderQuestion: "Faites attention les winglets sont fragiles",
        orderFiles: {
            file1: {fileID: 1, fileName: "Fuselage", fileDateTime: "05/08/2024 10:12:29", fileWeight: 3000},
            file2: {fileID: 2, fileName: "Aileron", fileDateTime: "10/08/2024 10:12:29", fileWeight: 3000}
        },
        orderDateTime: "05/08/2024 10:12:29"
    },
    {
        orderID: 156436,
        orderName: "Cessna 172",
        orderState: "printing",
        userID: 62194,
        orderMaterial: "PLA",
        orderTotalWeight: 300,
        orderQuantity: 1,
        orderPrice: 8,
        orderQuestion: "Faites attention les winglets sont fragiles",
        orderFiles: {
            file1: {fileID: 1, fileName: "Fuselage", fileDateTime: "06/08/2024 10:12:29", fileWeight: 3000},
            file2: {fileID: 2, fileName: "Aileron", fileDateTime: "08/08/2024 10:12:29", fileWeight: 3000}
        },
        orderDateTime: "06/08/2024 10:12:29"
    },
    {
        orderID: 158426,
        orderName: "Piper PA-28",
        orderState: "printing",
        userID: 62194,
        orderMaterial: "PLA",
        orderTotalWeight: 300,
        orderQuantity: 1,
        orderPrice: 8,
        orderQuestion: "Faites attention les winglets sont fragiles",
        orderFiles: {
            file1: {fileID: 1, fileName: "Fuselage", fileDateTime: "07/08/2024 10:12:29", fileWeight: 3000},
            file2: {fileID: 2, fileName: "Aileron", fileDateTime: "09/08/2024 10:12:29", fileWeight: 3000}
        },
        orderDateTime: "07/08/2024 10:12:29"
    },
    {
        orderID: 158736,
        orderName: "Beechcraft Bonanza",
        orderState: "printing",
        userID: 62194,
        orderMaterial: "PLA",
        orderTotalWeight: 300,
        orderQuantity: 1,
        orderPrice: 10,
        orderQuestion: "Faites attention les winglets sont fragiles",
        orderFiles: {
            file1: {fileID: 1, fileName: "Fuselage", fileDateTime: "08/08/2024 10:12:29", fileWeight: 3000},
            file2: {fileID: 2, fileName: "Aileron", fileDateTime: "15/08/2024 10:12:29", fileWeight: 3000}
        },
        orderDateTime: "08/08/2024 10:12:29"
    },
    {
        orderID: 151436,
        orderName: "Gulfstream G650",
        orderState: "printing",
        userID: 62194,
        orderMaterial: "PLA",
        orderTotalWeight: 300,
        orderQuantity: 1,
        orderPrice: 8,
        orderQuestion: "Faites attention les winglets sont fragiles",
        orderFiles: {
            file1: {fileID: 1, fileName: "Fuselage", fileDateTime: "09/08/2024 10:12:29", fileWeight: 3000},
            file2: {fileID: 2, fileName: "Aileron", fileDateTime: "21/08/2024 10:12:29", fileWeight: 3000}
        },
        orderDateTime: "09/08/2024 10:12:29"
    }];

const userDataDummy = [
    {
        userID: 62194,
        userName: "Jean Michel"
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
    createOrderElements(orderDataDummy, userDataDummy);

    document.getElementById('sidePanelStateButtonAll').addEventListener('click', () => {
        console.log('Button clicked');

        contentContainer.innerHTML = '';
        createOrderElements(orderDataDummy, userDataDummy);
    });

    document.getElementById('sidePanelStateButtonToDo').addEventListener('click', () => {
        console.log('Button clicked');

        contentContainer.innerHTML = '';
        createOrderElements(orderDataDummy.filter(order => order.orderState === "pending"), userDataDummy);
    });

    document.getElementById('sidePanelStateButtonOngoing').addEventListener('click', () => {
        console.log('Button clicked');

        contentContainer.innerHTML = '';
        createOrderElements(orderDataDummy.filter(order => order.orderState !== "pending" && order.orderState !== "finished"), userDataDummy);
    });

    document.getElementById('sidePanelStateButtonFinished').addEventListener('click', () => {
        console.log('Button clicked');

        contentContainer.innerHTML = '';
        createOrderElements(orderDataDummy.filter(order => order.orderState === "finished"), userDataDummy);
    });
});

//-------------------------->

//Functions

//-------------------------->

// Dynamically create elements based on the order data
// Function to create order elements
function createOrderElements(orderData, userData) {
    const contentContainer = document.getElementById('contentContainer');
    if (!contentContainer) {
        console.error('Content container not found');
        return;
    }

    const columns = [document.createElement('div'), document.createElement('div'), document.createElement('div')];
    columns.forEach(column => column.classList.add('column'));

    orderData.sort((a, b) => {
        if (a.orderState === 'pending') return -1;
        if (b.orderState === 'pending') return 1;
        if (a.orderState === 'finished') return 1;
        if (b.orderState === 'finished') return -1;
        return 0;
    });

    orderData.forEach((orderElement, index) => {
        const orderMosaicElementDiv = document.createElement('div');
        orderMosaicElementDiv.classList.add('orderMosaicElement');

        const orderElementHeader = document.createElement('div');
        orderElementHeader.classList.add('orderMosaicElementHeader');

        const orderElementHeaderColumn1 = document.createElement('div');
        orderElementHeaderColumn1.classList.add('orderMosaicElementHeaderColumn');
        orderElementHeaderColumn1.id = 'orderMosaicElementHeaderColumn1';

        const orderNameElement = document.createElement('div');
        orderNameElement.textContent = `${orderElement.orderName}`;
        orderNameElement.classList.add('orderMosaicElementText');
        applyHoverIfNecessary(orderNameElement, `${orderElement.orderName}`);
        orderElementHeaderColumn1.appendChild(orderNameElement);

        const orderClientElement = document.createElement('div');
        orderClientElement.textContent = getUserNameById(orderElement.userID, userData);
        orderClientElement.classList.add('orderMosaicElementText');
        applyHoverIfNecessary(orderClientElement, `${orderClientElement.textContent}`);
        orderElementHeaderColumn1.appendChild(orderClientElement);

        orderElementHeader.appendChild(orderElementHeaderColumn1);

        const orderElementHeaderColumn2 = document.createElement('div');
        orderElementHeaderColumn2.classList.add('orderMosaicElementHeaderColumn');
        orderElementHeaderColumn2.style.justifyContent = 'flex-start';

        const orderStateDropdown = createStateDropdown(orderElement.orderState);
        orderStateDropdown.style.margin = '1vh 0 1vh 0';
        applyHoverIfNecessary(orderStateDropdown, stateOptions[orderElement.orderState]);
        orderElementHeaderColumn2.appendChild(orderStateDropdown);

        orderElementHeader.appendChild(orderElementHeaderColumn2);
        orderMosaicElementDiv.appendChild(orderElementHeader);

        const orderDetailsElement = document.createElement('button');
        orderDetailsElement.classList.add('orderMosaicElementDetails');

        const detailsExpandButton = document.createElement('span');
        detailsExpandButton.textContent = 'Détails';
        detailsExpandButton.classList.add('orderMosaicElementDetailsText');

        detailsExpandButton.addEventListener('click', () => {
            showFullOrder();
        });

        const expandDownArrow = document.createElement('span');
        expandDownArrow.classList.add('orderMosaicElementDetailsIcon');
        expandDownArrow.textContent = orderElement.details ? '⯅' : '⯆';

        orderDetailsElement.appendChild(detailsExpandButton);
        orderDetailsElement.appendChild(expandDownArrow);

        expandDownArrow.addEventListener('click', () => {
            orderElement.details = !orderElement.details;
            removeAllChildren(contentContainer);
            createOrderElements(orderData, userData);
        });

        if (orderElement.details) {
            const orderMaterialElement = document.createElement('div');
            orderMaterialElement.textContent = `Matériau: ${orderElement.orderMaterial}`;
            orderMaterialElement.classList.add('orderMosaicElementText');
            orderMosaicElementDiv.appendChild(orderMaterialElement);

            const orderTotalWeightElement = document.createElement('div');
            orderTotalWeightElement.textContent = `Poids total: ${orderElement.orderTotalWeight}`;
            orderTotalWeightElement.classList.add('orderMosaicElementText');
            orderMosaicElementDiv.appendChild(orderTotalWeightElement);

            const orderQuantityElement = document.createElement('div');
            orderQuantityElement.textContent = `Quantité: ${orderElement.orderQuantity}`;
            orderQuantityElement.classList.add('orderMosaicElementText');
            orderMosaicElementDiv.appendChild(orderQuantityElement);

            const orderPriceElement = document.createElement('div');
            orderPriceElement.textContent = `Price: ${orderElement.orderPrice}`;
            orderPriceElement.classList.add('orderMosaicElementText');
            orderMosaicElementDiv.appendChild(orderPriceElement);
        }

        orderMosaicElementDiv.appendChild(orderDetailsElement);
        columns[index % 3].appendChild(orderMosaicElementDiv);
    });

    contentContainer.innerHTML = '';
    columns.forEach(column => contentContainer.appendChild(column));
}

// Function to show the detailed order with the files list and the chat
function showFullOrder() {

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

    return dropdown;
}

// Function to get username by user ID
function getUserNameById(userId, users) {
    const user = users.find(user => user.userID === userId);
    return user ? user.userName : 'Unknown User';
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