import {
    applyHoverIfNecessary,
    sortElementsByDate,
    logout,
    capitalizeFirstLetter,
    formatDateTime,
    getColorForState,
    showContentsOfActiveOrder
} from "/src/front/JS/utils.js";
import {addMessageListener, sendMessage} from "./ws_client.js";

const orderContainer = document.getElementById('orderContainer');
const newOrder = document.getElementById('newOrder');
let orderElementFilesMessageContent;
let currentOrderID;
let orderData;
let clientUserData;
export {clientUserData};

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
            showContentsOfActiveOrder(orderData, currentOrderID, 'files', orderElementFilesMessageContent, clientUserData, 'buyer');
            document.getElementById('orderElementFilesButton').addEventListener('click', () => {
                showContentsOfActiveOrder(orderData, currentOrderID, 'files', orderElementFilesMessageContent, clientUserData, 'buyer');
            });
            document.getElementById('orderElementMessageButton').addEventListener('click', () => {
                showContentsOfActiveOrder(orderData, currentOrderID, 'chat', orderElementFilesMessageContent, clientUserData, 'buyer');
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