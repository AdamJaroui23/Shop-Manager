let products = [];

let productsContainer = document.getElementById("products-container");
let searchInput = document.getElementById("product-search");
let categoryFilter = document.getElementById("category-filter");
let searchStatus = document.getElementById("search-status");

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

    let filteredProducts = products.filter((product) => {
        let matchesName = product.name.toLowerCase().includes(searchValue);

        let matchesCategory =
            selectedCategory === "all" ||
            product.categoryName === selectedCategory;

        return matchesName && matchesCategory;
    });

    displayProducts(filteredProducts);

    searchStatus.textContent = `${filteredProducts.length} products found`;
}

fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((data) => {
        products = data;

        let categories = [];

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

searchInput.addEventListener("input", filterProducts);

categoryFilter.addEventListener("change", filterProducts);