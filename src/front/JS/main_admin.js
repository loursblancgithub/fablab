import {
    removeAllChildren,
    applyHoverIfNecessary,
    fiveElements,
    logout,
    capitalizeFirstLetter,
    formatDateTime,
    getColorForState,
    showContentsOfActiveOrder
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
let allOrdersData;
let allUsersData;
let clientUserData;
let cookie;
let currentOrderID;
const orderElementFilesMessageContent = document.getElementById('orderElementFilesMessageContent');

document.addEventListener('DOMContentLoaded', () => {
    fiveElements(document.getElementById('contentContainer'));
    logout(document.getElementById('logoutButton'));
    cookie = document.cookie.split('; ').find(row => row.startsWith('fablabCookie=')).split('=')[1];
    sendMessage({adminOrdersRequest: {}, cookie, getClientUserData: {}});

    addMessageListener((response) => {
        if (response.clientUserData) {
            clientUserData = response.clientUserData;
            console.log("clientUserData", clientUserData);
        } else if (response.adminOrders) {
            allOrdersData = response.adminOrders;
            allUsersData = response.adminUsers;
            console.log("orderData", allOrdersData);
            console.log("userData", allUsersData);

            createOrderMosaicElements(allOrdersData, allUsersData);
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
        createOrderMosaicElements(allOrdersData, allUsersData);
    });

    document.getElementById('sidePanelStateButtonToDo').addEventListener('click', () => {
        contentContainer.innerHTML = '';
        createOrderMosaicElements(allOrdersData.filter(order => order.state === "pending"), allUsersData);
    });

    document.getElementById('sidePanelStateButtonOngoing').addEventListener('click', () => {
        contentContainer.innerHTML = '';
        createOrderMosaicElements(allOrdersData.filter(order => order.state !== "pending" && order.state !== "finished"), allUsersData);
    });

    document.getElementById('sidePanelStateButtonFinished').addEventListener('click', () => {
        contentContainer.innerHTML = '';
        createOrderMosaicElements(allOrdersData.filter(order => order.state === "finished"), allUsersData);
    });

    document.getElementById('orderElementFilesButton').addEventListener('click', () => {
        showContentsOfActiveOrder(allOrdersData, currentOrderID , 'files', orderElementFilesMessageContent, clientUserData, "admin", cookie);
    });

    document.getElementById('orderElementMessageButton').addEventListener('click', () => {
        showContentsOfActiveOrder(allOrdersData, currentOrderID , 'chat', orderElementFilesMessageContent, clientUserData, "admin", cookie);
    });
});

//-------------------------->

//Functions

//-------------------------->

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
        orderClientElement.textContent = getUserNameById(orderElement.fablabuser, userData);
        orderClientElement.classList.add('orderMosaicElementText');
        applyHoverIfNecessary(orderClientElement, `${orderClientElement.textContent}`);
        orderElementHeaderClientState.appendChild(orderClientElement);

        const orderStateDropdown = createStateDropdown(orderElement.state, orderElement.id);
        orderStateDropdown.style.margin = '1vh 0 1vh 0';
        applyHoverIfNecessary(orderStateDropdown, stateOptions[orderElement.state]);
        orderStateDropdown.addEventListener('change', function () {
            const previousValue = orderStateDropdown.value;
            const successfulUpdate = certifyOrderUpdate(this.value, 'state', orderElement.id, cookie);
            if (successfulUpdate) {
                orderElement.state = this.value;
            } else {
                orderElement.state = previousValue;
            }
        });
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
            toggleTextToTextarea(orderTotalWeightElement, orderElement, 'totalweight', userData);

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
            toggleTextToTextarea(orderPriceElement, orderElement, 'price', userData);
        }

        orderMosaicElementDiv.appendChild(orderDetailsElement);
        columns[index % 3].appendChild(orderMosaicElementDiv);

        detailsExpandButton.addEventListener('click', () => {
            console.log(orderElement)
            showOrderDetails(orderElement);
            currentOrderID = orderElement.id;
            showContentsOfActiveOrder(allOrdersData, currentOrderID , 'files', orderElementFilesMessageContent, clientUserData, 'admin', cookie);
        });

        document.getElementById('hideOrderDetails').addEventListener('click', () => {
            document.getElementById('orderElement').style.display = 'none';
            document.querySelector('.pageMask').style.display = 'none';
        });
    });

    contentContainer.innerHTML = '';
    columns.forEach(column => contentContainer.appendChild(column));
}

