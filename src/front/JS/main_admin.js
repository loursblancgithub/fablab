import {removeAllChildren, applyHoverIfNecessary} from "./utils.js";

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
    orderID: 158486,
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
    createOrderMosaicElements(orderDataDummy, userDataDummy);

    document.getElementById('sidePanelStateButtonAll').addEventListener('click', () => {
        contentContainer.innerHTML = '';
        createOrderMosaicElements(orderDataDummy, userDataDummy);
    });

    document.getElementById('sidePanelStateButtonToDo').addEventListener('click', () => {
        contentContainer.innerHTML = '';
        createOrderMosaicElements(orderDataDummy.filter(order => order.orderState === "pending"), userDataDummy);
    });

    document.getElementById('sidePanelStateButtonOngoing').addEventListener('click', () => {
        contentContainer.innerHTML = '';
        createOrderMosaicElements(orderDataDummy.filter(order => order.orderState !== "pending" && order.orderState !== "finished"), userDataDummy);
    });

    document.getElementById('sidePanelStateButtonFinished').addEventListener('click', () => {
        contentContainer.innerHTML = '';
        createOrderMosaicElements(orderDataDummy.filter(order => order.orderState === "finished"), userDataDummy);
    });
});

//-------------------------->

//Functions

//-------------------------->

// Function to populate the order elements mosaic
function createOrderMosaicElements(orderData, userData) {
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

        const orderNameElement = document.createElement('div');
        orderNameElement.textContent = `${orderElement.orderName}`;
        orderNameElement.classList.add('orderMosaicElementTitle');
        orderNameElement.classList.add('orderMosaicElementText');
        applyHoverIfNecessary(orderNameElement, `${orderElement.orderName}`);
        orderElementHeader.appendChild(orderNameElement);

        const orderElementHeaderClientState = document.createElement('div');
        orderElementHeaderClientState.classList.add('orderElementHeaderClientState');

        const orderClientElement = document.createElement('div');
        orderClientElement.textContent = getUserNameById(orderElement.userID, userData);
        orderClientElement.classList.add('orderMosaicElementText');
        applyHoverIfNecessary(orderClientElement, `${orderClientElement.textContent}`);
        orderElementHeaderClientState.appendChild(orderClientElement);

        const orderStateDropdown = createStateDropdown(orderElement.orderState);
        orderStateDropdown.style.margin = '1vh 0 1vh 0';
        applyHoverIfNecessary(orderStateDropdown, stateOptions[orderElement.orderState]);
        orderElementHeaderClientState.appendChild(orderStateDropdown);

        orderElementHeader.appendChild(orderElementHeaderClientState);

        orderMosaicElementDiv.appendChild(orderElementHeader);

        const orderDetailsElement = document.createElement('button');
        orderDetailsElement.classList.add('orderMosaicElementDetails');

        const detailsExpandButton = document.createElement('span');
        detailsExpandButton.textContent = 'Détails';
        detailsExpandButton.classList.add('orderMosaicElementDetailsText');

        const expandDownArrow = document.createElement('span');
        expandDownArrow.classList.add('orderMosaicElementDetailsIcon');
        expandDownArrow.textContent = orderElement.details ? '⯅' : '⯆';

        orderDetailsElement.appendChild(detailsExpandButton);
        orderDetailsElement.appendChild(expandDownArrow);

        expandDownArrow.addEventListener('click', () => {
            orderElement.details = !orderElement.details;
            removeAllChildren(contentContainer);
            createOrderMosaicElements(orderData, userData);
        });

        if (orderElement.details) {
            const orderMaterialElement = document.createElement('div');
            if (orderElement.orderMaterial === 'PLA' || orderElement.orderMaterial === 'PETG' || orderElement.orderMaterial === 'ABS') {
                orderMaterialElement.textContent = `${orderElement.orderMaterial} (Plastique)`;
            } else if (orderElement.orderMaterial === 'Résine') {
                orderMaterialElement.textContent = `${orderElement.orderMaterial}`;
            }
            orderMaterialElement.classList.add('orderMosaicElementText');
            orderMosaicElementDiv.appendChild(orderMaterialElement);

            const weightQuantityDiv = document.createElement('div');
            weightQuantityDiv.classList.add('orderMosaicElementWeightQuantity');

            const orderTotalWeightElement = document.createElement('div');
            if (orderElement.orderTotalWeight > 1000) {
                orderTotalWeightElement.textContent = `Poids total: ${orderElement.orderTotalWeight / 1000}kg`;
            } else {
                orderTotalWeightElement.textContent = `Poids total: ${orderElement.orderTotalWeight}g`;
            }
            orderTotalWeightElement.classList.add('orderMosaicElementText');
            weightQuantityDiv.appendChild(orderTotalWeightElement);

            const orderQuantityElement = document.createElement('div');
            if (orderElement.orderQuantity > 1) {
                orderQuantityElement.textContent = `${orderElement.orderQuantity} pièces`;
            } else {
                orderQuantityElement.textContent = `${orderElement.orderQuantity} pièce`;
            }
            orderQuantityElement.classList.add('orderQuantityElementText');
            orderQuantityElement.classList.add('orderMosaicElementText');
            weightQuantityDiv.appendChild(orderQuantityElement);

            orderMosaicElementDiv.appendChild(weightQuantityDiv);

            const orderPriceElement = document.createElement('div');
            orderPriceElement.textContent = `${orderElement.orderPrice}€`;
            orderPriceElement.classList.add('orderMosaicElementText');
            orderMosaicElementDiv.appendChild(orderPriceElement);
        }

        orderMosaicElementDiv.appendChild(orderDetailsElement);
        columns[index % 3].appendChild(orderMosaicElementDiv);

        detailsExpandButton.addEventListener('click', () => {
            console.log(orderElement)
            showOrderDetails(orderElement);
        });

        document.getElementById('hideOrderDetails').addEventListener('click', () => {
            hideOrderDetails();
        });
    });

    contentContainer.innerHTML = '';
    columns.forEach(column => contentContainer.appendChild(column));
}

