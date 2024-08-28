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

function fiveElements(bodyContainer) {
    let buffer = '';
    const fireSequence = 'fire';
    const leafSequence = 'leaf';
    const earthSequence = 'earth';
    const waterSequence = 'water';

    if (bodyContainer.classList === null) {
        bodyContainer.className = '';
    }

    document.addEventListener('keydown', (event) => {
        buffer += event.key.toLowerCase();
        if (buffer.includes(fireSequence)) {
            bodyContainer.classList.add('fire');
            bodyContainer.classList.remove('leaf', 'earth', 'fablabBlueGradient');
            buffer = '';
        } else if (buffer.includes(leafSequence)) {
            bodyContainer.classList.add('leaf');
            bodyContainer.classList.remove('fire', 'earth', 'fablabBlueGradient');
            buffer = '';
        } else if (buffer.includes(earthSequence)) {
            bodyContainer.classList.add('earth');
            bodyContainer.classList.remove('fire', 'leaf', 'fablabBlueGradient');
            buffer = '';
        } else if (buffer.includes(waterSequence)) {
            bodyContainer.classList.add('fablabBlueGradient');
            bodyContainer.classList.remove('fire', 'leaf', 'earth');
            buffer = '';
        }
        if (buffer.length > Math.max(fireSequence.length, leafSequence.length, earthSequence.length)) {
            buffer = buffer.slice(-Math.max(fireSequence.length, leafSequence.length, earthSequence.length));
        }
    });
}

export {fiveElements};
