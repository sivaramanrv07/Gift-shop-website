function displayCart() {
    // Retrieve cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const orderButton = document.getElementById('order-btn');

    // Clear previous cart display
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty!</p>';
        totalPriceElement.innerHTML = 'Total Price: ₹0.00';
        orderButton.disabled = true;
        return;
    }

    let totalPrice = 0;

    // Loop through cart and display items
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        const itemPrice = parseFloat(item.price.replace('₹', '').trim());
        const itemTotal = (itemPrice * item.quantity).toFixed(2);

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-info">
                <h3>${item.name}</h3>
                <p class="item-price">₹${itemTotal}</p>
                <div class="quantity-control">
                    <button class="quantity-button" onclick="updateQuantity(${index}, -1)">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" readonly>
                    <button class="quantity-button" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;

        cartItemsContainer.appendChild(cartItem);
        totalPrice += itemPrice * item.quantity;
    });

    totalPriceElement.innerHTML = `Total Price: ₹${totalPrice.toFixed(2)}`;
    orderButton.disabled = false;
}

function updateQuantity(index, change) {
    // Retrieve cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart[index];

    // Update quantity, ensuring it's within the allowed range (1 to 10)
    item.quantity = Math.max(1, Math.min(10, item.quantity + change));

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the display
    displayCart();
}

function removeFromCart(index) {
    // Retrieve cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Remove the item from the cart array
    cart.splice(index, 1);

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the display
    displayCart();
}

function placeOrder() {
    // Retrieve cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to your cart before placing an order.');
        return;
    }

    const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.price.replace('₹', '').trim()) * item.quantity, 0);
    const orderConfirmation = confirm(`Your total is ₹${totalPrice.toFixed(2)}. Do you want to place the order?`);

    if (orderConfirmation) {
        console.log('Storing order details:', cart, totalPrice);

        // Save the order details to localStorage
        localStorage.setItem('orderDetails', JSON.stringify({
            cart: cart,
            totalPrice: totalPrice
        }));

        // Remove the cart from localStorage after placing the order
        setTimeout(() => {
            localStorage.removeItem('cart');
            console.log('Cart removed from localStorage:', localStorage);

            // Redirect to the payment page
            window.location.href = '../HTML Pages/payement.html';
        }, 1000);
    }
}

function logout() {
    // Remove cart from localStorage
    localStorage.removeItem('cart');
    console.log('User logged out and cart cleared from localStorage');

    // Redirect to login page
    window.location.href = 'login.html'; // Replace with actual login page URL
}

// Combined window.onload function
window.onload = function () {
    // Ensure the cart is initialized properly if it doesn't exist
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // If there are items, ensure each item has a quantity, default to 1 if not
    cart = cart.map(item => {
        if (!item.quantity) {
            item.quantity = 1;
        }
        return item;
    });

    // Save cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Display the cart
    displayCart();

    // Get the cart icon link
    const cartLink = document.getElementById('cartLink');

    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

    // Add click event to the cart link
    cartLink.onclick = function () {
        if (isLoggedIn) {
            // If the user is logged in, navigate to the cart page
            window.location.href = '../HTML Pages/cart.html';
        } else {
            // If the user is not logged in, show an alert and redirect to the login page
            alert('You must log in to view your cart.');
            window.location.href = '/assests/pages/HTML Pages/login.html'; // Adjust the path if needed
        }
    };
};



