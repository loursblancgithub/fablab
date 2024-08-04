//fichier avec toutes les fonctions qui peuvent servir un peu partout

function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

export { removeAllChildren };

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

export { sanitizeOutput };

/*--------------------------

Show details on hover when ellipsed

--------------------------*/

function showHover(element, hoverText) {
    // Create the hover text element
    const hoverElement = document.createElement('div');
    hoverElement.textContent = hoverText;
    hoverElement.classList.add('hover-text');
    hoverElement.style.display = 'none';
    document.body.appendChild(hoverElement);

    // Event listeners to show and hide the hover text
    element.addEventListener('mouseover', function () {
        const rect = element.getBoundingClientRect();
        hoverElement.style.left = `${rect.left}px`;
        hoverElement.style.top = `${rect.top + rect.height + 5}px`;
        hoverElement.style.display = 'block';
    });

    element.addEventListener('mouseout', function () {
        hoverElement.style.display = 'none';
    });
}

function applyHoverIfNecessary(element, hoverText) {
    element.addEventListener('mouseover', function () {
        if (element.scrollWidth > element.clientWidth) {
            showHover(element, hoverText);
        } else {
            element.removeAttribute('title');
        }
    });
}

export { applyHoverIfNecessary };

/*--------------------------

Custom alert popup

--------------------------*/

function showCustomAlert(message) {
    // Create the alert popup
    const alertPopup = document.createElement('div');
    alertPopup.classList.add('alertPopup', 'alertPopupPopIn');
    alertPopup.style.zIndex = '15';

    // Alert message
    const alertMessage = document.createElement('div');
    alertMessage.textContent = message;
    alertMessage.style.maxWidth = '100%';
    alertPopup.appendChild(alertMessage);

    document.body.appendChild(alertPopup);

    // Auto close the alert after 2 seconds
    setTimeoutWithRAF(() => {
        alertPopup.classList.remove('alertPopupPopIn');
        alertPopup.classList.add('alertPopupPopOut');
        alertPopup.addEventListener('animationend', () => {
            document.body.removeChild(alertPopup);
        }, { once: true });
    }, 2000);
}

export { showCustomAlert };

/*--------------------------

Function preventing the use of setTimeout() for security purposes when needing a delay

--------------------------*/

function setTimeoutWithRAF(callback, delay) {
    const start = performance.now();

    function frame(time) {
        if (time - start >= delay) {
            callback();
        } else {
            requestAnimationFrame(frame);
        }
    }

    requestAnimationFrame(frame);
}

export { setTimeoutWithRAF };