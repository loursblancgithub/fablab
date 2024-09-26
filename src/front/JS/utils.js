import {addMessageListener, sendMessage} from "./ws_client.js";

function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

export {removeAllChildren};

/*--------------------------

Sanitize inputs

--------------------------*/

function sanitizeOutput(toOutput) {
    return toOutput.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

export {sanitizeOutput};

/*--------------------------

Sanitize inputs

--------------------------*/

function logout(logoutButton) {
    logoutButton.addEventListener('click', () => {
        const fablabCookie = document.cookie.split('; ').find(row => row.startsWith('fablabCookie=')).split('=')[1];
        sendMessage({logout: true, cookie: fablabCookie});

        addMessageListener((response) => {
            if (response.redirect) {
                document.cookie = 'fablabCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                window.location.replace(`/src/front/HTML/${response.redirect}`);
            }
        });
    });
}

export {logout};

/*--------------------------

Show details on hover when ellipsed

--------------------------*/

function showHover(element, hoverText) {
    // Create the hover text element
    const hoverElement = document.createElement('div');
    hoverElement.textContent = hoverText;
    hoverElement.classList.add('hoverText');
    hoverElement.style.display = 'none';
    document.body.appendChild(hoverElement);

    const rect = element.getBoundingClientRect();
    hoverElement.style.left = `${rect.left}px`;
    hoverElement.style.top = `${rect.top + rect.height + 5}px`;
    hoverElement.style.display = 'block';

    element.addEventListener('mouseout', function () {
        hoverElement.style.display = 'none';
    });
}

function applyHoverIfNecessary(element, hoverText) {
    element.addEventListener('mouseover', function () {
        if (element.scrollWidth > element.clientWidth) {
            showHover(element, hoverText);
        }
    });
}

export {applyHoverIfNecessary};

/*--------------------------

Custom alert popup

--------------------------*/

function showCustomAlert(message, level) {
    // Create the alert popup
    const alertPopup = document.createElement('div');
    alertPopup.classList.add('alertPopup', 'alertPopupPopIn');
    alertPopup.style.zIndex = '15';

    if (level === 'red') {
        alertPopup.style.backgroundColor = '#eaa5a5';
        alertPopup.style.color = '#931c1c';
    } else if (level === 'orange') {
        alertPopup.style.backgroundColor = '#eacca5';
        alertPopup.style.color = '#93611c';
    } else if (level === 'green') {
        alertPopup.style.backgroundColor = '#a5eaa5';
        alertPopup.style.color = '#1c931c';
    }

    // Alert message
    const alertMessage = document.createElement('div');
    alertMessage.textContent = message;
    alertMessage.style.maxWidth = '100%';
    alertPopup.appendChild(alertMessage);

    document.body.appendChild(alertPopup);

    // Auto close the alert after 2 seconds
    setTimeout(() => {
        alertPopup.classList.remove('alertPopupPopIn');
        alertPopup.classList.add('alertPopupPopOut');
        alertPopup.addEventListener('animationend', () => {
            document.body.removeChild(alertPopup);
        }, {once: true});
    }, 2000);
}

export {showCustomAlert};

/*--------------------------

Function sorting elements in received json by date

--------------------------*/

function sortElementsByDate(elements) {
    return elements.sort((a, b) => {
        if (!a.orderDateTime || !b.orderDateTime) {
            return !a.orderDateTime ? 1 : -1;
        }
        const dateA = new Date(a.orderDateTime.split(' ')[0].split('/').reverse().join('-') + ' ' + a.orderDateTime.split(' ')[1]);
        const dateB = new Date(b.orderDateTime.split(' ')[0].split('/').reverse().join('-') + ' ' + b.orderDateTime.split(' ')[1]);
        return dateB - dateA;
    });
}

export {sortElementsByDate};

/*--------------------------

Congratulations on finding this, on behalf of all the team

--------------------------*/

function fiveElements(affectedContainer) {
    let buffer = '';
    const fireSequence = 'fire';
    const leafSequence = 'leaf';
    const earthSequence = 'earth';
    const waterSequence = 'water';

    const gradients = {
        fire: 'linear-gradient(219deg, #ff7e5f, #feb47b)',
        leaf: 'linear-gradient(500deg, #00b09b, #96c93d)',
        earth: 'linear-gradient(150deg, #7b4397, #dc2430)',
        fablabBlueGradient: 'linear-gradient(40deg, #7287ca, #2e4798)'
    };

    if (affectedContainer.classList === null) {
        affectedContainer.className = '';
    }

    affectedContainer.classList.add('fablabBlueGradient');
    affectedContainer.style.backgroundImage = gradients.fablabBlueGradient;

    document.addEventListener('keydown', (event) => {
        buffer += event.key.toLowerCase();
        if (buffer.includes(fireSequence)) {
            affectedContainer.classList.remove('leaf', 'earth', 'fablabBlueGradient');
            affectedContainer.classList.add('fire');
            updateGradient(affectedContainer, gradients.fire);
            buffer = '';
        } else if (buffer.includes(leafSequence)) {
            affectedContainer.classList.remove('fire', 'earth', 'fablabBlueGradient');
            affectedContainer.classList.add('leaf');
            updateGradient(affectedContainer, gradients.leaf);
            buffer = '';
        } else if (buffer.includes(earthSequence)) {
            affectedContainer.classList.remove('fire', 'leaf', 'fablabBlueGradient');
            affectedContainer.classList.add('earth');
            updateGradient(affectedContainer, gradients.earth);
            buffer = '';
        } else if (buffer.includes(waterSequence)) {
            affectedContainer.classList.remove('fire', 'leaf', 'earth');
            affectedContainer.classList.add('fablabBlueGradient');
            updateGradient(affectedContainer, gradients.fablabBlueGradient);
            buffer = '';
        }
        if (buffer.length > Math.max(fireSequence.length, leafSequence.length, earthSequence.length)) {
            buffer = buffer.slice(-Math.max(fireSequence.length, leafSequence.length, earthSequence.length));
        }
    });
}

function updateGradient(element, newGradient) {
    element.style.backgroundImage = '';
    requestAnimationFrame(() => {
        element.style.backgroundImage = newGradient;
    });
}

export {fiveElements};

/*--------------------------

In the name

--------------------------*/

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export {capitalizeFirstLetter};

/*--------------------------

Create a date to be displayed

--------------------------*/

function formatDateTime(isoDate, type) {
    const date = new Date(isoDate);
    const options = {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const parisTimeString = date.toLocaleString('fr-FR', options).replace(',', '');
    const [datePart, timePart] = parisTimeString.split(' ');
    const [day, month, year] = datePart.split('/');
    if (type === 'file') {
        return `Envoyé le ${day}/${month}/${year} à ${timePart}`;
    } else if (type === 'order') {
        return `Passée le ${day}/${month}/${year} à ${timePart}`;
    }
}

export {formatDateTime};

/*--------------------------

Select the right color for each order state

--------------------------*/

function getColorForState(state) {
    const stateColorMapping = {
        pending: {background: '#215a6c', font: '#ffffff', frText: "En attente", value: "pending"},
        billed: {background: '#5A3286', font: '#ffffff', frText: "Facturé", value: "billed"},
        printed: {background: '#5A3286', font: '#ffffff', frText: "Imprimé", value: "printed"},
        sliced: {background: '#5A3286', font: '#ffffff', frText: "Slicé", value: "sliced"},
        printing: {background: '#5A3286', font: '#ffffff', frText: "En cours d'impression", value: "printing"},
        finished: {background: '#0A53A8', font: '#ffffff', frText: "Terminé", value: "finished"},
    };

    return stateColorMapping[state] || {background: '#bdbdbd', font: '#000000'}; // Default colors
}

export {getColorForState};

/*--------------------------

Show the files list for a specific order

--------------------------*/

function displayFilesList(order, filesListContainer) {
    filesListContainer.innerHTML = '';

    const files = order.files ? Object.values(order.files) : [];
    const sortedFiles = sortElementsByDate(files);

    sortedFiles.forEach((file) => {
        console.log('file:', file);
        const fileElement = document.createElement('div');
        fileElement.classList.add('fileElement');

        const fileElementName = document.createElement('div');
        fileElementName.classList.add('fileElementName');
        fileElementName.textContent = file.fileName.concat('.', file.fileExtension);
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
        console.log('file.name', file.fileName);
        fileElementRightPart.appendChild(fileElementDownloadButton);

        fileElement.appendChild(fileElementRightPart);

        filesListContainer.appendChild(fileElement);

        fileElementDownloadButton.addEventListener('click', () => sendMessage({fileRequest: {fileName: file.fileName, fileExtension: file.fileExtension, orderID: order.id}}));
        addMessageListener((response) => {
            if (response.fileDownload) {
                console.log('response.fileDownload:', response.fileDownload.fileExtension);
                const fileData = response.fileDownload;
                const blob = new Blob([new Uint8Array(fileData.fileData)], {type: `application/${fileData.fileExtension}`});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileData.fileName.concat('.', fileData.fileExtension);
                a.click();
                URL.revokeObjectURL(url);
            } else if (response.fileDownloadError) {
                showCustomAlert('Erreur lors du téléchargement du fichier', 'red');
            }
        });
    });
}

export {displayFilesList};

/*--------------------------

Show the chat for a specific order

--------------------------*/

function displayMessages(allOrdersData, order, userData, chatContainer, clientStatus, cookie) {
    chatContainer.innerHTML = '';

    const chatFeed = document.createElement('div');
    chatFeed.classList.add('chatFeed');
    chatContainer.appendChild(chatFeed);

    const chatContent = order.chat;
    if (!chatContent || Object.keys(chatContent).length === 0) {
        chatFeed.textContent = 'Personne n\'a encore rien dit...';
        chatFeed.style.textAlign = 'center';
    } else {
        const chatMessages = Object.values(chatContent.chatMessages);
        chatMessages.sort((a, b) => new Date(a.msgDate) - new Date(b.msgDate)); // Sort in ascending order
        chatMessages.forEach((message) => {
            appendMessage(allOrdersData, message, clientStatus);
        });
    }

    const chatInputs = document.createElement('div');
    chatInputs.classList.add('chatInputs');
    chatContainer.appendChild(chatInputs);

    const filesInput = createSVGElement('files_icon', 'Ajouter un fichier');
    filesInput.classList.add('chatFilesInput');
    chatInputs.appendChild(filesInput);
    filesInput.addEventListener('click', () => {
        showFilesPopup(allOrdersData, order.id, cookie);
    });

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
    chatMessageTextarea.focus();

    addMessageListener((response) => {
        if (response.newExternalMessage) {
            appendMessage(response.newExternalMessage);
        }
    })

    document.getElementById('chatMessageSendButton').addEventListener('click', () => {
        const chatMessageTextarea = document.querySelector('.chatMessageTextarea');
        const messageContent = chatMessageTextarea.value.trim();

        let msgSender
        if (clientStatus === 'admin') {
            msgSender = 'FabLab';
        } else {
            msgSender = userData.studentCode;
        }

        if (messageContent) {
            const message = {
                orderID: order.id,
                msgID: `msg_${Date.now()}`,
                msgSender: msgSender,
                msgDate: new Date().toLocaleString('fr-FR', {timeZone: 'Europe/Paris'}),
                msgContent: messageContent
            };
            sendMessage({newChatMessage: message});
            addMessageListener((response) => {
                if (response.success) {
                    chatMessageTextarea.value = '';
                    appendMessage(allOrdersData, message, clientStatus);
                }
            });
        }
    });
}

export {displayMessages};

/*--------------------------

Function to append a new message to the chat feed

--------------------------*/

function appendMessage(allOrders, message) {
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
    allOrders.find(order => order.id === message.orderID).chat.chatMessages[message.msgID] = message;
}

/*--------------------------

Create the svg elements working with the sprite

--------------------------*/

function createSVGElement(name, alt) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('svgIcon');
    svg.alt = alt;
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `/src/front/Assets/sprite.svg#${name}`);
    svg.appendChild(use);
    return svg;
}

