window.onload = () => {
    const userIconLink = document.getElementById('userIconLink');
    const loginLogoutButtonContainer = document.getElementById('loginLogoutButtonContainer');
    const loginLogoutButton = document.getElementById('loginLogoutButton');

    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail'); 
    userIconLink.onclick = function() {
        loginLogoutButtonContainer.style.display = 
            loginLogoutButtonContainer.style.display === 'none' ? 'block' : 'none';

        if (isLoggedIn) {
            loginLogoutButton.textContent = 'Logout';
            loginLogoutButton.onclick = function() {
              
                
                localStorage.removeItem(userEmail + '_cart');  
                console.log('Cart after removal:', localStorage.getItem(userEmail + '_cart')); 
              
                localStorage.setItem('userLoggedIn', 'false');
                console.log('User logged out, userLoggedIn set to false:', localStorage.getItem('userLoggedIn'));

                localStorage.removeItem('userEmail');
                console.log('User email removed:', localStorage.getItem('userEmail'));

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

    if (isLoggedIn) {
        console.log("User is logged in");
    } else {
        console.log("User is not logged in");
    }
};

function checkLogin() {
    const isLoggedIn = localStorage.getItem("userLoggedIn") === "true"; 

    if (isLoggedIn) {
        const userEmail = localStorage.getItem('userEmail');
        const cart = localStorage.getItem(userEmail + '_cart'); 

        if (cart) {
            console.log('User cart:', JSON.parse(cart));
            window.location.href = "/assests/pages/HTML Pages/cart.html "; 
        } else {
            console.log('No cart found for the user');
           
        }
    } else {
        alert("Please log in to access your cart.");
    }
}

   


