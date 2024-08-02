import {setTimeoutWithRAF} from "/src/scripts/utils.js";
/*
import {socket} from './websocket_setup.js';

// Use the `socket` object for sending messages, etc.
socket.send("Message specific to admin_orders_fetcher functionality.");
*/

const orderDataDummy = [{
    "orderID": 158436,
    "orderName": "Cirrus Vision Jet",
    "orderState": "pending",
    "orderClient": "Jane Doe",
    "orderClientEmail": "jane.doe@example.com",
    "orderMaterial": "Aluminum",
    "orderTotalWeight": 5000,
    "orderQuantity": 100,
    "orderPrice": 2000,
    "orderQuestion": "Beautiful but underpowered lul",
    "orderFiles": {
        "file1": {fileID: 1, fileName: "fuselage.3mf", fileDateTime: "31/07/2024 10:25:32", fileWeight: 3000},
        "file2": {fileID: 2, fileName: "aileron.3mf", fileDateTime: "02/08/2024 10:12:29", fileWeight: 500}
    },
    "orderDateTime": "31/07/2024 10:25:32"
},
    {
        "orderID": 158486,
        "orderName": "Airbus A220",
        "orderState": "finished",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": 300,
        "orderQuantity": 1,
        "orderPrice": 8,
        "orderQuestion": "Bombardier on vous aime",
        "orderFiles": {
            "file1": {fileID: 1, fileName: "Fuselage", fileDateTime: "02/08/2024 10:12:29", fileWeight: 3000},
            "file2": {fileID: 2, fileName: "Aileron", fileDateTime: "05/08/2024 10:12:29", fileWeight: 3000}
        },
        "orderDateTime": "02/08/2024 10:12:29"
    },
    {
        "orderID": 154436,
        "orderName": "Boeing 787",
        "orderState": "sliced",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": 3000,
        "orderQuantity": 1,
        "orderPrice": 15,
        "orderQuestion": "Belle machine faite par des sagouins",
        "orderFiles": {
            "file1": {fileID: 1, fileName: "Fuselage", fileDateTime: "03/08/2024 10:12:29", fileWeight: 3000},
            "file2": {fileID: 2, fileName: "Aileron", fileDateTime: "07/08/2024 10:12:29", fileWeight: 3000}
        },
        "orderDateTime": "03/08/2024 10:12:29"
    },
    {
        "orderID": 168436,
        "orderName": "Embraer E190",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": 500,
        "orderQuantity": 1,
        "orderPrice": 4,
        "orderQuestion": "Faites attention les winglets sont fragiles",
        "orderFiles": {
            "file1": {fileID: 1, fileName: "Fuselage", fileDateTime: "04/08/2024 10:12:29", fileWeight: 3000},
            "file2": {fileID: 2, fileName: "Aileron", fileDateTime: "05/08/2024 10:12:29", fileWeight: 3000}
        },
        "orderDateTime": "04/08/2024 10:12:29"
    },
    {
        "orderID": 158431,
        "orderName": "Lockheed Martin F-35",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": 1500,
        "orderQuantity": 1,
        "orderPrice": 12,
        "orderQuestion": "Faites attention les winglets sont fragiles",
        "orderFiles": {
            "file1": {fileID: 1, fileName: "Fuselage", fileDateTime: "05/08/2024 10:12:29", fileWeight: 3000},
            "file2": {fileID: 2, fileName: "Aileron", fileDateTime: "10/08/2024 10:12:29", fileWeight: 3000}
        },
        "orderDateTime": "05/08/2024 10:12:29"
    },
    {
        "orderID": 156436,
        "orderName": "Cessna 172",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": 300,
        "orderQuantity": 1,
        "orderPrice": 8,
        "orderQuestion": "Faites attention les winglets sont fragiles",
        "orderFiles": {
            "file1": {fileID: 1, fileName: "Fuselage", fileDateTime: "06/08/2024 10:12:29", fileWeight: 3000},
            "file2": {fileID: 2, fileName: "Aileron", fileDateTime: "08/08/2024 10:12:29", fileWeight: 3000}
        },
        "orderDateTime": "06/08/2024 10:12:29"
    },
    {
        "orderID": 158426,
        "orderName": "Piper PA-28",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": 300,
        "orderQuantity": 1,
        "orderPrice": 8,
        "orderQuestion": "Faites attention les winglets sont fragiles",
        "orderFiles": {
            "file1": {fileID: 1, fileName: "Fuselage", fileDateTime: "07/08/2024 10:12:29", fileWeight: 3000},
            "file2": {fileID: 2, fileName: "Aileron", fileDateTime: "09/08/2024 10:12:29", fileWeight: 3000}
        },
        "orderDateTime": "07/08/2024 10:12:29"
    },
    {
        "orderID": 158736,
        "orderName": "Beechcraft Bonanza",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": 300,
        "orderQuantity": 1,
        "orderPrice": 10,
        "orderQuestion": "Faites attention les winglets sont fragiles",
        "orderFiles": {
            "file1": {fileID: 1, fileName: "Fuselage", fileDateTime: "08/08/2024 10:12:29", fileWeight: 3000},
            "file2": {fileID: 2, fileName: "Aileron", fileDateTime: "15/08/2024 10:12:29", fileWeight: 3000}
        },
        "orderDateTime": "08/08/2024 10:12:29"
    },
    {
        "orderID": 158736,
        "orderName": "Beechcraft Bonanza",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": 300,
        "orderQuantity": 1,
        "orderPrice": 10,
        "orderQuestion": "Faites attention les winglets sont fragiles",
        "orderFiles": {
            "file1": {fileID: 1, fileName: "Fuselage", fileDateTime: "08/08/2024 10:12:29", fileWeight: 3000},
            "file2": {fileID: 2, fileName: "Aileron", fileDateTime: "15/08/2024 10:12:29", fileWeight: 3000}
        },
        "orderDateTime": "08/08/2024 10:12:29"
    },
    {
        "orderID": 158736,
        "orderName": "Beechcraft Bonanza",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": 300,
        "orderQuantity": 1,
        "orderPrice": 10,
        "orderQuestion": "Faites attention les winglets sont fragiles",
        "orderFiles": {
            "file1": {fileID: 1, fileName: "Fuselage", fileDateTime: "08/08/2024 10:12:29", fileWeight: 3000},
            "file2": {fileID: 2, fileName: "Aileron", fileDateTime: "15/08/2024 10:12:29", fileWeight: 3000}
        },
        "orderDateTime": "08/08/2024 10:12:29"
    },
    {
        "orderID": 158736,
        "orderName": "Beechcraft Bonanza",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": 300,
        "orderQuantity": 1,
        "orderPrice": 10,
        "orderQuestion": "Faites attention les winglets sont fragiles",
        "orderFiles": {
            "file1": {fileID: 1, fileName: "Fuselage", fileDateTime: "08/08/2024 10:12:29", fileWeight: 3000},
            "file2": {fileID: 2, fileName: "Aileron", fileDateTime: "15/08/2024 10:12:29", fileWeight: 3000}
        },
        "orderDateTime": "08/08/2024 10:12:29"
    },
    {
        "orderID": 158736,
        "orderName": "Beechcraft Bonanza",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": 300,
        "orderQuantity": 1,
        "orderPrice": 10,
        "orderQuestion": "Faites attention les winglets sont fragiles",
        "orderFiles": {
            "file1": {fileID: 1, fileName: "Fuselage", fileDateTime: "08/08/2024 10:12:29", fileWeight: 3000},
            "file2": {fileID: 2, fileName: "Aileron", fileDateTime: "15/08/2024 10:12:29", fileWeight: 3000}
        },
        "orderDateTime": "08/08/2024 10:12:29"
    },
    {
        "orderID": 158736,
        "orderName": "Beechcraft Bonanza",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": 300,
        "orderQuantity": 1,
        "orderPrice": 10,
        "orderQuestion": "Faites attention les winglets sont fragiles",
        "orderFiles": {
            "file1": {fileID: 1, fileName: "Fuselage", fileDateTime: "08/08/2024 10:12:29", fileWeight: 3000},
            "file2": {fileID: 2, fileName: "Aileron", fileDateTime: "15/08/2024 10:12:29", fileWeight: 3000}
        },
        "orderDateTime": "08/08/2024 10:12:29"
    },
    {
        "orderID": 158736,
        "orderName": "Beechcraft Bonanza",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": 300,
        "orderQuantity": 1,
        "orderPrice": 10,
        "orderQuestion": "Faites attention les winglets sont fragiles",
        "orderFiles": {
            "file1": {fileID: 1, fileName: "Fuselage", fileDateTime: "08/08/2024 10:12:29", fileWeight: 3000},
            "file2": {fileID: 2, fileName: "Aileron", fileDateTime: "15/08/2024 10:12:29", fileWeight: 3000}
        },
        "orderDateTime": "08/08/2024 10:12:29"
    },
    {
        "orderID": 158736,
        "orderName": "Beechcraft Bonanza",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": 300,
        "orderQuantity": 1,
        "orderPrice": 10,
        "orderQuestion": "Faites attention les winglets sont fragiles",
        "orderFiles": {
            "file1": {fileID: 1, fileName: "Fuselage", fileDateTime: "08/08/2024 10:12:29", fileWeight: 3000},
            "file2": {fileID: 2, fileName: "Aileron", fileDateTime: "15/08/2024 10:12:29", fileWeight: 3000}
        },
        "orderDateTime": "08/08/2024 10:12:29"
    },
    {
        "orderID": 158736,
        "orderName": "Beechcraft Bonanza",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": 300,
        "orderQuantity": 1,
        "orderPrice": 10,
        "orderQuestion": "Faites attention les winglets sont fragiles",
        "orderFiles": {
            "file1": {fileID: 1, fileName: "Fuselage", fileDateTime: "08/08/2024 10:12:29", fileWeight: 3000},
            "file2": {fileID: 2, fileName: "Aileron", fileDateTime: "15/08/2024 10:12:29", fileWeight: 3000}
        },
        "orderDateTime": "08/08/2024 10:12:29"
    },
    {
        "orderID": 151436,
        "orderName": "Gulfstream G650",
        "orderState": "printing",
        "orderClient": "John Doe",
        "orderClientEmail": "john.doe@example.com",
        "orderMaterial": "PLA",
        "orderTotalWeight": 300,
        "orderQuantity": 1,
        "orderPrice": 8,
        "orderQuestion": "Faites attention les winglets sont fragiles",
        "orderFiles": {
            "file1": {fileID: 1, fileName: "Fuselage", fileDateTime: "09/08/2024 10:12:29", fileWeight: 3000},
            "file2": {fileID: 2, fileName: "Aileron", fileDateTime: "21/08/2024 10:12:29", fileWeight: 3000}
        },
        "orderDateTime": "09/08/2024 10:12:29"
    }];


