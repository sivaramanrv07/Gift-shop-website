window.onload = () => {
    const userIconLink = document.getElementById('userIconLink');
    const loginLogoutButtonContainer = document.getElementById('loginLogoutButtonContainer');
    const loginLogoutButton = document.getElementById('loginLogoutButton');
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const cartIconLink = document.getElementById('cartIconLink'); // Cart icon or button

  
    userIconLink.onclick = function () {
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
            loginLogoutButton.onclick = function () {
                window.location.href = '../HTML Pages/login.html'; 
            };
        }
    };
    cartIconLink.addEventListener('click', checkLogin);

   
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
        window.location.href = '../HTML Pages/login.html';  
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const reviewForm = document.getElementById("add-review-form");
    const reviewContainer = document.getElementById("reviewsList");


    loadReviews();

    reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();  
       
        const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
        if (!isLoggedIn) {
            alert("You must be logged in to submit a review.");

            
            reviewForm.reset();

           
            window.location.href = '/assets/pages/HTML Pages/login.html'; 
            return; 
        }

        const reviewerName = document.getElementById("reviewerName").value;
        const reviewerImage = document.getElementById("reviewerImage").files[0];
        const reviewRating = document.getElementById("reviewRating").value;
        const reviewText = document.getElementById("reviewText").value;

   
        if (!reviewerName || !reviewRating || !reviewText) {
            alert("Please fill in all fields.");
            return;
        }

   
        let imageData = null;
        if (reviewerImage) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imageData = e.target.result;
                const newReview = {
                    id: Date.now(),  
                    name: reviewerName,
                    imageData,
                    rating: reviewRating,
                    text: reviewText,
                    username: localStorage.getItem("username")  
                };
                saveReview(newReview); 
                submitReview(newReview); 
            };
            reader.readAsDataURL(reviewerImage);
        } else {
            const newReview = {
                id: Date.now(), 
                name: reviewerName,
                imageData: null,
                rating: reviewRating,
                text: reviewText,
                username: localStorage.getItem("username") 
            };
            saveReview(newReview); 
            submitReview(newReview); 
        }

      
        alert("Thank you for your review!");

     
        document.getElementById("add-review-form").reset();
    });

   
    function submitReview(review) {
        const reviewCard = document.createElement("div");
        reviewCard.classList.add("review-box");
        reviewCard.setAttribute("data-id", review.id); 

    
        if (review.imageData) {
            const imageElement = document.createElement("img");
            imageElement.src = review.imageData;
            imageElement.alt = "Reviewer's Image";
            reviewCard.appendChild(imageElement);
        }

        const nameElement = document.createElement("h3");
        nameElement.textContent = review.name;
        reviewCard.appendChild(nameElement);

        const ratingElement = document.createElement("p");
        const starIcons = getStarRating(review.rating);
        const startDiv = document.createElement("div");
        startDiv.classList.add("start");
        startDiv.innerHTML = starIcons;
        reviewCard.appendChild(startDiv);

        const textElement = document.createElement("p");
        textElement.textContent = review.text;
        reviewCard.appendChild(textElement);

        
        reviewContainer.appendChild(reviewCard);
    }

   
    function saveReview(review) {
        let reviews = JSON.parse(localStorage.getItem("reviews")) || []; 
        const index = reviews.findIndex(r => r.id === review.id); 
        if (index !== -1) {
         
            reviews[index] = review;
        } else {
           
            reviews.push(review);
        }

        localStorage.setItem("reviews", JSON.stringify(reviews)); 
    }

    function loadReviews() {
        const reviews = JSON.parse(localStorage.getItem("reviews")) || []; 
        reviews.forEach(function (review) {
            submitReview(review);
        });
    }

   
    function getStarRating(rating) {
        let stars = "";
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars += '<i class="fa fa-star"></i>'; 
            } else {
                stars += '<i class="fa fa-star-o"></i>'; 
            }
        }
        return stars;
    }
});














