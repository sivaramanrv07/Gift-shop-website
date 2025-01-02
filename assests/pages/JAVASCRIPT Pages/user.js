window.onload = () => {
    const userIconLink = document.getElementById('userIconLink');
    const loginLogoutButtonContainer = document.getElementById('loginLogoutButtonContainer');
    const loginLogoutButton = document.getElementById('loginLogoutButton');

    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

    userIconLink.onclick = function() {
        loginLogoutButtonContainer.style.display = 
            loginLogoutButtonContainer.style.display === 'none' ? 'block' : 'none';

        if (isLoggedIn) {
            loginLogoutButton.textContent = 'Logout';
            loginLogoutButton.onclick = function() {
                // Step 1: Remove only the cart from localStorage (not all data)
                localStorage.removeItem('cart');  
                console.log('Cart after removal:', localStorage.getItem('cart'));  // Check if the cart is removed

                // Step 2: Set 'userLoggedIn' to false
                localStorage.setItem('userLoggedIn', 'false');
                console.log('User logged out, userLoggedIn set to false:', localStorage.getItem('userLoggedIn'));

                alert('You have logged out.');

                // Step 3: Reload the page to reflect the logged-out state and cleared cart
                window.location.reload();  
            };
        } else {
            loginLogoutButton.textContent = 'Login';
            loginLogoutButton.onclick = function() {
                // Redirect to the login page if not logged in
                window.location.href = '/assets/pages/HTML Pages/login.html';  
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
        // If logged in, redirect to the cart page
        window.location.href = "../HTML Pages/cart.html";
    } else {
        // If not logged in, show an alert and ask the user to log in
        alert("Please log in to access your cart.");
    }
}
