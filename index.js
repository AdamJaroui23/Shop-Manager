let products = [];

let productsContainer = document.getElementById("products-container");
let searchInput = document.getElementById("product-search");
let categoryFilter = document.getElementById("category-filter");
let maxPriceInput = document.getElementById("max-price");
let inStockOnlyInput = document.getElementById("in-stock-only");
let searchStatus = document.getElementById("search-status");
let resetFiltersButton = document.getElementById("reset-filters");

function displayProducts(productsArray) {
    productsContainer.innerHTML = "";

    if (productsArray.length === 0) {
        productsContainer.innerHTML = `
            <p class="empty-state">No products found.</p>
        `;
        return;
    }

    productsArray.forEach((product) => {
        productsContainer.innerHTML += `
            <div class="product">
                <div class="product-art">
                    <img
                        src="http://localhost:3000${product.image}"
                        alt="${product.name}"
                    >
                </div>

                <div class="product-info">
                    <div class="product-copy">
                        <p class="product-category">
                            ${product.categoryName}
                        </p>

                        <h3>${product.name}</h3>

                        <p class="product-description">
                            ${product.description}
                        </p>
                    </div>

                    <p class="price">$${product.price}</p>
                </div>
            </div>
        `;
    });
}

function filterProducts() {
    let searchValue = searchInput.value.toLowerCase();
    let selectedCategory = categoryFilter.value;
    let maxPrice = Infinity;
    let inStockOnly = inStockOnlyInput.checked;

    if (maxPriceInput.value !== "") {
        maxPrice = Number(maxPriceInput.value);
    }

    let filteredProducts = products.filter((product) => {
        let matchesName = product.name.toLowerCase().includes(searchValue);

        let matchesCategory =
            selectedCategory === "all" ||
            product.categoryName === selectedCategory;

        let matchesMaxPrice = Number(product.price) <= maxPrice;
        let matchesStock = !inStockOnly || Number(product.stock) > 0;

        return matchesName && matchesCategory && matchesMaxPrice && matchesStock;
    });

    displayProducts(filteredProducts);

    searchStatus.textContent = `${filteredProducts.length} products found`;
}

fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((data) => {
        products = data;
        let categories = [];
        
    console.log(products)

        products.forEach((product) => {
            if (!categories.includes(product.categoryName)) {
                categories.push(product.categoryName);
            }
        });

        categories.forEach((category) => {
            categoryFilter.innerHTML += `
                <option value="${category}">${category}</option>
            `;
        });

        displayProducts(products);

        searchStatus.textContent = `${products.length} products found`;
    })
    .catch((error) => {
        console.error(error);

        productsContainer.innerHTML = `
            <p class="empty-state">Could not load products.</p>
        `;
    });

searchInput.addEventListener("input", () => {
    fetch(`http://localhost:3000/api/products?search=${encodeURIComponent(searchInput.value)}`)
        .then((response) => response.json())
        .then((data) => {
            products = data;
            filterProducts();
        })
        .catch((error) => console.error(error));
});

categoryFilter.addEventListener("change", filterProducts);

maxPriceInput.addEventListener("input", filterProducts);

inStockOnlyInput.addEventListener("change", filterProducts);

resetFiltersButton.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "all";
    maxPriceInput.value = "";
    inStockOnlyInput.checked = false;

    fetch("http://localhost:3000/api/products")
        .then((response) => response.json())
        .then((data) => {
            products = data;
            displayProducts(products);
            searchStatus.textContent = `${products.length} products found`;
        })
        .catch((error) => console.error(error));
});
