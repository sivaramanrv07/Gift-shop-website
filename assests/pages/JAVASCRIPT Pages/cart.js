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

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart[index];

    item.quantity = Math.max(1, Math.min(10, item.quantity + change));

   
    localStorage.setItem('cart', JSON.stringify(cart));

 
    displayCart();
}

function removeFromCart(index) {
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

   
    cart.splice(index, 1);

  
    localStorage.setItem('cart', JSON.stringify(cart));

   
    displayCart();
}

function placeOrder() {
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to your cart before placing an order.');
        return;
    }

    const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.price.replace('₹', '').trim()) * item.quantity, 0);
    const orderConfirmation = confirm(`Your total is ₹${totalPrice.toFixed(2)}. Do you want to place the order?`);

    if (orderConfirmation) {
        console.log('Storing order details:', cart, totalPrice);

       
        localStorage.setItem('orderDetails', JSON.stringify({
            cart: cart,
            totalPrice: totalPrice
        }));

    
        setTimeout(() => {
            localStorage.removeItem('cart');
            console.log('Cart removed from localStorage:', localStorage);

         
            window.location.href = '../HTML Pages/payement.html';
        }, 1000);
    }
}

function logout() {
    
    localStorage.removeItem('cart');
    console.log('User logged out and cart cleared from localStorage');

 
    window.location.href = 'login.html'; 
}


window.onload = function () {
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    cart = cart.map(item => {
        if (!item.quantity) {
            item.quantity = 1;
        }
        return item;
    });

   
    localStorage.setItem('cart', JSON.stringify(cart));

  
    displayCart();

    const cartLink = document.getElementById('cartLink');

   
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

 
    cartLink.onclick = function () {
        if (isLoggedIn) {
           
            window.location.href = '../HTML Pages/cart.html';
        } else {
        
            alert('You must log in to view your cart.');
            window.location.href = '/assests/pages/HTML Pages/login.html';
        }
    };
};



