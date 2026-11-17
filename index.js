
let products = [];
let cart = [];

let productsContainer = document.getElementById("products-container");
let searchInput = document.getElementById("product-search");
let categoryFilter = document.getElementById("category-filter");
let maxPriceInput = document.getElementById("max-price");
let inStockOnlyInput = document.getElementById("in-stock-only");
let searchStatus = document.getElementById("search-status");
let cartItemsContainer = document.querySelector(".cart-items");

let cartSidebar = document.getElementById("cart-sidebar");
let cartOverlay = document.getElementById("cart-overlay");
let cartToggleButton = document.getElementById("cart-toggle");

function setCartOpen(open) {
    cartSidebar.classList.toggle("active", open);
    cartOverlay.classList.toggle("active", open);
    cartSidebar.setAttribute("aria-hidden", !open);
    cartOverlay.setAttribute("aria-hidden", !open);
    cartToggleButton.setAttribute("aria-expanded", open);
    cartToggleButton.hidden = open;
}

cartToggleButton.addEventListener("click", () => setCartOpen(true));
document.getElementById("cart-close").addEventListener("click", () => setCartOpen(false));
cartOverlay.addEventListener("click", () => setCartOpen(false));


function displayCart() {
    cartItemsContainer.innerHTML = "";

    cart.forEach((item, i) => {
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="http://localhost:3000${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>$${item.price}</p>
                </div>
                <input type="number" min="1" max="${item.stock}" value="${item.quantity}" data-index="${i}">
                <button class="remove-from-cart-btn" type="button" data-index="${i}" aria-label="Remove ${item.name} from cart">Remove</button>
            </div>
        `;
    });

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    }
}

cartItemsContainer.addEventListener("click", function(event) {
    let button = event.target.closest(".remove-from-cart-btn");
    if (!button) return;

    cart.splice(Number(button.dataset.index), 1);
    displayCart();
});


productsContainer.addEventListener("click", (event) => {
    let button = event.target.closest(".add-to-cart-btn");
    if (!button) return;

    let product = products.find(p => p.id == button.dataset.productId);
    if (!product || product.stock <= 0) return;

    let item = cart.find(p => p.id === product.id);

    if (!item) {
        item = { ...product, quantity: 0 };
        cart.push(item);
    }

    if (item.quantity < item.stock) {
        item.quantity++;
        displayCart();
    }
});

cartItemsContainer.addEventListener("change", function(event) {
    let item = cart[event.target.dataset.index];
    let quantity = event.target.value;

    if (quantity < 1) {
        quantity = 1;
    }

    if (quantity > item.stock) {
        quantity = item.stock;
    }

    item.quantity = quantity;
    event.target.value = quantity;
});

function displayProducts(list) {
    productsContainer.innerHTML = "";

    if (list.length === 0) {
        productsContainer.innerHTML = "<p class='empty-state'>No products found.</p>";
        return;
    }

    list.forEach(product => {
        productsContainer.innerHTML += `
            <div class="product">
                <div class="product-art">
                    <img src="http://localhost:3000${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <div class="product-copy">
                        <p class="product-category">${product.categoryName}</p>
                        <h3>${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                    </div>
                    <div class="product-purchase">
                        <p class="price">$${product.price}</p>
                        <button class="add-to-cart-btn" data-product-id="${product.id}">Add to cart</button>
                        <p class="product-description">${product.stock} left in stock</p>
                    </div>
                </div>
            </div>
        `;
    });
}

function filterProducts() {
    let filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchInput.value.toLowerCase()) &&
        (categoryFilter.value === "all" || product.categoryName === categoryFilter.value) &&
        Number(product.price) <= (maxPriceInput.value || Infinity) &&
        (!inStockOnlyInput.checked || product.stock > 0)
    );

    displayProducts(filtered);
    searchStatus.textContent = `${filtered.length} products found`;
}

function loadProducts() {
    fetch("http://localhost:3000/api/products")
        .then(response => response.json())
        .then(data => {
            products = data;

            categoryFilter.innerHTML = '<option value="all">All</option>';

            products.forEach(product => {
                if (!Array.from(categoryFilter.options).some(option => option.value === product.categoryName)) {
                    categoryFilter.innerHTML += `<option value="${product.categoryName}">${product.categoryName}</option>`;
                }
            });

            displayProducts(products);
            searchStatus.textContent = `${products.length} products found`;
        })
        .catch(() => {
            productsContainer.innerHTML = "<p class='empty-state'>Could not load products.</p>";
        });
}

searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);
maxPriceInput.addEventListener("input", filterProducts);
inStockOnlyInput.addEventListener("change", filterProducts);

document.getElementById("reset-filters").addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "all";
    maxPriceInput.value = "";
    inStockOnlyInput.checked = false;
    loadProducts();
});

loadProducts();
displayCart();
