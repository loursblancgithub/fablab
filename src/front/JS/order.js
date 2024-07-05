// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:8080");

// Connection opened
socket.addEventListener("open", (event) => {
    socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data);
});

document.addEventListener('DOMContentLoaded', () => {
    const wipeInputs = document.querySelectorAll('input[type="text"], input[type="password"],input[type="quantity"], input[type="checkbox"], textarea');
    const orderForm = document.getElementById('orderForm');
    const loginForm = document.getElementById('loginForm');

    wipeInputs.forEach(input => {
        input.value = '';
        input.state = false;
    });

    document.getElementById('goodPracticesCheck').checked = false;

    let loginMask = document.createElement('div');
    loginMask.id = 'loginMask';

    document.addEventListener("keypress", function (event) {
        if (event.key === "f") {
            console.log('Successfully logged in');

            const orderForm = document.getElementById('orderForm');
            if (orderForm) {
                loginForm.style.transition = 'ease-out 0.5s';
                orderForm.style.transition = 'transform 3.5s';
                orderForm.style.transform = 'translateY(-30vh)';
            }

            document.getElementById('loginForm').classList.add('disappear');
            orderForm.style.filter = 'blur(0)';
            orderForm.style.pointerEvents = 'all';
            loginForm.style.pointerEvents = 'none';
        }
    });

    // Retrieving, formatting and sending the order informations
    document.getElementById('submit').addEventListener('click', function () {
        if (document.getElementById('goodPracticesCheck').checked) {
            const requiredFields = ['orderName', 'orderTool', 'orderQuantity', 'orderMaterial', 'orderQuestions'];

            const allFieldsFilled = requiredFields.every(fieldId => {
                const field = document.getElementById(fieldId);
                return field && field.value.trim() !== '';
            });

            if (allFieldsFilled) {
                let inputsContent = document.querySelectorAll('input[type="text"], input[type="password"], textarea');
                inputsContent.forEach(input => {
                    input.value = input.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                });

                const orderDetails = {
                    orderName: document.getElementById('orderName').value,
                    usedSoftware: document.getElementById('orderTool').value,
                    quantity: document.getElementById('orderQuantity').value,
                    material: document.getElementById('orderMaterial').value,
                    questions: document.getElementById('orderQuestions').value,
                    verification: document.getElementById('goodPracticesCheck').checked
                };

                console.log(orderDetails);
                socket.send(JSON.stringify(orderDetails));
            } else {
                alert('Please fill in all required fields.');
            }
        } else {
            alert('Please agree to the good practices.');
        }
    });
});