import {sendMessage, addMessageListener} from "./ws_client.js";
import {sanitizeOutput, showCustomAlert} from "./utils.js";
import {clientUserData} from "./main_client.js";

document.addEventListener('DOMContentLoaded', () => {
    const formBulb = document.getElementById('formBulb');
    const pageMask = document.createElement('div');
    pageMask.classList.add('pageMask');

    let feedbackForm;

    formBulb.addEventListener('click', () => {
        if (document.getElementById('feedbackForm')) {
            return;
        }

        // Page mask to emphasize the feedback form
        document.body.appendChild(pageMask);

        // Feedback form
        feedbackForm = document.createElement('div');
        feedbackForm.classList.add('feedbackForm', 'feedbackFormPopIn');
        feedbackForm.style.zIndex = '15';

        // Close button container
        const feedbackFormCloseContainer = document.createElement('div');
        feedbackFormCloseContainer.style.display = 'flex';
        feedbackFormCloseContainer.style.justifyContent = 'flex-end';
        feedbackFormCloseContainer.style.alignContent = 'flex-start';
        feedbackFormCloseContainer.style.width = '100%';

        // Close button
        const feedbackFormClose = document.createElement('span');
        feedbackFormClose.textContent = '×';
        feedbackFormClose.id = 'feedbackFormClose';
        feedbackFormCloseContainer.appendChild(feedbackFormClose);

        feedbackForm.appendChild(feedbackFormCloseContainer);

        const feedbackFormText = document.createElement('div');
        feedbackFormText.textContent = 'Une suggestion d\'amélioration ? N\'hésite pas à nous laisser un message !';
        feedbackFormText.style.maxWidth = '100%';
        feedbackFormText.style.marginBottom = '10%';
        feedbackForm.appendChild(feedbackFormText);

        // Fields container
        const feedbackFormFields = document.createElement('div');
        feedbackFormFields.style.display = 'flex';
        feedbackFormFields.style.flexDirection = 'column';
        feedbackFormFields.style.justifyContent = 'flex-start';
        feedbackFormFields.style.alignItems = 'flex-start';
        feedbackFormFields.style.width = '100%';

        // Feedback content input
        const feedbackMessage = document.createElement('textarea');
        feedbackMessage.id = 'feedbackContent';
        feedbackMessage.classList.add('feedbackMessage');
        feedbackMessage.classList.add('inputStyle');
        feedbackMessage.style.width = '100%';
        feedbackMessage.style.height = '16vh';
        feedbackMessage.style.lineHeight = '2.25vh';
        feedbackMessage.style.resize = 'none';
        feedbackForm.appendChild(feedbackMessage);
        feedbackFormFields.appendChild(feedbackMessage);

        feedbackForm.append(feedbackFormFields)

        const feedbackSubmit = document.createElement('div');
        feedbackSubmit.id = 'feedbackSubmit';
        feedbackSubmit.classList.add('feedbackSubmit');
        feedbackSubmit.classList.add('blueButton');
        feedbackSubmit.classList.add('hoverButton');
        feedbackSubmit.textContent = 'Envoyer';
        feedbackSubmit.style.width = 'fit-content';
        feedbackSubmit.style.padding = '2% 3% 2% 3%'
        feedbackForm.appendChild(feedbackSubmit);

        document.body.appendChild(feedbackForm);
        feedbackMessage.focus();

        feedbackFormClose.addEventListener('click', () => {
            feedbackForm.classList.remove('feedbackFormPopIn');
            feedbackForm.classList.add('feedbackFormPopOut');
            feedbackForm.addEventListener('animationend', () => {
                document.body.removeChild(pageMask);
                document.body.removeChild(feedbackForm);
            }, {once: true});
        });

        document.getElementById('feedbackSubmit').addEventListener('click', () => {
            const feedbackContent = document.getElementById('feedbackContent').value;
            const sanitizedFeedbackContent = sanitizeOutput(feedbackContent);

            sendMessage({
                newFeedback: {
                    feedbackContent: sanitizedFeedbackContent,
                    feedbackUser: clientUserData.studentCode
                }
            });
            addMessageListener((response) => {
                if (response.feedbackReceived) {
                    showCustomAlert('Merci de ton message ! Nous reviendrons vers toi si ton idée pique notre curiosité.', 'green')
                    setTimeout(() =>{
                        document.body.removeChild(pageMask);
                        feedbackForm.classList.remove('feedbackFormPopIn');
                        feedbackForm.classList.add('feedbackFormPopOut');
                        document.removeChild(feedbackForm);
                    }, 2000);
                } else {
                    console.error('Feedback could not be sent');
                }
            })
        });
    });
});