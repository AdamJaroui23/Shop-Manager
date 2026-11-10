let products = [];

let productsContainer = document.getElementById("products");

fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((data) => {
        products = data;
        console.log(products)

        products.forEach((product) => {
            productsContainer.innerHTML += `
                <div>
                    <h2>${product.name}</h2>
                    <img src="http://localhost:3000${product.image}"></img>
                    <p>${product.description}
                    <p>Price: ${product.price}</p>
                </div>
            `;
        });
    })
    .catch(console.error);

