import {
    applyHoverIfNecessary,
    sortElementsByDate,
    logout,
    capitalizeFirstLetter,
    formatDateTime,
    getColorForState
} from "/src/front/JS/utils.js";
import {addMessageListener, sendMessage} from "./ws_client.js";

const orderContainer = document.getElementById('orderContainer');
const newOrder = document.getElementById('newOrder');
let orderElementFilesMessageContent;
let currentOrderID;
let orderData;
let clientUserData;

/*--------------------------

Main logic

--------------------------*/

document.addEventListener('DOMContentLoaded', () => {
    logout(document.getElementById('logoutButton'));
    const cookie = document.cookie.split('; ').find(row => row.startsWith('fablabCookie=')).split('=')[1];
    sendMessage({fetchOrders: {cookie}});

    addMessageListener(response => {
        if (response.orders) {
            orderData = Object.values(response.orders);
            clientUserData = response.user;
            if (response.user) {
                displayLandingPage(response.user, orderData);
            } else {
                console.error('User data unavailable');
            }
            displayOrdersList(orderData);
        } else if (response.error) {
            console.error(response.error);
        }
    });

    newOrder.addEventListener('click', function () {
        window.location.href = "/src/front/HTML/order.html";
    });

    document.getElementById('ordersListHome').addEventListener('click', () => {
        displayLandingPage(clientUserData, orderData);
    });

    document.getElementById('ordersList').addEventListener('click', function (event) {
        const element = event.target.closest('.ordersListElement');
        if (element) {
            document.querySelectorAll('.ordersListElement').forEach(el => el.classList.remove('active'));
            element.classList.add('active');
            currentOrderID = element.id;
            showContentsOfActiveOrder(orderData, currentOrderID, 'files');
            document.getElementById('orderElementFilesButton').addEventListener('click', () => {
                showContentsOfActiveOrder(orderData, currentOrderID, 'files');
            });
            document.getElementById('orderElementMessageButton').addEventListener('click', () => {
                showContentsOfActiveOrder(orderData, currentOrderID, 'chat');
            });
        }
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
    if (orders.length > 1) {
        landingPageWelcomeText.textContent = `Bienvenue ${user.firstName} !
    Tu as passé ${orders.length} commandes auprès du FabLab. Merci pour ta confiance !
    Si tu as une suggestion, une remarque ou besoin d'aide, n'hésite pas à nous contacter en cliquant sur l'ampoule visible en haut à droite.`;
    } else {
        landingPageWelcomeText.textContent = `Bienvenue ${user.firstName} !
    Tu as passé ta première commande auprès du FabLab. Merci pour ta confiance !
    Si tu as une suggestion, une remarque ou besoin d'aide, n'hésite pas à nous contacter en cliquant sur l'ampoule visible en haut à droite.`;
    }
    landingPageLeftColumn.appendChild(landingPageWelcome);
    landingPageLeftColumn.appendChild(landingPageWelcomeText);

    landingPageElement.appendChild(landingPageLeftColumn);
    orderContainer.appendChild(landingPageElement);

    /*orderContainer.appendChild(landingPageChatContainer);*/

    setTimeout(() => {
        landingPageElement.classList.add('active');
    }, 10);
}

// Function to fill the order list
function displayOrdersList(orders) {
    const ordersList = document.getElementById('ordersList');

    const timeSortedOrders = sortElementsByDate(orders);

    // Sort orders list by state
    timeSortedOrders.sort((a, b) => {
        if (a.orderState === 'pending') return -1;
        if (b.orderState === 'pending') return 1;
        if (a.orderState === 'finished') return 1;
        if (b.orderState === 'finished') return -1;
        return 0;
    });

    timeSortedOrders.forEach((orderElement) => {
        const ordersListElement = document.createElement('div');
        ordersListElement.classList.add('ordersListElement');
        ordersListElement.classList.add('hoverButton');
        ordersListElement.id = orderElement.id;

        const ordersListElementName = document.createElement('div');
        ordersListElementName.classList.add('ordersListElementName');
        ordersListElementName.textContent = orderElement.name;
        applyHoverIfNecessary(ordersListElementName, orderElement.name);

        const ordersListElementState = document.createElement('div');
        ordersListElementState.classList.add('ordersListElementState');
        ordersListElementState.style.backgroundColor = getColorForState(orderElement.state).background;
        ordersListElementState.style.color = getColorForState(orderElement.state).font;
        ordersListElementState.textContent = getColorForState(orderElement.state).frText;

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
    orderElementName.textContent = `${order.name}`;
    orderElementSummary.appendChild(orderElementName);

    const orderElementState = document.createElement('div');
    orderElementState.classList.add('orderElementState');
    orderElementState.textContent = `${order.state}`;
    orderElementState.style.color = getColorForState(order.state).background;
    orderElementState.textContent = getColorForState(order.state).frText;
    orderElementSummary.appendChild(orderElementState);

    const orderElementDate = document.createElement('div');
    orderElementDate.classList.add('orderElementDate');
    orderElementDate.textContent = `${formatDateTime(order.datetime, 'order')}`;
    orderElementSummary.appendChild(orderElementDate);

    const orderElementOverviewTitle = document.createElement('div');
    orderElementOverviewTitle.textContent = 'Vue d\'ensemble';
    orderElementOverviewTitle.classList.add('orderElementOverviewTitle');
    orderElementSummary.appendChild(orderElementOverviewTitle);

    const orderElementDetails = document.createElement('div');
    orderElementDetails.classList.add('orderElementDetails');

    // Order Details
    const orderElementSummaryMaterialColor = document.createElement('div');
    orderElementSummaryMaterialColor.classList.add('orderElementSummaryMaterialColor');

    const orderElementSummaryMaterial = document.createElement('div');
    if (order.material === 'pla' || order.material === 'petg' || order.material === 'abs') {
        orderElementSummaryMaterial.textContent = `${order.material.toUpperCase()} (Plastique)`;
    } else if (order.material === 'Résine') {
        orderElementSummaryMaterial.textContent = `${order.material}`;
    }
    orderElementSummaryMaterial.style.width = 'fit-content';
    orderElementSummaryMaterialColor.appendChild(orderElementSummaryMaterial);

    const orderElementSummaryColor = document.createElement('div');
    orderElementSummaryColor.textContent = `${capitalizeFirstLetter(order.color)}`;
    orderElementSummaryColor.style.width = 'fit-content';
    orderElementSummaryMaterialColor.appendChild(orderElementSummaryColor);

    orderElementDetails.appendChild(orderElementSummaryMaterialColor);

    const orderElementSummaryTotalWeight = document.createElement('div');

    if (order.totalweight <= 0) {
        orderElementSummaryTotalWeight.textContent = 'Poids total: ⌛';
    } else if (order.totalweight > 1000) {
        orderElementSummaryTotalWeight.textContent = `Poids total: ${order.totalweight / 1000}kg`;
    } else {
        orderElementSummaryTotalWeight.textContent = `Poids total: ${order.totalweight}g`;
    }
    orderElementSummaryTotalWeight.style.width = 'fit-content';
    orderElementDetails.appendChild(orderElementSummaryTotalWeight);

    const orderElementSummaryQuantityPrice = document.createElement('div');
    orderElementSummaryQuantityPrice.classList.add('orderElementSummaryQuantityPrice');

    const orderElementSummaryQuantity = document.createElement('div');
    if (order.quantity > 1) {
        orderElementSummaryQuantity.textContent = `${order.quantity} pièces`;
    } else {
        orderElementSummaryQuantity.textContent = `${order.quantity} pièce`;
    }
    orderElementSummaryQuantity.style.width = 'fit-content';
    orderElementSummaryQuantity.style.color = 'var(--logoBlue)';
    orderElementSummaryQuantityPrice.appendChild(orderElementSummaryQuantity);

    const orderElementSummaryPrice = document.createElement('div');
    orderElementSummaryPrice.classList.add('orderElementSummaryPrice');
    if (order.price > 0) {
        orderElementSummaryPrice.textContent = `${order.price}€`;
    } else {
        orderElementSummaryPrice.textContent = '⌛';
    }
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
    orderElementFilesButton.classList.add('orderElementFilesMessageButton');
    orderElementFilesButton.classList.add('hoverButton');
    orderElementFilesButton.id = 'orderElementFilesButton';
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
    setTimeout(() => {
        orderElementDiv.classList.add('active');
    }, 10);
}

// Function to show files of the active order
function showContentsOfActiveOrder(orderData, activeOrderId, dataType) {
    if (activeOrderId) {
        const activeOrder = orderData.find(order => order.id === Number(activeOrderId));
        if (dataType === 'files') {
            displayFilesList(activeOrder);
        } else if (dataType === 'chat') {
            displayMessages(activeOrder, clientUserData);
        }
    }
}

// Show the files list for a specific order
function displayFilesList(order) {
    orderElementFilesMessageContent.innerHTML = '';

    const files = order.files ? Object.values(order.files) : [];
    const sortedFiles = sortElementsByDate(files);

    sortedFiles.forEach((file) => {
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
        fileElementDate.textContent = `${formatDateTime(file.fileDateTime, 'file')}`;
        fileElementRightPart.appendChild(fileElementDate);

        const fileElementSize = document.createElement('div');
        fileElementSize.classList.add('fileElementSubPart');
        if (file.fileWeight >= 1000) {
            fileElementSize.textContent = `${(file.fileWeight / 1000).toFixed(2)}ko`;
        } else {
            fileElementSize.textContent = `${file.fileWeight}KB`;
        }
        fileElementSize.style.fontSize = '0.9em';
        fileElementRightPart.appendChild(fileElementSize);

        const fileElementDownloadButton = createSVGElement('download_icon', 'Télécharger');
        fileElementDownloadButton.classList.add('fileElementDownload');
        fileElementDownloadButton.style.height = '20px';
        fileElementRightPart.appendChild(fileElementDownloadButton);

        fileElement.appendChild(fileElementRightPart);

        orderElementFilesMessageContent.appendChild(fileElement);
    });
}

// Show the chat for a specific order
function displayMessages(order, userData) {
    orderElementFilesMessageContent.innerHTML = '';

    const chatFeed = document.createElement('div');
    chatFeed.classList.add('chatFeed');
    orderElementFilesMessageContent.appendChild(chatFeed);

    const chatContent = order.chat;
    if (!chatContent || Object.keys(chatContent).length === 0) {
        chatFeed.textContent = 'Personne n\'a encore rien dit...';
        chatFeed.style.textAlign = 'center';
    } else {
        const chatMessages = Object.values(chatContent.chatMessages);
        chatMessages.sort((a, b) => new Date(a.msgDate) - new Date(b.msgDate)); // Sort in ascending order
        chatMessages.forEach((message) => {
            appendMessage(message);
        });
    }

    const chatInputs = document.createElement('div');
    chatInputs.classList.add('chatInputs');
    orderElementFilesMessageContent.appendChild(chatInputs);

    const filesInput = createSVGElement('files_icon', 'Ajouter un fichier');
    filesInput.classList.add('chatFilesInput');
    chatInputs.appendChild(filesInput);

    const chatMessageInputContainer = document.createElement('div');
    chatMessageInputContainer.classList.add('chatMessageInputContainer');

    const chatMessageTextarea = document.createElement('textarea');
    chatMessageTextarea.classList.add('chatMessageTextarea');
    chatMessageTextarea.placeholder = 'Écris un message...';
    chatMessageInputContainer.appendChild(chatMessageTextarea);

    const chatMessageSendButton = createSVGElement('send_icon', 'Envoyer');
    chatMessageSendButton.classList.add('chatMessageSendButton');
    chatMessageSendButton.id = 'chatMessageSendButton';
    chatMessageInputContainer.appendChild(chatMessageSendButton);

    chatInputs.appendChild(chatMessageInputContainer);

    document.getElementById('chatMessageSendButton').addEventListener('click', () => {
        const chatMessageTextarea = document.querySelector('.chatMessageTextarea');
        const messageContent = chatMessageTextarea.value.trim();

        if (messageContent) {
            const message = {
                orderID: order.id,
                msgID: `msg_${Date.now()}`,
                msgSender: userData.studentCode,
                msgDate: new Date().toLocaleString('fr-FR', {timeZone: 'Europe/Paris'}),
                msgContent: messageContent
            };
            sendMessage({newChatMessage: message});
            addMessageListener((response) => {
                if (response.success) {
                    chatMessageTextarea.value = '';
                    appendMessage(message);
                }
            });
        }
    });
}

// Function to append a new message to the chat feed
function appendMessage(message) {
    const chatFeed = document.querySelector('.chatFeed');

    if (chatFeed.textContent === 'Personne n\'a encore rien dit...') {
        chatFeed.textContent = '';
        chatFeed.style.textAlign = 'left';
    }

    if (document.getElementById(message.msgID)) {
        return;
    }

    const messageElement = document.createElement('div');
    messageElement.classList.add('messageElement');
    messageElement.id = message.msgID; // Set the ID of the message element to the msgID
    const messageElementBody = document.createElement('div');
    messageElementBody.classList.add('messageElementBody');
    const messageElementSender = document.createElement('div');
    messageElementSender.classList.add('messageElementSender');
    if (message.msgSender === 'FabLab') {
        messageElementSender.textContent = 'FabLab';
    } else {
        messageElementSender.textContent = '';
    }
    messageElementBody.appendChild(messageElementSender);

    const messageElementContent = document.createElement('div');
    messageElementContent.classList.add('messageElementContent');
    messageElementContent.textContent = message.msgContent;
    messageElementBody.appendChild(messageElementContent);
    messageElement.appendChild(messageElementBody);

    const messageElementDateTime = document.createElement('div');
    messageElementDateTime.classList.add('messageElementDateTime');
    messageElementDateTime.textContent = message.msgDate;
    messageElement.appendChild(messageElementDateTime);

    if (message.msgSender === 'FabLab') {
        messageElement.classList.add('leftColumn');
        messageElementBody.classList.add('leftColumnBubble');
        messageElementDateTime.style.alignSelf = 'flex-start';
    } else {
        messageElement.classList.add('rightColumn');
        messageElementBody.classList.add('rightColumnBubble');
    }
    chatFeed.appendChild(messageElement);
    orderData.find(order => order.id === message.orderID).chat.chatMessages[message.msgID] = message;
}

// Create the svg elements working with the sprite
function createSVGElement(name, alt) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('svgIcon');
    svg.alt = alt;
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `/src/front/Assets/sprite.svg#${name}`);
    svg.appendChild(use);
    return svg;
}