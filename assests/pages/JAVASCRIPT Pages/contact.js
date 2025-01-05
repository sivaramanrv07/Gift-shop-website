const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const nameError = document.getElementById('nameError');
const numberError = document.getElementById('numberError');
const messageError = document.getElementById('messageError');

const nameInput = document.getElementById('name');
const numberInput = document.getElementById('number');
const messageInput = document.getElementById('message');

form.addEventListener('submit', function(event) {
    event.preventDefault();  

    nameError.textContent = '';
    numberError.textContent = '';
    messageError.textContent = '';

    let hasError = false;

    
    const nameValue = nameInput.value.trim();
    if (nameValue.length === 0) {
        nameError.textContent = "name is required.";
        hasError = true;
    } else if (nameValue.length < 4) {
        nameError.textContent = "name must be at least 4 characters long.";
        hasError = true;
    } else if (/^\d+$/.test(nameValue)) {  
        nameError.textContent = "name cannot be just numbers."
        hasError = true;
    } else if (containsSpaceOrSlash(nameValue)) {  
        nameError.textContent = "name cannot contain spaces or slashes.";
        hasError = true;
    }
     else if (containsSpecialCharacters(nameValue)) {  
    nameError.textContent = "name cannot contain special characters.";
    hasError = true;
}


    const numberValue = numberInput.value.trim();
    const numberRegex = /^[0-9]{10}$/; 
    if (!numberValue) {
        numberError.textContent = 'Please enter your phone number.';
        hasError = true;
    } else if (!numberRegex.test(numberValue)) {
        numberError.textContent = 'Please enter a valid phone number (10 digits).';
        hasError = true;
    }

    if (!messageInput.value.trim()) {
        messageError.textContent = 'Please enter your message.';
        hasError = true;
    }

    if (!hasError) {
    
        form.submit(); 

        successMessage.style.display = 'block';
       
        form.reset();
     
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }
});


function containsSpaceOrSlash(value) {
    const regex = /[ /]/;  
    return regex.test(value);
}


function containsSpecialCharacters(value) {
    const regex = /[^a-zA-Z0-9]/;  
    return regex.test(value);
}



  
    function updateCartCount(cartCount) {
        const cartCountElement = document.getElementById('cart-counts');
        
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;  
    
            
            if (cartCount === 0) {
                cartCountElement.style.display = 'none';
            } else {
                cartCountElement.style.display = 'inline';
            }
        }
    }
    
   
    window.addToCart = function(name, image, price, link) {
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        const userEmail = localStorage.getItem('userEmail');
    
        if (!isLoggedIn || !userEmail) {
            alert('You need to be logged in to add items to your cart.');
            window.location.href = '../HTML Pages/login.html';  
            return;
        }
    
        const cartKey = userEmail + '_cart';  
        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
        const product = { name, image, price, link };
    
        const productIndex = cart.findIndex(item => item.name === name);
    
        if (productIndex === -1) {
            cart.push(product);
            localStorage.setItem(cartKey, JSON.stringify(cart)); 
            alert(`${name} has been added to your cart!`);
        } else {
            alert(`${name} is already in your cart!`);
        }
    
        
        updateCartCount(cart.length);
    };
    
   
    document.addEventListener('DOMContentLoaded', function() {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            const cartKey = userEmail + '_cart';
            const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
            updateCartCount(cart.length); 
        }
    });


