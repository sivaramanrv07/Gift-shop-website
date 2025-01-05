
function displayFeatures(data) {
    const boxContainer = document.getElementById('box-container');
    
    data.features.forEach(feature => {
        const featureDiv = document.createElement('div');
        featureDiv.classList.add('box');
        
    
        featureDiv.innerHTML = `
            <img src="${feature.image}" alt="${feature.title}">
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
            <button type="button" class="button read-more-btn">${feature.buttonText}</button>
        `;

   
        boxContainer.appendChild(featureDiv);

     
        const readMoreButton = featureDiv.querySelector('.read-more-btn');
        const description = featureDiv.querySelector('p');
        const moreText = description.querySelector('.more-text');
        
    
        moreText.style.display = 'none';

        readMoreButton.addEventListener('click', () => {
            if (moreText.style.display === 'none') {
                moreText.style.display = 'inline';  
                readMoreButton.textContent = 'Read Less';  
            } else {
                moreText.style.display = 'none'; 
                readMoreButton.textContent = 'Read More';  
            }
        });
    });
}


fetch('../JSON Pages/features.json')
    .then(response => response.json())  
    .then(data => {
        displayFeatures(data);  
    })
    .catch(error => console.error('Error loading JSON:', error));

  
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