const orderContainer = document.getElementById('orderContainer');
const newOrder = document.getElementById('newOrder');
const ordersList = document.getElementById('ordersList');
let orderElementFilesMessageContent;
let currentOrderID;

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

    // Filling the order list
    displayOrdersList(orderDataDummy);

    // When clicking on any element with the class .ordersListElement, add the class .active to change the background color
    document.querySelectorAll('.ordersListElement').forEach(element => {
        element.addEventListener('click', function () {
            document.querySelectorAll('.ordersListElement').forEach(el => el.classList.remove('active'));
            this.classList.add('active');
            currentOrderID = this.id;

            // By default, loading the files list when loading an order
            showFilesOfActiveOrder(currentOrderID);

            document.getElementById('orderElementFilesButton').addEventListener('click', () => {
                showFilesOfActiveOrder(currentOrderID);
            });

            /*document.getElementById('orderElementMessageButton').addEventListener('click', () => {
                displayMessages(currentOrderID);
            });*/
        });
    });
});

/*--------------------------

Functions

--------------------------*/

// Function to fill the order list
function displayOrdersList(orders) {
    orders.forEach((orderElement) => {
        const ordersListElement = document.createElement('div');
        ordersListElement.classList.add('ordersListElement');
        ordersListElement.classList.add('hoverButton');
        ordersListElement.id = orderElement.orderID;

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
            displayOrderContent(orderElement);
        });

        ordersList.appendChild(ordersListElement);
    });
}

