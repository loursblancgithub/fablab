document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener("keypress", function (event) {
        if (event.key === "f") {
            console.log('Successfully logged in');
            window.location.replace("../HTML/order.html");
        }
    });
});