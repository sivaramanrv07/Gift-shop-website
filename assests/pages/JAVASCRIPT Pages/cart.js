function displayCart() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

    if (!isLoggedIn) {
        alert("Please log in to access your cart.");
        window.location.href = '../HTML Pages/login.html';  
        return; 
    }

    const userEmail = localStorage.getItem('userEmail');  // Get the logged-in user's email
    const cart = JSON.parse(localStorage.getItem(userEmail + '_cart')) || [];  // Fetch cart tied to email

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


function updateQuantity(index, change) {
    const userEmail = localStorage.getItem('userEmail');
    const cart = JSON.parse(localStorage.getItem(userEmail + '_cart')) || [];
    const item = cart[index];
    const newQuantity = item.quantity + change;

    if (newQuantity < 1) {
        item.quantity = 1; 
    } else if (newQuantity > 10) {
        item.quantity = 10; 
        if (change > 0) {
            alert("You have reached the maximum quantity of 10.");
        }
    } else {
        item.quantity = newQuantity;
    }

    if (item.quantity === 1 && change < 0) {
        alert("You have reached the minimum quantity of 1.");
    }

    localStorage.setItem(userEmail + '_cart', JSON.stringify(cart));
    displayCart();  
}


function removeFromCart(index) {
    const userEmail = localStorage.getItem('userEmail');
    const cart = JSON.parse(localStorage.getItem(userEmail + '_cart')) || [];
    cart.splice(index, 1);  
    localStorage.setItem(userEmail + '_cart', JSON.stringify(cart)); 

    displayCart();  
}

function placeOrder() {
    const userEmail = localStorage.getItem('userEmail');
    const cart = JSON.parse(localStorage.getItem(userEmail + '_cart')) || [];

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
            localStorage.removeItem(userEmail + '_cart');  
            console.log('Cart removed for user:', userEmail);

            window.location.href = '../HTML Pages/payment.html';
        }, 1000);
    }
}


window.onload = function () {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

    if (!isLoggedIn) {
        localStorage.removeItem('cart');
        alert("Please log in to view your cart.");
        window.location.href = '/login.html';  
        return;
    }

    const userEmail = localStorage.getItem('userEmail');
    let cart = JSON.parse(localStorage.getItem(userEmail + '_cart')) || [];
    cart.forEach(item => {
        if (!item.quantity) {
            item.quantity = 1;  
        }
    });

    localStorage.setItem(userEmail + '_cart', JSON.stringify(cart));
    displayCart();  
};

function clearCart() {
    const userEmail = localStorage.getItem('userEmail');
    localStorage.removeItem(userEmail + '_cart'); 
    console.log('Cart has been cleared for user:', userEmail);  
}

function logout() {
    // Set the userLoggedIn flag to false
    localStorage.setItem('userLoggedIn', 'false');

    // Get the user's email from localStorage
    const userEmail = localStorage.getItem('userEmail');

    // If there's a valid user email, remove the cart for this user
    if (userEmail) {
        // Remove the user's cart by using their email as a key
        localStorage.removeItem(userEmail + '_cart');
        console.log('Cart removed for user:', userEmail);
    }

    // Clear the user email from localStorage
    localStorage.removeItem('userEmail');
    console.log('User email removed from localStorage.');

    // Alert the user
    alert('You have logged out.');

    // Redirect the user to the login page
    window.location.href = '/assets/pages/HTML Pages/login.html';  
}