// Function to display order details in #orderContainer
function displayOrderContent(order) {

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
    orderElementDetails.style.display = 'flex';
    orderElementDetails.style.flexDirection = 'row';
    orderElementDetails.style.justifyContent = 'space-between';
    orderElementDetails.style.alignContent = 'center';
    orderElementDetails.style.width = '100%';

    // Order Details
    const orderElementSummaryLeftColumn = document.createElement('div');
    orderElementSummaryLeftColumn.classList.add('orderElementSummaryColumn');
    orderElementSummaryLeftColumn.style.display = 'flex';
    orderElementSummaryLeftColumn.style.flexDirection = 'column';
    orderElementSummaryLeftColumn.style.width = 'fit-content';
    orderElementSummaryLeftColumn.style.justifyContent = 'flex-start';
    orderElementSummaryLeftColumn.style.alignContent = 'flex-start';

    const orderElementSummaryMaterial = document.createElement('div');
    orderElementSummaryMaterial.textContent = `Matériau: ${order.orderMaterial}`;
    orderElementSummaryMaterial.style.width = 'fit-content';
    orderElementSummaryLeftColumn.appendChild(orderElementSummaryMaterial);

    const orderElementSummaryTotalWeight = document.createElement('div');
    if (order.orderTotalWeight > 1000) {
        orderElementSummaryTotalWeight.textContent = `Poids total: ${order.orderTotalWeight / 1000}kg`;
    } else {
        orderElementSummaryTotalWeight.textContent = `Poids total: ${order.orderTotalWeight}g`;
    }
    orderElementSummaryTotalWeight.style.width = 'fit-content';
    orderElementSummaryLeftColumn.appendChild(orderElementSummaryTotalWeight);

    const orderElementSummaryQuantity = document.createElement('div');
    if (order.orderQuantity > 1) {
        orderElementSummaryQuantity.textContent = `${order.orderQuantity} pièces`;
    } else {
        orderElementSummaryQuantity.textContent = `${order.orderQuantity} pièce`;
    }
    orderElementSummaryQuantity.style.width = 'fit-content';
    orderElementSummaryLeftColumn.appendChild(orderElementSummaryQuantity);

    orderElementDetails.appendChild(orderElementSummaryLeftColumn);

    const orderElementSummaryRightColumn = document.createElement('div');
    orderElementSummaryRightColumn.classList.add('orderElementSummaryColumn');
    orderElementSummaryRightColumn.style.display = 'flex';
    orderElementSummaryRightColumn.style.flexDirection = 'column';
    orderElementSummaryRightColumn.style.width = 'fit-content';
    orderElementSummaryRightColumn.style.justifyContent = 'flex-end';
    orderElementSummaryRightColumn.style.alignContent = 'flex-end';

    const orderElementSummaryPrice = document.createElement('div');
    orderElementSummaryPrice.textContent = `${order.orderPrice}€`;
    orderElementSummaryPrice.style.fontSize = '1.5em';
    orderElementSummaryPrice.style.color = 'var(--logoBlue)';
    orderElementSummaryPrice.style.width = 'fit-content';
    orderElementSummaryRightColumn.appendChild(orderElementSummaryPrice);

    orderElementDetails.appendChild(orderElementSummaryRightColumn);

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
    orderElementFilesButton.id = 'orderElementFilesButton';
    orderElementFilesButton.classList.add('orderElementFilesMessageButton');
    orderElementFilesButton.classList.add('hoverButton');
    orderElementFilesMessageHeader.appendChild(orderElementFilesButton);

    const orderElementMessageButton = document.createElement('div');
    orderElementMessageButton.textContent = 'Discussion';
    orderElementMessageButton.classList.add('orderElementFilesMessageButton');
    orderElementMessageButton.classList.add('hoverButton');
    orderElementMessageButton.id = 'orderElementMessageButton';
    orderElementFilesMessageHeader.appendChild(orderElementMessageButton);

    orderElementFilesMessageContent = document.createElement('div');
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

// Show the files list for a specific order
function displayFilesList(order) {
    orderElementFilesMessageContent.innerHTML = '';

    const uploadFileContainer = document.createElement('div');
    uploadFileContainer.style.display = 'flex';
    uploadFileContainer.style.flexDirection = 'column';
    uploadFileContainer.style.justifyContent = 'flex-start';
    uploadFileContainer.style.alignItems = 'center';
    uploadFileContainer.style.width = '100%';
    uploadFileContainer.margin = '2vh 0 4vh 0';

    const uploadFileInput = document.createElement('input');
    uploadFileInput.type = 'file';
    uploadFileInput.id = 'uploadFileInput';
    uploadFileInput.classList.add('inputStyle');
    uploadFileInput.style.padding = '0.5vh 0.5vw 0.5vh 0.5vw';
    uploadFileContainer.appendChild(uploadFileInput);

    const uploadFileButton = document.createElement('div');
    uploadFileButton.textContent = 'Déposer un fichier';
    uploadFileButton.classList.add('hoverButton');
    uploadFileButton.id = 'uploadFileButton';
    uploadFileButton.style.padding = '5px 10px';
    uploadFileButton.style.height = 'fit-content';
    uploadFileButton.style.width = 'fit-content';
    uploadFileButton.style.borderRadius = '5px';
    uploadFileButton.style.backgroundColor = 'grey';
    uploadFileButton.style.cursor = 'not-allowed';
    uploadFileButton.setAttribute('disabled', 'true');
    uploadFileContainer.appendChild(uploadFileButton);

    orderElementFilesMessageContent.appendChild(uploadFileContainer);

    uploadFileInput.addEventListener('change', () => {
        if (uploadFileInput.files.length > 0) {
            uploadFileButton.style.backgroundColor = 'var(--logoBlue)';
            uploadFileButton.style.cursor = 'pointer';
            uploadFileButton.style.color = '#ffffff';
            uploadFileButton.removeAttribute('disabled');
        } else {
            uploadFileButton.style.backgroundColor = 'grey';
            uploadFileButton.style.cursor = 'not-allowed';
            uploadFileButton.setAttribute('disabled', 'true');
        }
    });

    Object.values(order.orderFiles).forEach((file) => {
        const fileElement = document.createElement('div');
        fileElement.classList.add('filesListElement');

        const fileElementName = document.createElement('div');
        fileElementName.classList.add('filesListElementName');
        fileElementName.textContent = file.fileName;
        fileElement.appendChild(fileElementName);

        const fileElementRightPart = document.createElement('div');
        fileElementRightPart.style.display = 'flex';
        fileElementRightPart.style.flexDirection = 'row';
        fileElementRightPart.style.justifyContent = 'flex-end';
        fileElementRightPart.style.alignContent = 'flex-end';
        fileElementRightPart.style.width = '70%';
        fileElementRightPart.style.overflow = 'hidden';
        fileElementRightPart.style.textOverflow = 'ellipsis';
        fileElementRightPart.style.whiteSpace = 'nowrap';

        const fileElementDate = document.createElement('div');
        fileElementDate.classList.add('filesListElementDate');
        fileElementDate.classList.add('filesListSubElement');
        const [date, time] = file.fileDateTime.split(' ');
        fileElementDate.textContent = `Déposé le ${date} à ${time}`;
        fileElementRightPart.appendChild(fileElementDate);

        const fileElementSize = document.createElement('div');
        fileElementSize.classList.add('filesListSubElement');
        if (file.fileWeight >= 1000) {
            fileElementSize.textContent = `${(file.fileWeight / 1000).toFixed(2)}MB`;
        } else {
            fileElementSize.textContent = `${file.fileWeight}KB`;
        }
        fileElementSize.style.fontSize = '0.9em';
        fileElementRightPart.appendChild(fileElementSize);

        const fileElementDownloadButton = document.createElement('img');
        fileElementDownloadButton.classList.add('filesListDownload');
        fileElementDownloadButton.src = '/src/front/Assets/download_icon.svg';
        fileElementDownloadButton.alt = 'Télécharger';
        fileElementDownloadButton.style.height = '20px';
        fileElementRightPart.appendChild(fileElementDownloadButton);

        fileElement.appendChild(fileElementRightPart);

        orderElementFilesMessageContent.appendChild(fileElement);
    });
}

// Show the chat for a specific order
/*function displayMessages(order) {
    orderElementFilesMessageContent.innerHTML = '';
}*/

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

// Function to show files of the active order
function showFilesOfActiveOrder(activeOrderId) {
    if (activeOrderId) {
        const activeOrder = orderDataDummy.find(order => order.orderID === Number(activeOrderId));
        if (activeOrder) {
            displayFilesList(activeOrder);
        }
    }
}
