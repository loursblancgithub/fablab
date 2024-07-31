//fichier avec toutes les fonctions qui peuvent servir un peu partout

export default function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function showHover(element, hoverText) {
    // Create the hover text element
    const hoverElement = document.createElement('div');
    hoverElement.textContent = hoverText;
    hoverElement.classList.add('hover-text');
    hoverElement.style.display = 'none';
    document.body.appendChild(hoverElement);

    // Event listeners to show and hide the hover text
    element.addEventListener('mouseover', function (event) {
        const rect = element.getBoundingClientRect();
        hoverElement.style.left = `${rect.left}px`;
        hoverElement.style.top = `${rect.top + rect.height + 5}px`;
        hoverElement.style.display = 'block';
    });

    element.addEventListener('mouseout', function () {
        hoverElement.style.display = 'none';
    });
}

export function applyHoverIfNecessary(element, hoverText) {
    element.addEventListener('mouseover', function () {
        if (element.scrollWidth > element.clientWidth) {
            showHover(element, hoverText);
        } else {
            element.removeAttribute('title');
        }
    });
}


function showCustomAlert(message) {
    // Create the alert popup
    const alertPopup = document.createElement('div');
    alertPopup.classList.add('alertPopup', 'alertPopupPopIn');
    alertPopup.style.zIndex = '15';

    // Close button container
    const alertCloseContainer = document.createElement('div');
    alertCloseContainer.style.display = 'flex';
    alertCloseContainer.style.justifyContent = 'flex-end';
    alertCloseContainer.style.alignContent = 'flex-start';
    alertCloseContainer.style.width = '100%';

    // Close button
    const alertClose = document.createElement('span');
    alertClose.textContent = '×';
    alertClose.id = 'alertClose';
    alertCloseContainer.appendChild(alertClose);

    alertPopup.appendChild(alertCloseContainer);

    // Alert message
    const alertMessage = document.createElement('div');
    alertMessage.textContent = message;
    alertMessage.style.maxWidth = '100%';
    alertPopup.appendChild(alertMessage);

    document.body.appendChild(alertPopup);

    // Close button event listener
    alertClose.addEventListener('click', () => {
        alertPopup.classList.remove('alertPopupPopIn');
        alertPopup.classList.add('alertPopupPopOut');
        alertPopup.addEventListener('animationend', () => {
            document.body.removeChild(alertPopup);
        }, { once: true });
    });
}

export { showCustomAlert };