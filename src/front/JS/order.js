document.addEventListener('DOMContentLoaded', () => {
    const textInputs = document.querySelectorAll('input[type="text"], input[type="password"], textarea');

    textInputs.forEach(input => {
        input.value = '';
    });

    document.addEventListener("keypress", function (event) {
        if (event.key === "f") {
            console.log('Sucessfully logged in');

            document.getElementById('loginForm').classList.add('hideElement');
            document.getElementById('formsSeparator').classList.add('hideElement');

            setTimeout(function () {
                document.getElementById('orderForm').classList.add('moveUp');
            }, 500);
            document.getElementById('loginMask').style.display = 'none';
        }
    });

    // Retrieving, formatting and sending the order informations
    document.getElementById('submit').addEventListener('click', function () {
        if (document.getElementById('goodPracticesCheck').checked) {

            let inputsContent = document.querySelectorAll('input[type="text"], input[type="password"], textarea');
            inputsContent.forEach(input => {
                input.value = input.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            });

            console.log(document.getElementById('goodPracticesCheck').state);
            const orderDetails = {
                orderName: document.getElementById('orderName').value,
                usedSoftware: document.getElementById('usedTool').value,
                quantity: document.getElementById('orderQuantity').value,
                material: document.getElementById('orderMaterial').value,
                questions: document.getElementById('orderQuestions').value,
                verification: document.getElementById('goodPracticesCheck').state
            };

        } else {

        }
    });
});