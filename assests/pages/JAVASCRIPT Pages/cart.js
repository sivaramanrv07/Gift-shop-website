// Function to display the cart items
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const orderButton = document.getElementById('order-btn');

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty!</p>';
        totalPriceElement.innerHTML = 'Total Price: ₹0.00';
        orderButton.disabled = true;
        return;
    }

    let totalPrice = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        const itemPrice = parseFloat(item.price.replace('₹', '').replace('/-', '').trim());  
        const itemTotal = (itemPrice * item.quantity).toFixed(2);

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-info">
                <h3>${item.name}</h3>
                <p class="item-price">₹${itemTotal}</p>
                <div class="quantity-control">
                    <button class="quantity-button" onclick="updateQuantity(${index}, -1)">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" readonly>
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

// Function to update the quantity of an item in the cart
function updateQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart[index];

    const newQuantity = item.quantity + change;

    if (newQuantity < 1) {
        item.quantity = 1;  // Prevent negative or zero quantities
    } else if (newQuantity > 10) {
        item.quantity = 10; // Limit the quantity to 10
        if (change > 0) {
            alert("You have reached the maximum quantity of 10.");
        }
    } else {
        item.quantity = newQuantity; 
    }

    if (item.quantity === 1 && change < 0) {
        alert("You have reached the minimum quantity of 1.");
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    displayCart(); // Refresh the cart after update
}

// Function to remove an item from the cart
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);  // Remove the item from the cart array
    localStorage.setItem('cart', JSON.stringify(cart));  // Save the updated cart back to localStorage

    displayCart(); // Refresh the cart after removal
}

// Function to place the order
function placeOrder() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to your cart before placing an order.');
        return;
    }

    const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.price.replace('₹', '').replace('/-', '').trim()) * item.quantity, 0);
    const orderConfirmation = confirm(`Your total is ₹${totalPrice.toFixed(2)}. Do you want to place the order?`);

    if (orderConfirmation) {
        console.log('Storing order details:', cart, totalPrice); 

        localStorage.setItem('orderDetails', JSON.stringify({
            cart: cart,
            totalPrice: totalPrice
        }));

        setTimeout(() => {
            localStorage.removeItem('cart');  // Remove the cart after placing the order
            console.log('Cart removed from localStorage:', localStorage); 

            // Redirect to payment page
            window.location.href = '../HTML Pages/payement.html';  
        }, 1000);  
    }
}

// Function to initialize the cart and reset data
window.onload = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Ensure that each cart item has a valid quantity (in case of inconsistent data)
    cart.forEach(item => {
        if (!item.quantity) {
            item.quantity = 1;  // Default quantity to 1 if it's undefined or invalid
        }
    });

    // Store the updated cart in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    displayCart();  // Display the cart
};

// Function to clear the cart (when logging out or switching users)
function clearCartOnLogout() {
    localStorage.removeItem('cart');  // Clear the cart data from localStorage
    displayCart();  // Display the empty cart
}

// Logout functionality - This can be triggered when the user clicks on "Logout"
function logout() {
    // Remove the user login data
    localStorage.setItem('userLoggedIn', 'false');  
    clearCartOnLogout();  // Clear the cart

    alert('You have logged out.');

    // Reload the page or redirect to a login page
    window.location.reload();  // Reload the page or redirect to login page
}

// Function to check login status and handle redirection to login page if needed
function checkLogin() {
    const isLoggedIn = localStorage.getItem("userLoggedIn") === "true"; 

    if (isLoggedIn) {
        // If the user is logged in, navigate to the cart page
        window.location.href = "/assests/pages/HTML Pages/cart.html";
    } else {
        // If the user is not logged in, prompt to log in
        alert("Please log in to access your cart.");
    }
}
