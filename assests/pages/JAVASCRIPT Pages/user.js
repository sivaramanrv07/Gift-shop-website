window.onload = () => {
    const userIconLink = document.getElementById('userIconLink');
    const loginLogoutButtonContainer = document.getElementById('loginLogoutButtonContainer');
    const loginLogoutButton = document.getElementById('loginLogoutButton');

    // Check if the user is logged in (from localStorage)
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

    // Toggle login/logout button visibility when the user icon is clicked
    userIconLink.onclick = function() {
        loginLogoutButtonContainer.style.display = 
            loginLogoutButtonContainer.style.display === 'none' ? 'block' : 'none';

        if (isLoggedIn) {
            // If user is logged in, show 'Logout' button
            loginLogoutButton.textContent = 'Logout';
            loginLogoutButton.onclick = function() {
                // Set userLoggedIn to false and clear the cart from localStorage
                localStorage.setItem('userLoggedIn', 'false');
                localStorage.removeItem('cart');  // Clear the cart on logout

                alert('You have logged out.');

                // Reload the page or redirect the user to a different page
                window.location.reload();
            };
        } else {
            // If user is not logged in, show 'Login' button
            loginLogoutButton.textContent = 'Login';
            loginLogoutButton.onclick = function() {
                // Redirect to login page
                window.location.href = '/assests/pages/HTML Pages/login.html';
            };
        }
    };

    // Check the login status on page load
    if (isLoggedIn) {
        console.log("User is logged in");
    } else {
        console.log("User is not logged in");
    }
};

// Function to check login before accessing cart
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




