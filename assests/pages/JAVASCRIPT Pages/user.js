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
            loginLogoutButton.onclick = function () {
                localStorage.setItem('userLoggedIn', 'false');  
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
};