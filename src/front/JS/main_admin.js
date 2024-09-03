import {
    removeAllChildren,
    applyHoverIfNecessary,
    fiveElements,
    logout,
    capitalizeFirstLetter,
    formatDateTime
} from "/src/front/JS/utils.js";
import {addMessageListener, sendMessage} from "./ws_client.js";


const stateOptions = {
    pending: 'En attente',
    billed: 'Facturé',
    printed: 'Imprimé',
    sliced: 'Slicé',
    printing: 'En cours d\'impression',
    finished: 'Terminé'
}

const contentContainer = document.getElementById('contentContainer');
let orderData;
let userData;

document.addEventListener('DOMContentLoaded', () => {
    fiveElements(document.getElementById('bodyContainer'));
    logout(document.getElementById('logoutButton'));
    const cookie = document.cookie.split('; ').find(row => row.startsWith('fablabCookie=')).split('=')[1];
    sendMessage({adminOrdersRequest: {}, cookie});

    addMessageListener((response) => {
        if (response.adminOrders) {
            orderData = response.adminOrders;
            userData = response.adminUsers;
            console.log("orderData", orderData);
            console.log("userData", userData);

            createOrderMosaicElements(orderData, userData);
        }
    });

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

    document.getElementById('sidePanelStateButtonAll').addEventListener('click', () => {
        contentContainer.innerHTML = '';
        createOrderMosaicElements(orderData, userData);
    });

    document.getElementById('sidePanelStateButtonToDo').addEventListener('click', () => {
        contentContainer.innerHTML = '';
        createOrderMosaicElements(orderData.filter(order => order.state === "pending"), userData);
    });

    document.getElementById('sidePanelStateButtonOngoing').addEventListener('click', () => {
        contentContainer.innerHTML = '';
        createOrderMosaicElements(orderData.filter(order => order.state !== "pending" && order.state !== "finished"), userData);
    });

    document.getElementById('sidePanelStateButtonFinished').addEventListener('click', () => {
        contentContainer.innerHTML = '';
        createOrderMosaicElements(orderData.filter(order => order.state === "finished"), userData);
    });
});

//-------------------------->

//Functions

//-------------------------->

// Function to populate the order elements mosaic
function toggleTextToTextarea(element, orderElement, property) {
    element.addEventListener('click', function () {
        if (element.tagName === 'DIV') {
            const originalValue = orderElement[property];
            const container = document.createElement('div');
            container.classList.add('orderMosaicElementText');

            const prefixSpan = document.createElement('span');
            const suffixSpan = document.createElement('span');
            const textarea = document.createElement('textarea');

            if (property === 'totalweight') {
                prefixSpan.textContent = 'Poids total: ';
                suffixSpan.textContent = 'g';
            } else if (property === 'price') {
                suffixSpan.textContent = '€';
            }

            textarea.value = originalValue;
            textarea.classList.add('orderMosaicElementText');
            textarea.setAttribute('cols', 7);
            textarea.setAttribute('rows', 1);
            textarea.style.resize = 'none';

            container.appendChild(prefixSpan);
            container.appendChild(textarea);
            container.appendChild(suffixSpan);
            element.replaceWith(container);
            textarea.focus();

            textarea.addEventListener('blur', function () {
                const newValue = textarea.value.trim();
                if (newValue === '' || isNaN(newValue)) {
                    orderElement[property] = originalValue;
                } else {
                    orderElement[property] = newValue;
                }
                const div = document.createElement('div');
                if (property === 'totalweight') {
                    if (orderElement.totalweight > 1000) {
                        div.textContent = `Poids total: ${orderElement.totalweight / 1000}kg`;
                    } else {
                        div.textContent = `Poids total: ${orderElement.totalweight}g`;
                    }
                } else if (property === 'price') {
                    div.textContent = `${orderElement.price}€`;
                } else {
                    div.textContent = orderElement[property];
                }
                div.classList.add('orderMosaicElementText');
                container.replaceWith(div);
                toggleTextToTextarea(div, orderElement, property);
            });
        }
    });
}

