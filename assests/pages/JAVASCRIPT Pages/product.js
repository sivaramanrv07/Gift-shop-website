window.onload = () => {
    const searchBar = document.getElementById('searchBar');
    const searchButton = document.getElementById('searchButton'); 

  
    let jsonData = {}; 
    fetch('../JSON Pages/product.json') 
        .then(response => response.json())
        .then(data => {
            jsonData = data; 
            initSearchAndDisplay(jsonData);  
        })
        .catch(error => console.error('Error loading JSON:', error));

    function initSearchAndDisplay(data) {
        searchButton.addEventListener('click', function () {
            const searchQuery = searchBar.value.trim();
            console.log("Search button clicked!"); 
            if (searchQuery === '') {
                localStorage.removeItem('searchQuery'); 
                displayProducts(data);  
            } else {
                localStorage.setItem('searchQuery', searchQuery); 
                performSearch(data, searchQuery);  
            }
        });

        searchBar.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                searchButton.click();  
            }
        });

        searchBar.addEventListener('input', function () {
            const searchQuery = searchBar.value.trim();
            if (searchQuery === '') {
                localStorage.removeItem('searchQuery'); 
                displayProducts(data);  
            } else {
                performSearch(data, searchQuery);  
            }
        });

        const storedQuery = localStorage.getItem('searchQuery');
        if (storedQuery) {
            searchBar.value = storedQuery;  
            performSearch(data, storedQuery);  
        } else {
            displayProducts(data);  
        }
    }
};

function displayProducts(data) {
    const slider = document.getElementById('product-slider');
    slider.innerHTML = ''; 

    if (data.products.length === 0) {
        const noResultsMessage = document.createElement('div');
        noResultsMessage.classList.add('no-results');
        noResultsMessage.innerHTML = `<h3>No products found for your search.</h3>`;
        slider.appendChild(noResultsMessage);
    } else {
        data.products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('products-box');
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <div class="prices">${product.price}</div>
                <div class="starts">${generateStars(product.rating)}</div>
                <a href="javascript:void(0)" class="btn">
                    <button type="button" class="Button" onclick="addToCart('${product.name}', '${product.image}', '${product.price}', '${product.link}')">Add to cart</button>
                </a>
                <a href="javascript:void(0)" class="btn">
                    <button type="button" class="Buttons" onclick="buyNow('${product.name}', '${product.image}', '${product.price}', '${product.link}')">Buy now</button>
                </a>
            `;
            slider.appendChild(productDiv);
        });
    }
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function performSearch(data, query) {
    console.log("Performing search with query:", query); 
    const filteredData = {
        "products": query === '' ? data.products : data.products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase())
        )
    };
    displayProducts(filteredData);  
}

function addToCart(name, image, price, link) {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true'; 

    if (!isLoggedIn) {
        alert('You need to be logged in to add items to your cart.');
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = { name, image, price, link };

    const productIndex = cart.findIndex(item => item.name === name);

    if (productIndex === -1) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart)); 
        alert(`${name} has been added to your cart!`);
    } else {
        alert(`${name} is already in your cart!`);
    }
}

function buyNow(name, image, price, link) {
    const userLoggedIn = localStorage.getItem('userLoggedIn');

    if (userLoggedIn === 'true') {
        window.location.href = link;  
    } else {
        alert("You need to log in first to make a purchase.");
        localStorage.setItem('redirectUrl', link);
        window.location.href = '../HTML Pages/login.html';  
    }
}
