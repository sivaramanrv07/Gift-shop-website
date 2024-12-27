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
          
                localStorage.setItem('userLoggedIn', 'false');
                localStorage.removeItem('cart');  

                console.log('User logged out, cart removed:', localStorage.getItem('cart'));

                alert('You have logged out.');

       
                window.location.reload();  
            };
        } else {
      
            loginLogoutButton.textContent = 'Login';
            loginLogoutButton.onclick = function() {
             
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
      
        window.location.href = "../HTML Pages/cart.html";
    } else {
      
        alert("Please log in to access your cart.");
    }
}





