window.onload = () => {
    // Select elements for login/logout functionality
    const userIconLink = document.getElementById('userIconLink');
    const loginLogoutButtonContainer = document.getElementById('loginLogoutButtonContainer');
    const loginLogoutButton = document.getElementById('loginLogoutButton');
    const searchBar = document.getElementById('searchBar');
    const searchButton = document.getElementById('searchButton'); 
    const slider = document.getElementById('product-slider');
  
    let jsonData = {};  // Variable to store the product data

    // Handle the user login/logout display
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

    userIconLink.onclick = function() {
        loginLogoutButtonContainer.style.display = 
            loginLogoutButtonContainer.style.display === 'none' ? 'block' : 'none';

        if (isLoggedIn) {
            loginLogoutButton.textContent = 'Logout';  
            loginLogoutButton.onclick = function () {
                localStorage.setItem('userLoggedIn', 'false');  
                alert('You have logged out.');
                window.location.reload();  
            };
        } else {
            loginLogoutButton.textContent = 'Login';  
            loginLogoutButton.onclick = function() {
                window.location.href = '/assests/pages/HTML Pages/login.html'; 
            };
        }
    };

    // Fetch product data and initialize search functionality
    fetch('../JSON Pages/product.json') 
        .then(response => response.json())
        .then(data => {
            jsonData = data; 
            initSearchAndDisplay(jsonData);  // Initialize search functionality
        })
        .catch(error => console.error('Error loading JSON:', error));

    // Function to initialize search functionality
    function initSearchAndDisplay(data) {
        searchButton.addEventListener('click', function () {
            const searchQuery = searchBar.value.trim();
            console.log("Search button clicked!");
            if (searchQuery === '') {
                localStorage.removeItem('searchQuery');
                displayProducts(data);  // Display all products if no search
            } else {
                localStorage.setItem('searchQuery', searchQuery);
                performSearch(data, searchQuery);  // Filter products based on search query
            }
        });

        searchBar.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                searchButton.click();  // Trigger search on pressing Enter
            }
        });

        searchBar.addEventListener('input', function () {
            const searchQuery = searchBar.value.trim();
            if (searchQuery === '') {
                localStorage.removeItem('searchQuery');
                displayProducts(data);  // Display all products if search is cleared
            } else {
                performSearch(data, searchQuery);  // Perform search as user types
            }
        });

        const storedQuery = localStorage.getItem('searchQuery');
        if (storedQuery) {
            searchBar.value = storedQuery;
            performSearch(data, storedQuery);  // Perform search with the stored query
        } else {
            displayProducts(data);  // Display all products if no stored query
        }
    }

    // Function to display the products
    function displayProducts(data) {
        slider.innerHTML = '';  // Clear existing products

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

    // Function to generate stars for product ratings
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

    // Function to perform search on products
    function performSearch(data, query) {
        console.log("Performing search with query:", query);
        const filteredData = {
            "products": query === '' ? data.products : data.products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            )
        };
        displayProducts(filteredData);  // Display filtered products
    }

    // Add item to the cart
    window.addToCart = function(name, image, price, link) {
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

        if (!isLoggedIn) {
            alert('You need to be logged in to add items to your cart.');
            window.location.href = '../HTML Pages/login.html';
            return;
        }

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const product = { name, image, price, link };

        const productIndex = cart.findIndex(item => item.name === name);

        if (productIndex === -1) {
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));  // Store cart in localStorage
            alert(`${name} has been added to your cart!`);
        } else {
            alert(`${name} is already in your cart!`);
        }
    }

    // Function to handle 'Buy Now' functionality
    window.buyNow = function(name, image, price, link) {
        const userLoggedIn = localStorage.getItem('userLoggedIn');

        if (userLoggedIn === 'true') {
            window.location.href = link;  // Redirect to product page if logged in
        } else {
            alert("You need to log in first to make a purchase.");
            localStorage.setItem('redirectUrl', link);
            window.location.href = '../HTML Pages/login.html';  // Redirect to login page if not logged in
        }
    }
};

