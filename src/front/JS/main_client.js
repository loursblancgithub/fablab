import {applyHoverIfNecessary, setTimeoutWithRAF} from "/src/front/JS/utils.js";
/*
import {socket} from './websocket_setup.js';

// Use the `socket` object for sending messages, etc.
socket.send("Message specific to admin_orders_fetcher functionality.");
*/

const orderDataDummy = [{
    orderID: 158436,
    orderName: "Cirrus Vision Jet",
    orderState: "pending",
    orderClient: 62194,
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
        orderClient: 62194,
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
        orderClient: 62194,
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
        orderClient: 62194,
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
        orderClient: 62194,
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
        orderClient: 62194,
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
        orderClient: 62194,
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
        orderClient: 62194,
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
        orderClient: 62194,
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

const userDataDummy = {
    userID: 62194,
    userName: "Jean MANOURY"
}

const leftContentContainer = document.getElementById('leftContentContainer');
const orderContainer = document.getElementById('orderContainer');
const newOrder = document.getElementById('newOrder');
let orderElementFilesMessageContent;
let currentOrderID;

/*--------------------------

Main logic

--------------------------*/

document.addEventListener('DOMContentLoaded', () => {
    // By default, showing the landing page
    displayLandingPage(userDataDummy, orderDataDummy);

    // Filling the order list
    displayOrdersList(orderDataDummy);

    // If clicking #newOrder, redirect to the order page
    newOrder.addEventListener('click', function () {
        window.location.href = "../HTML/order.html";
    });

    document.getElementById('ordersListHome').addEventListener('click', () => {
        displayLandingPage(userDataDummy, orderDataDummy);
    })

    document.querySelectorAll('.ordersListElement').forEach(element => {
        element.addEventListener('click', function () {

            // When clicking on any element with the class .ordersListElement, add the class .active to change the background color
            document.querySelectorAll('.ordersListElement').forEach(el => el.classList.remove('active'));
            this.classList.add('active');
            currentOrderID = this.id;

            // By default, loading the files list when loading an order
            showFilesOfActiveOrder(currentOrderID);

            // When clicking on the files button, loading the files list
            document.getElementById('orderElementFilesButton').addEventListener('click', () => {
                showFilesOfActiveOrder(currentOrderID);
            });

            // When clicking on the chat button, loading the chat
            document.getElementById('orderElementMessageButton').addEventListener('click', () => {
                displayMessages(currentOrderID);
            });
        });
    });
});

/*--------------------------

Functions

--------------------------*/

//Function showing the landing page of the user
function displayLandingPage(user, orders) {
    orderContainer.innerHTML = '';
    document.querySelectorAll('.ordersListElement').forEach(el => el.classList.remove('active'));

    const landingPageElement = document.createElement('div');
    landingPageElement.id = 'landingPageElement';
    landingPageElement.classList.add('landingPageElement');

    const landingPageLeftColumn = document.createElement('div');
    landingPageLeftColumn.id = 'landingPageLeftColumn';

    const landingPageWelcome = document.createElement('div');
    landingPageWelcome.id = 'landingPageWelcome';

    const landingPageWelcomeText = document.createElement('div');
    landingPageWelcomeText.textContent = `Bienvenue ${user.userName} !
    Tu as passé ${orders.length} commandes auprès du FabLab. Merci pour ta confiance !
    Si tu as une suggestion, une remarque ou besoin d'aide, n'hésite pas à nous contacter en cliquant sur l'ampoule visible en haut à droite.`;
    landingPageLeftColumn.appendChild(landingPageWelcome);
    landingPageLeftColumn.appendChild(landingPageWelcomeText);

    landingPageElement.appendChild(landingPageLeftColumn);
    orderContainer.appendChild(landingPageElement);

    /*orderContainer.appendChild(landingPageChatContainer);*/

    setTimeoutWithRAF(() => {
        landingPageElement.classList.add('active');
    }, 10);
}

// Function to fill the order list
function displayOrdersList(orders) {
    const ordersList = document.getElementById('ordersList');

    // Sort orders list by state
    orders.sort((a, b) => {
        if (a.orderState === 'pending') return -1;
        if (b.orderState === 'pending') return 1;
        if (a.orderState === 'finished') return 1;
        if (b.orderState === 'finished') return -1;
        return 0;
    });

    orders.forEach((orderElement) => {
        const ordersListElement = document.createElement('div');
        ordersListElement.classList.add('ordersListElement');
        ordersListElement.classList.add('hoverButton');
        ordersListElement.id = orderElement.orderID;

        const ordersListElementName = document.createElement('div');
        ordersListElementName.classList.add('ordersListElementName');
        ordersListElementName.textContent = orderElement.orderName;
        applyHoverIfNecessary(ordersListElementName, orderElement.orderName);

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
    orderContainer.innerHTML = '';

    const orderElementDiv = document.createElement('div');
    orderElementDiv.classList.add('orderElement');
    orderElementDiv.id = 'orderElement';

    // Order Element Body
    const orderElementBody = document.createElement('div');
    orderElementBody.classList.add('orderElementBody');

    // Order Element Summary Container (Left part)
    const orderElementSummary = document.createElement('div');
    orderElementSummary.classList.add('orderElementSummary');

    const orderElementName = document.createElement('div');
    orderElementName.classList.add('orderElementName');
    orderElementName.textContent = `${order.orderName}`;
    orderElementSummary.appendChild(orderElementName);

    const orderElementState = document.createElement('div');
    orderElementState.classList.add('orderElementState');
    orderElementState.textContent = `${order.orderState}`;
    orderElementState.style.color = getColorForState(order.orderState).background;
    orderElementState.textContent = getColorForState(order.orderState).frText;
    orderElementSummary.appendChild(orderElementState);

    const orderElementDate = document.createElement('div');
    orderElementDate.classList.add('orderElementDate');
    const [date, time] = order.orderDateTime.split(' ');
    orderElementDate.textContent = `Commande passée le ${date} à ${time}`;
    orderElementSummary.appendChild(orderElementDate);

    const orderElementOverviewTitle = document.createElement('div');
    orderElementOverviewTitle.textContent = 'Vue d\'ensemble';
    orderElementOverviewTitle.classList.add('orderElementOverviewTitle');
    orderElementSummary.appendChild(orderElementOverviewTitle);

    const orderElementDetails = document.createElement('div');
    orderElementDetails.classList.add('orderElementDetails');

    // Order Details

    const orderElementSummaryMaterial = document.createElement('div');
    if (order.orderMaterial === 'PLA' || order.orderMaterial === 'PETG' || order.orderMaterial === 'ABS') {
        orderElementSummaryMaterial.textContent = `${order.orderMaterial} (Plastique)`;
    } else if (order.orderMaterial === 'Résine') {
        orderElementSummaryMaterial.textContent = `${order.orderMaterial}`;
    }
    orderElementSummaryMaterial.style.width = 'fit-content';
    orderElementDetails.appendChild(orderElementSummaryMaterial);

    const orderElementSummaryTotalWeight = document.createElement('div');
    if (order.orderTotalWeight > 1000) {
        orderElementSummaryTotalWeight.textContent = `Poids total: ${order.orderTotalWeight / 1000}kg`;
    } else {
        orderElementSummaryTotalWeight.textContent = `Poids total: ${order.orderTotalWeight}g`;
    }
    orderElementSummaryTotalWeight.style.width = 'fit-content';
    orderElementDetails.appendChild(orderElementSummaryTotalWeight);

    const orderElementSummaryQuantityPrice = document.createElement('div');
    orderElementSummaryQuantityPrice.classList.add('orderElementSummaryQuantityPrice');
    orderElementSummaryQuantityPrice.style.display = 'flex';
    orderElementSummaryQuantityPrice.style.flexDirection = 'row';
    orderElementSummaryQuantityPrice.style.justifyContent = 'space-between';
    orderElementSummaryQuantityPrice.style.alignItems = 'baseline';

    const orderElementSummaryQuantity = document.createElement('div');
    if (order.orderQuantity > 1) {
        orderElementSummaryQuantity.textContent = `${order.orderQuantity} pièces`;
    } else {
        orderElementSummaryQuantity.textContent = `${order.orderQuantity} pièce`;
    }
    orderElementSummaryQuantity.style.width = 'fit-content';
    orderElementSummaryQuantity.style.color = 'var(--logoBlue)';
    orderElementSummaryQuantityPrice.appendChild(orderElementSummaryQuantity);

    const orderElementSummaryPrice = document.createElement('div');
    orderElementSummaryPrice.textContent = `${order.orderPrice}€`;
    orderElementSummaryPrice.style.fontSize = '1.5em';
    orderElementSummaryPrice.style.width = 'fit-content';
    orderElementSummaryQuantityPrice.appendChild(orderElementSummaryPrice);

    orderElementDetails.appendChild(orderElementSummaryQuantityPrice);

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

    Object.values(order.orderFiles).forEach((file) => {
        const fileElement = document.createElement('div');
        fileElement.classList.add('fileElement');

        const fileElementName = document.createElement('div');
        fileElementName.classList.add('fileElementName');
        fileElementName.textContent = file.fileName;
        fileElement.appendChild(fileElementName);

        const fileElementRightPart = document.createElement('div');
        fileElementRightPart.classList.add('fileElementRightPart');

        const fileElementDate = document.createElement('div');
        fileElementDate.classList.add('fileElementDate', 'fileElementSubPart');
        const [date, time] = file.fileDateTime.split(' ');
        fileElementDate.textContent = `Déposé le ${date} à ${time}`;
        fileElementRightPart.appendChild(fileElementDate);

        const fileElementSize = document.createElement('div');
        fileElementSize.classList.add('fileElementSubPart');
        if (file.fileWeight >= 1000) {
            fileElementSize.textContent = `${(file.fileWeight / 1000).toFixed(2)}MB`;
        } else {
            fileElementSize.textContent = `${file.fileWeight}KB`;
        }
        fileElementSize.style.fontSize = '0.9em';
        fileElementRightPart.appendChild(fileElementSize);

        const fileElementDownloadButton = document.createElement('img');
        fileElementDownloadButton.classList.add('fileElementDownload');
        fileElementDownloadButton.src = '/src/front/Assets/download_icon.svg';
        fileElementDownloadButton.alt = 'Télécharger';
        fileElementDownloadButton.style.height = '20px';
        fileElementRightPart.appendChild(fileElementDownloadButton);

        fileElement.appendChild(fileElementRightPart);

        orderElementFilesMessageContent.appendChild(fileElement);
    });

    sortFilesByDate();
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

// Show the chat for a specific order
function displayMessages(order) {
    orderElementFilesMessageContent.innerHTML = '';
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

//Function to sort all file elements by date (most recent to oldest)
function sortFilesByDate() {
    const fileElements = Array.from(document.querySelectorAll('.fileElement'));
    fileElements.sort((a, b) => {
        const dateA = new Date(a.querySelector('.filesListElementDate').textContent.split(' ')[2].split('/').reverse().join('-') + 'T' + a.querySelector('.filesListElementDate').textContent.split(' ')[4]);
        const dateB = new Date(b.querySelector('.filesListElementDate').textContent.split(' ')[2].split('/').reverse().join('-') + 'T' + b.querySelector('.filesListElementDate').textContent.split(' ')[4]);
        return dateB - dateA;
    });

    const container = document.querySelector('.orderElementFilesMessageContent');
    container.innerHTML = '';
    fileElements.forEach(element => container.appendChild(element));
}