export {createSVGElement};

/*--------------------------

Function to show files or chat of the active order

--------------------------*/

function showContentsOfActiveOrder(allOrdersData, activeOrderId, dataType, filesMessagesContainer, clientUserData, clientStatus, cookie) {
    if (activeOrderId) {
        const activeOrder = allOrdersData.find(order => order.id === Number(activeOrderId));
        if (dataType === 'files') {
            displayFilesList(activeOrder, filesMessagesContainer);
        } else if (dataType === 'chat') {
            displayMessages(allOrdersData, activeOrder, clientUserData, filesMessagesContainer, clientStatus, cookie);
        }
    }
}

export {showContentsOfActiveOrder};

/*--------------------------

Function to show file upload pop up

--------------------------*/

function showFilesPopup(allOrdersData, activeOrderId, cookie) {
    if (document.querySelector('.filesPopup')) {
        return;
    }

    const chatFeed = document.querySelector('.chatFeed');
    chatFeed.style.position = 'relative';

    // Creating the page mask
    const pageMask = document.createElement('div');
    pageMask.classList.add('pageMask');
    pageMask.style.zIndex = '50';
    pageMask.style.position = 'absolute';
    pageMask.style.top = '0';
    pageMask.style.left = '0';
    pageMask.style.height = '100%';
    pageMask.style.width = '100%';
    pageMask.style.opacity = '0.5';
    pageMask.style.backgroundColor = '#ffffff';

    // Creating the files popup
    const filesPopup = document.createElement('div');
    filesPopup.classList.add('filesPopup');
    filesPopup.style.zIndex = '52';
    filesPopup.style.position = 'absolute';
    filesPopup.style.transform = 'translate(-50%, -50%)';
    filesPopup.style.backgroundColor = '#ffffff';

    const filesPopupTitleClose = document.createElement('div');
    filesPopupTitleClose.classList.add('filesPopupTitleClose');

    const filesPopupTitle = document.createElement('div');
    filesPopupTitle.classList.add('filesPopupTitle');
    filesPopupTitle.textContent = 'Ajouter un fichier';
    filesPopupTitleClose.appendChild(filesPopupTitle);

    const filesPopupCloseButton = document.createElement('span');
    filesPopupCloseButton.classList.add('filesPopupClose');
    filesPopupCloseButton.textContent = '×';
    filesPopupTitleClose.appendChild(filesPopupCloseButton);

    filesPopup.appendChild(filesPopupTitleClose);

    const filesPopupInput = document.createElement('input');
    filesPopupInput.type = 'file';
    filesPopupInput.accept = '.stl, .3mf, .stp, .step';
    filesPopup.appendChild(filesPopupInput);

    const filesPopupSubmitButton = document.createElement('button');
    filesPopupSubmitButton.classList.add('blueButton');
    filesPopupSubmitButton.textContent = 'Envoyer';
    filesPopupSubmitButton.style.width = '40%';
    filesPopupSubmitButton.style.border = 'none';
    filesPopupSubmitButton.style.alignSelf = 'center';
    filesPopup.appendChild(filesPopupSubmitButton);

    // Adding the page mask and the files popup to the chat feed
    chatFeed.appendChild(pageMask);
    chatFeed.appendChild(filesPopup);

    // Submit the file when the submit button is clicked
    filesPopupSubmitButton.addEventListener('click', async () => {
        if (filesPopupInput.files.length > 0) {
            const file = filesPopupInput.files[0];
            try {
                const preparedFile = await prepareFile(file);
                sendMessage({newFile: preparedFile, orderID: activeOrderId, cookie: cookie});
                addMessageListener((response) => {
                    if (response.newFileSendSuccess) {
                        const order = allOrdersData.find(order => order.id === activeOrderId);
                        if (order) {
                            if (!order.files) {
                                order.files = [];
                            }
                            console.log('order.files:', order.files);
                            console.log('order.files.type', typeof order.files);
                            order.files.newKey = preparedFile;
                        }

                        showCustomAlert('Fichier envoyé avec succès', 'green');
                        setTimeout(() => {
                            filesPopupInput.value = '';
                            while (document.querySelectorAll('.pageMask')[0]) {
                                chatFeed.removeChild(document.querySelectorAll('.pageMask')[0]);
                            }
                            while (document.querySelectorAll('.filesPopup')[0]) {
                                chatFeed.removeChild(document.querySelectorAll('.filesPopup')[0]);
                            }
                        }, 2000);
                    }
                });
            } catch (error) {
                console.error('Error preparing file:', error);
                showCustomAlert('Erreur lors de la préparation du fichier', 'red');
            }
        }
    });

    // Close popup on clicking the close button
    filesPopupCloseButton.addEventListener('click', () => {
        chatFeed.removeChild(filesPopup);
        chatFeed.removeChild(pageMask);
    });
}

/*--------------------------

Function to show file upload pop up

--------------------------*/

async function prepareFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const binaryData = event.target.result;
            const fileDateTime = new Date().toISOString();
            const fileWeight = file.size;

            console.log('Treating:', file.name);

            const fileNameParts = file.name.split('.');
            const fileExtension = fileNameParts.pop();
            const fileName = fileNameParts.join('.');

            resolve({
                fileName: fileName,
                fileExtension: fileExtension,
                fileData: Array.from(new Uint8Array(binaryData)),
                fileDateTime: fileDateTime,
                fileWeight: fileWeight
            });
        };
        reader.onerror = function (error) {
            reject(error);
        };
        reader.readAsArrayBuffer(file);
    });
}

export {prepareFile};