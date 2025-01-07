window.onload = () => {
    const userIconLink = document.getElementById('userIconLink');
    const loginLogoutButtonContainer = document.getElementById('loginLogoutButtonContainer');
    const loginLogoutButton = document.getElementById('loginLogoutButton');
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const cartIconLink = document.getElementById('cartIconLink'); 

    userIconLink.onclick = function () {
        loginLogoutButtonContainer.style.display =
            loginLogoutButtonContainer.style.display === 'none' ? 'block' : 'none';

        if (isLoggedIn) {
            loginLogoutButton.textContent = 'Logout';
            loginLogoutButton.onclick = function () {
                localStorage.setItem('userLoggedIn', 'false');
                localStorage.removeItem('userEmail'); 
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

   
    const reviewerNameError = document.getElementById("reviewerName-error");
    const reviewerImageError = document.getElementById("reviewerImage-error");
    const reviewRatingError = document.getElementById("reviewRating-error");
    const reviewTextError = document.getElementById("reviewText-error");

    const reviewContainer = document.getElementById("reviewsList");

    loadReviews();

    reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();

       
        reviewerNameError.textContent = '';
        reviewerImageError.textContent = '';
        reviewRatingError.textContent = '';
        reviewTextError.textContent = '';

        const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
        if (!isLoggedIn) {
            alert("You must be logged in to submit a review.");
            window.location.href = '../HTML Pages/login.html';
            return;
        }

        const reviewerName = document.getElementById("reviewerName").value;
        const reviewerImage = document.getElementById("reviewerImage").files[0];
        const reviewRating = document.getElementById("reviewRating").value;
        const reviewText = document.getElementById("reviewText").value;
        const userEmail = localStorage.getItem("userEmail");

        
        let valid = true;

       
        if (!reviewerName) {
            reviewerNameError.textContent = "Please enter your name.";
            valid = false;
        } else if (reviewerName.length < 3) {
            reviewerNameError.textContent = "Name must be at least 3 characters long.";
            valid = false;
        } else if (reviewerName.length > 15) {
            reviewerNameError.textContent = "Name must be no more than 15 characters long.";
            valid = false;
        } else if (/[^a-zA-Z]/.test(reviewerName)) {  // Allow only letters, no numbers or special characters
            reviewerNameError.textContent = "Name should only contain letters, no spaces, numbers, or special characters.";
            valid = false;
        }

       
        if (!reviewRating) {
            reviewRatingError.textContent = "Please select a rating.";
            valid = false;
        }

        
        if (!reviewText) {
            reviewTextError.textContent = "Please enter your review text.";
            valid = false;
        } else if (reviewText.length < 10) {
            reviewTextError.textContent = "Review text must be more than 10 characters.";
            valid = false;
        } else if (reviewText.length > 200) {
            reviewTextError.textContent = "Review text must be no more than 200 characters.";
            valid = false;
        } else if (/^[0-9]*$/.test(reviewText) || /^[^a-zA-Z0-9]*$/.test(reviewText)) {
            reviewTextError.textContent = "Review text must not contain only numbers or special characters.";
            valid = false;
        }

        if (!reviewerImage) {
            reviewerImageError.textContent = "Please upload an image.";
            valid = false;
        } else {
            const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedImageTypes.includes(reviewerImage.type)) {
                reviewerImageError.textContent = "Please upload a valid image (JPG, PNG, or GIF).";
                valid = false;
            }
        }

        if (!valid) {
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
                    userEmail: userEmail
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
                userEmail: userEmail
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

        const currentUserEmail = localStorage.getItem("userEmail");
        if (review.userEmail === currentUserEmail) {
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.classList.add("edit");
            editButton.addEventListener('click', function () {
                editReview(review);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete")
            deleteButton.addEventListener('click', function () {
                deleteReview(review.id);
            });

            reviewCard.appendChild(editButton);
            reviewCard.appendChild(deleteButton);
        }

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

    function editReview(review) {
        const reviewerName = prompt("Edit your review name:", review.name);
        const reviewText = prompt("Edit your review text:", review.text);
        const reviewRating = prompt("Edit your rating (1-5):", review.rating);

        if (reviewerName && reviewText && reviewRating) {
            review.name = reviewerName;
            review.text = reviewText;
            review.rating = reviewRating;
            saveReview(review);

            document.getElementById("reviewsList").innerHTML = '';
            loadReviews();
        }
    }

    function deleteReview(reviewId) {
        const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
        const currentUserEmail = localStorage.getItem("userEmail");
        if (!isLoggedIn || !currentUserEmail) {
            alert("You must be logged in to delete a review.");
            return;
        }

        let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
        reviews = reviews.filter(review => review.id !== reviewId);
        localStorage.setItem("reviews", JSON.stringify(reviews));

        const reviewCard = document.querySelector(`[data-id="${reviewId}"]`);
        reviewCard.remove();
    }
});



    
   
















