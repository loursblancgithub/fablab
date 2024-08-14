import {sanitizeOutput} from "../../scripts/utils";

document.addEventListener('DOMContentLoaded', () => {
    const formBulb = document.getElementById('formBulb');
    const pageMask = document.createElement('div');
    pageMask.id = 'pageMask';

    let feedbackForm;

    formBulb.addEventListener('click', () => {
        console.log('Feedback form opened');

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
        feedbackFormText.textContent = 'Une question sur le service ? Une suggestion d\'amélioration ? N\'hésite pas à nous laisser un message !';
        feedbackFormText.style.maxWidth = '100%';
        feedbackForm.appendChild(feedbackFormText);

        // Fields container
        const feedbackFormFields = document.createElement('div');
        feedbackFormFields.style.display = 'flex';
        feedbackFormFields.style.flexDirection = 'column';
        feedbackFormFields.style.justifyContent = 'flex-start';
        feedbackFormFields.style.alignItems = 'flex-start';
        feedbackFormFields.style.width = '100%';

        // Feedback type selector
        const feedbackType = document.createElement('select');
        feedbackType.id = 'feedbackType';
        feedbackType.classList.add('feedbackType');
        feedbackType.classList.add('inputStyle');
        feedbackType.style.width = 'fit-content';
        feedbackType.style.margin = '1vh 0 1vh 0';

        const feedbackTypeOption1 = document.createElement('option');
        feedbackTypeOption1.value = 'suggestion';
        feedbackTypeOption1.textContent = 'Suggestion';
        const feedbackTypeOption2 = document.createElement('option');
        feedbackTypeOption2.value = 'question';
        feedbackTypeOption2.textContent = 'Question';
        feedbackType.appendChild(feedbackTypeOption1);
        feedbackType.appendChild(feedbackTypeOption2);
        feedbackFormFields.appendChild(feedbackType);

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
        feedbackSubmit.textContent = 'Envoyer';
        feedbackForm.appendChild(feedbackSubmit);

        document.body.appendChild(feedbackForm);

        feedbackFormClose.addEventListener('click', () => {
            feedbackForm.classList.remove('feedbackFormPopIn');
            feedbackForm.classList.add('feedbackFormPopOut');
            feedbackForm.addEventListener('animationend', () => {
                document.body.removeChild(pageMask);
                document.body.removeChild(feedbackForm);
            }, {once: true});
        });
    });

    document.getElementById('feedbackSubmit').addEventListener('click', () => {
        const feedbackType = document.getElementById('feedbackType').value;
        const feedbackContent = document.getElementById('feedbackContent').value;
        const sanitizedFeedbackContent = sanitizeOutput(feedbackContent);
        const feedbackData = {
            feedbackType: feedbackType,
            feedbackMessage: sanitizedFeedbackContent
        };
        console.log(feedbackData);
    });
});