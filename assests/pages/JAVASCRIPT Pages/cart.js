function displayCart() {
    // Fetch the cart from localStorage for the current logged-in user
    const userId = localStorage.getItem('userId');  // Assuming userId is saved during login
    const cart = JSON.parse(localStorage.getItem(`cart-${userId}`)) || [];  // Use a unique key based on userId
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const orderButton = document.getElementById('order-btn');

    // Clear the cart items container before displaying
    cartItemsContainer.innerHTML = '';

    // If the cart is empty, display a message
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty!</p>';
        totalPriceElement.innerHTML = 'Total Price: ₹0.00';
        orderButton.disabled = true;
        return;
    }

    let totalPrice = 0;

    // Loop through cart items and display them
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
    const userId = localStorage.getItem('userId');
    const cart = JSON.parse(localStorage.getItem(`cart-${userId}`)) || [];
    const item = cart[index];

    item.quantity = Math.max(1, Math.min(10, item.quantity + change));

    // Save updated cart to localStorage for the logged-in user
    localStorage.setItem(`cart-${userId}`, JSON.stringify(cart));

    // Re-render the cart
    displayCart();
}

function removeFromCart(index) {
    const userId = localStorage.getItem('userId');
    const cart = JSON.parse(localStorage.getItem(`cart-${userId}`)) || [];
    cart.splice(index, 1);

    // Save updated cart to localStorage for the logged-in user
    localStorage.setItem(`cart-${userId}`, JSON.stringify(cart));

    // Re-render the cart
    displayCart();
}

function placeOrder() {
    const userId = localStorage.getItem('userId');
    const cart = JSON.parse(localStorage.getItem(`cart-${userId}`)) || [];

    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to your cart before placing an order.');
        return;
    }

    const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.price.replace('₹', '').trim()) * item.quantity, 0);
    const orderConfirmation = confirm(`Your total is ₹${totalPrice.toFixed(2)}. Do you want to place the order?`);

    if (orderConfirmation) {
        console.log('Storing order details:', cart, totalPrice);

        // Save order details to localStorage
        localStorage.setItem('orderDetails', JSON.stringify({
            cart: cart,
            totalPrice: totalPrice
        }));

        // Remove cart from localStorage and navigate to the payment page
        setTimeout(() => {
            localStorage.removeItem(`cart-${userId}`);
            console.log('Cart removed from localStorage:', localStorage);

            window.location.href = '../HTML Pages/payement.html';
        }, 1000);
    }
}

function logout() {
    const userId = localStorage.getItem('userId');

    // Clear the cart and user data on logout
    localStorage.removeItem(`cart-${userId}`);  // Remove the cart for the current user
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userId');
    console.log('User logged out and cart cleared from localStorage');

    window.location.href = 'login.html'; 
}

window.onload = function () {
    // Check if a user is logged in
    const currentUser = localStorage.getItem('userLoggedIn');
    const userId = localStorage.getItem('userId');

    if (currentUser !== 'true') {
        // User is not logged in, clear the cart
        localStorage.removeItem('cart');  // Clear the cart if any
        console.log('Cart cleared for non-logged in user');
    } else {
        // Ensure cart items have a quantity if missing
        let cart = JSON.parse(localStorage.getItem(`cart-${userId}`)) || [];

        cart = cart.map(item => {
            if (!item.quantity) {
                item.quantity = 1;
            }
            return item;
        });

        // Save cart back to localStorage for the logged-in user
        localStorage.setItem(`cart-${userId}`, JSON.stringify(cart));
    }

    // Display the updated cart
    displayCart();

    // Handle cart link visibility based on login status
    const cartLink = document.getElementById('cartLink');
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

    cartLink.onclick = function () {
        if (isLoggedIn) {
            window.location.href = '../HTML Pages/cart.html';
        } else {
            alert('You must log in to view your cart.');
            window.location.href = '/assets/pages/HTML Pages/login.html';
        }
    };
};