// Function to populate the order elements mosaic
function toggleTextToTextarea(element, orderElement, property, userData) {
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
            textarea.setAttribute('cols', 4);
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

                    const successfullUpdate = certifyOrderUpdate(newValue, 'totalweight', orderElement.id, cookie);
                    if (successfullUpdate) {
                        div.classList.add('orderMosaicElementText');
                        container.replaceWith(div);
                        toggleTextToTextarea(div, orderElement, property, userData);
                    }
                } else if (property === 'price') {
                    div.textContent = `${orderElement.price}€`;

                    const successfullUpdate = certifyOrderUpdate(newValue, 'price', orderElement.id, cookie);
                    if (successfullUpdate) {
                        div.classList.add('orderMosaicElementText');
                        container.replaceWith(div);
                        toggleTextToTextarea(div, orderElement, property, userData);
                    }
                } else {
                    div.textContent = orderElement[property];
                }
            });
        }
    });
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
    document.getElementById('orderDateTime').textContent = formatDateTime(orderElement.datetime, 'order');

    // Material
    if (orderElement.material === 'pla' || orderElement.material === 'petg' || orderElement.material === 'abs') {
        document.getElementById('orderMaterial').textContent = `${orderElement.material.toUpperCase()} (Plastique)`;
    } else if (orderElement.material === 'Résine') {
        document.getElementById('orderMaterial').textContent = `${orderElement.material}`;
    }

    // Color
    document.getElementById('orderColor').textContent = capitalizeFirstLetter(orderElement.color);

    // Total weight
    const weightElementDetailedView = document.getElementById('orderTotalWeight');
    if (orderElement.totalweight > 1000) {
        weightElementDetailedView.textContent = `Poids total: ${orderElement.totalweight / 1000}kg`;
    } else {
        weightElementDetailedView.textContent = `Poids total: ${orderElement.totalweight}g`;
    }

    // Quantity
    if (orderElement.quantity > 1) {
        document.getElementById('orderQuantity').textContent = `${orderElement.quantity} pièces`;
    } else {
        document.getElementById('orderQuantity').textContent = `${orderElement.quantity} pièce`;
    }

    document.getElementById('orderPrice').textContent = `${orderElement.price}€`;
    document.getElementById('orderQuestion').textContent = `Questions: ${orderElement.question}`;
    if ( orderElement.question === '' || orderElement.question === null || orderElement.question === undefined) {
        document.getElementById('orderQuestion').textContent = 'Questions: Non renseigné';
    }
}

// Function to create the order state dropdown
function createStateDropdown(currentState, orderElement) {
    const dropdown = document.createElement('select');
    dropdown.classList.add('orderStateDropdown');

    Object.entries(stateOptions).forEach(([value, frText]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = frText;
        option.selected = value === currentState;

        const {background, font} = getColorForState(value);
        option.style.backgroundColor = background;
        option.style.color = font;

        dropdown.appendChild(option);
    });

    const {background, font} = getColorForState(currentState);
    dropdown.style.backgroundColor = background;
    dropdown.style.color = font;

    dropdown.addEventListener('change', function () {
        const previousValue = currentState;
        const newValue = this.value;
        const successfulUpdate = certifyOrderUpdate(newValue, 'state', orderElement.id, cookie);
        if (successfulUpdate) {
            const {background, font} = getColorForState(newValue);
            this.style.backgroundColor = background;
            this.style.color = font;
        } else {
            this.value = previousValue;
        }
    });

    return dropdown;
}

// Function to get username by user ID
function getUserNameById(userID, usersData) {
    for (let i = 0; i < usersData.length; i++) {
        if (usersData[i].studentcode === userID) {
            return usersData[i].firstname + ' ' + usersData[i].lastname;
        }
    }
    return 'Unknown User';
}

// Certify the data has been correctly received before changing the field content
async function certifyOrderUpdate(updatedData, field, orderID, cookie) {
    sendMessage({adminOrderUpdate: {newData: {newValue: updatedData, field: field, orderID: orderID}, cookie: cookie}});
    addMessageListener((response) => {
        if (response.success === true) {
            return response.fieldToUpdate === field;
        } else {
            console.error(response.error);
        }
    });
}