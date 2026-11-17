let customerForm = document.getElementById("customer-form");
let formStatus = document.getElementById("form-status");

customerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "All required fields look valid.";
});

customerForm.addEventListener("input", () => {
    formStatus.textContent = "";
});
