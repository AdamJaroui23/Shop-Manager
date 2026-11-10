
let products = [];

let productsContainer = document.getElementById("products-container");
let searchInput = document.getElementById("product-search");
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

fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((data) => {

        products = data;

        console.log(products);

        displayProducts(products);

    })
    .catch((error) => {
        console.error(error);
        productsContainer.innerHTML = `
            <p class="empty-state">Could not load products.</p>
        `;
    });


searchInput.addEventListener("input", () => {

    let searchValue = searchInput.value.toLowerCase();

    let filteredProducts = products.filter((product) => {

        return product.name.toLowerCase().includes(searchValue);

    });

    displayProducts(filteredProducts);

    searchStatus.textContent =
        filteredProducts.length + " products found";

});