// Function to show the detailed order with the files list and the chat
function showOrderDetails(orderElement) {
    document.getElementById('orderElement').style.display = 'flex';
    document.querySelector('.pageMask').style.display = 'block';

    // Order name
    document.getElementById('orderName').textContent = orderElement.orderName;

    // State
    document.getElementById('orderState').textContent = stateOptions[orderElement.orderState];

    // Date
    const [date, time] = orderElement.orderDateTime.split(' ');
    document.getElementById('orderDateTime').textContent = `Commande passée le ${date} à ${time}`;

    // Material
    if (orderElement.orderMaterial === 'PLA' || orderElement.orderMaterial === 'PETG' || orderElement.orderMaterial === 'ABS') {
        document.getElementById('orderMaterial').textContent = `${orderElement.orderMaterial} (Plastique)`;
    } else if (orderElement.orderMaterial === 'Résine') {
        document.getElementById('orderMaterial').textContent = `${orderElement.orderMaterial}`;
    }

    // Weight
    if (orderElement.orderTotalWeight > 1000) {
        document.getElementById('orderTotalWeight').textContent = `Poids total: ${orderElement.orderTotalWeight / 1000}kg`;
    } else {
        document.getElementById('orderTotalWeight').textContent = `Poids total: ${orderElement.orderTotalWeight}g`;
    }

    // Quantity
    if (orderElement.orderQuantity > 1) {
        document.getElementById('orderQuantity').textContent = `${orderElement.orderQuantity} pièces`;
    } else {
        document.getElementById('orderQuantity').textContent = `${orderElement.orderQuantity} pièce`;
    }

    document.getElementById('orderPrice').textContent = `${orderElement.orderPrice}€`;
    document.getElementById('orderQuestion').textContent = `Questions: ${orderElement.orderQuestion}`;
}

function hideOrderDetails() {
    document.getElementById('orderElement').style.display = 'none';
    document.querySelector('.pageMask').style.display = 'none';
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