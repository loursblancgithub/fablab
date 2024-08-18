import {fiveElements} from "./utils";

const bodyContainer = document.getElementById('bodyContainer');
document.addEventListener('DOMContentLoaded', () => {
    fiveElements(bodyContainer);
    document.addEventListener("keypress", function (event) {
        if (event.key === "f") {
            console.log('Successfully logged in');
            window.location.replace("../HTML/order.html");
        }
    });
});