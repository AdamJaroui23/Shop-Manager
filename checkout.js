let customerForm = document.getElementById("customer-form");
let formStatus = document.getElementById("form-status");
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

customerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (cart.length === 0) {
        formStatus.textContent = "Your cart is empty.";
        return;
    }

    const customer = Object.fromEntries(new FormData(customerForm));
    try {
        for (const item of cart) {
            const response = await fetch("http://localhost:3000/api/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: item.id, quantity: item.quantity, customer })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(Object.values(error.fields || {}).join(" ") || error.message);
            }
        }

        localStorage.removeItem("cart");
        formStatus.textContent = "Order sent!";
    } catch (error) {
        Swal.fire({
            title: "Something went wrong",
            text: "Your order is not sent",
            icon: "error"
        });
    }
});

customerForm.addEventListener("input", () => {
    formStatus.textContent = "";
});
