document.addEventListener('DOMContentLoaded', () => {
    const wipeInputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="checkbox"], textarea');
    const orderForm = document.getElementById('orderForm');

    wipeInputs.forEach(input => {
        input.value = '';
        input.state = false;
    });

    let loginMask = document.createElement('div');
    loginMask.id = 'loginMask';

    document.addEventListener("keypress", function (event) {
        if (event.key === "f") {
            console.log('Sucessfully logged in');

            document.getElementById('loginForm').classList.add('disappear');
            orderForm.style.filter = 'blur(0)';
            orderForm.style.pointerEvents = 'all';
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