// Modify the createOrderMosaicElements function
function createOrderMosaicElements(orderData, userData) {
    const contentContainer = document.getElementById('contentContainer');
    if (!contentContainer) {
        console.error('Content container not found');
        return;
    }

    const columns = [document.createElement('div'), document.createElement('div'), document.createElement('div')];
    columns.forEach(column => column.classList.add('column'));

    orderData.sort((a, b) => {
        if (a.state === 'pending') return -1;
        if (b.state === 'pending') return 1;
        if (a.state === 'finished') return 1;
        if (b.state === 'finished') return -1;
        return 0;
    });

    orderData.forEach((orderElement, index) => {
        const orderMosaicElementDiv = document.createElement('div');
        orderMosaicElementDiv.classList.add('orderMosaicElement');

        const orderElementHeader = document.createElement('div');
        orderElementHeader.classList.add('orderMosaicElementHeader');

        const orderNameElement = document.createElement('div');
        orderNameElement.textContent = `${orderElement.name}`;
        orderNameElement.classList.add('orderMosaicElementTitle');
        orderNameElement.classList.add('orderMosaicElementText');
        applyHoverIfNecessary(orderNameElement, `${orderElement.name}`);
        orderElementHeader.appendChild(orderNameElement);

        const orderElementHeaderClientState = document.createElement('div');
        orderElementHeaderClientState.classList.add('orderElementHeaderClientState');

        const orderClientElement = document.createElement('div');
        orderClientElement.textContent = getUserNameById(orderElement.userID, userData);
        orderClientElement.classList.add('orderMosaicElementText');
        applyHoverIfNecessary(orderClientElement, `${orderClientElement.textContent}`);
        orderElementHeaderClientState.appendChild(orderClientElement);

        const orderStateDropdown = createStateDropdown(orderElement.state);
        orderStateDropdown.style.margin = '1vh 0 1vh 0';
        applyHoverIfNecessary(orderStateDropdown, stateOptions[orderElement.state]);
        orderElementHeaderClientState.appendChild(orderStateDropdown);

        orderElementHeader.appendChild(orderElementHeaderClientState);

        const orderElementDateTime = document.createElement('div');
        orderElementDateTime.textContent = formatDateTime(orderElement.datetime, 'order');
        orderElementDateTime.classList.add('orderMosaicElementDateTime');
        orderElementHeader.appendChild(orderElementDateTime);

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
            const orderMaterialColorElement = document.createElement('div');
            orderMaterialColorElement.classList.add('orderMosaicElementMaterialColor');

            const orderMaterialElement = document.createElement('div');
            if (orderElement.material === 'pla' || orderElement.material === 'petg' || orderElement.material === 'abs') {
                orderMaterialElement.textContent = `${orderElement.material.toUpperCase()} (Plastique)`;
            } else if (orderElement.material === 'Résine') {
                orderMaterialElement.textContent = `${orderElement.material}`;
            }
            orderMaterialElement.classList.add('orderMosaicElementText');
            orderMaterialColorElement.appendChild(orderMaterialElement);

            const orderColorElement = document.createElement('div');
            orderColorElement.textContent = `${capitalizeFirstLetter(orderElement.color)}`;
            orderColorElement.classList.add('orderMosaicElementText');
            orderMaterialColorElement.appendChild(orderColorElement);

            orderMosaicElementDiv.appendChild(orderMaterialColorElement);

            const weightQuantityDiv = document.createElement('div');
            weightQuantityDiv.classList.add('orderMosaicElementWeightQuantity');

            const orderTotalWeightElement = document.createElement('div');
            if (orderElement.totalweight > 1000) {
                orderTotalWeightElement.textContent = `Poids total: ${orderElement.totalweight / 1000}kg`;
            } else if (orderElement.totalweight === 0 || orderElement.totalweight === null) {
                orderTotalWeightElement.textContent = `Poids total: ⌛g`;
            } else {
                orderTotalWeightElement.textContent = `Poids total: ${orderElement.totalweight}g`;
            }
            orderTotalWeightElement.classList.add('orderMosaicElementText');
            weightQuantityDiv.appendChild(orderTotalWeightElement);
            toggleTextToTextarea(orderTotalWeightElement, orderElement, 'totalweight');

            const orderQuantityElement = document.createElement('div');
            if (orderElement.quantity > 1) {
                orderQuantityElement.textContent = `${orderElement.quantity} pièces`;
            } else {
                orderQuantityElement.textContent = `${orderElement.quantity} pièce`;
            }
            orderQuantityElement.classList.add('orderQuantityElementText');
            orderQuantityElement.classList.add('orderMosaicElementText');
            weightQuantityDiv.appendChild(orderQuantityElement);

            orderMosaicElementDiv.appendChild(weightQuantityDiv);

            const orderPriceElement = document.createElement('div');
            if (orderElement.price === 0 || orderElement.price === null) {
                orderPriceElement.textContent = `⌛€`;
            } else {
                orderPriceElement.textContent = `${orderElement.price}€`;
            }
            orderPriceElement.classList.add('orderMosaicElementText');
            orderMosaicElementDiv.appendChild(orderPriceElement);
            toggleTextToTextarea(orderPriceElement, orderElement, 'price');
        }

        orderMosaicElementDiv.appendChild(orderDetailsElement);
        columns[index % 3].appendChild(orderMosaicElementDiv);

        detailsExpandButton.addEventListener('click', () => {
            console.log(orderElement)
            showOrderDetails(orderElement);
        });

        document.getElementById('hideOrderDetails').addEventListener('click', () => {
            document.getElementById('orderElement').style.display = 'none';
            document.querySelector('.pageMask').style.display = 'none';
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
    document.getElementById('orderName').textContent = orderElement.name;

    // State
    document.getElementById('orderState').textContent = stateOptions[orderElement.state];

    // Date
    const [date, time] = orderElement.orderDateTime.split(' ');
    document.getElementById('orderDateTime').textContent = `Commande passée le ${date} à ${time}`;

    // Material
    if (orderElement.material === 'PLA' || orderElement.material === 'PETG' || orderElement.material === 'ABS') {
        document.getElementById('orderMaterial').textContent = `${orderElement.material} (Plastique)`;
    } else if (orderElement.material === 'Résine') {
        document.getElementById('orderMaterial').textContent = `${orderElement.material}`;
    }

    // Weight
    if (orderElement.totalweight > 1000) {
        document.getElementById('orderTotalWeight').textContent = `Poids total: ${orderElement.totalweight / 1000}kg`;
    } else {
        document.getElementById('orderTotalWeight').textContent = `Poids total: ${orderElement.totalweight}g`;
    }

    // Quantity
    if (orderElement.quantity > 1) {
        document.getElementById('orderQuantity').textContent = `${orderElement.quantity} pièces`;
    } else {
        document.getElementById('orderQuantity').textContent = `${orderElement.quantity} pièce`;
    }

    document.getElementById('orderPrice').textContent = `${orderElement.price}€`;
    document.getElementById('orderQuestion').textContent = `Questions: ${orderElement.question}`;
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