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
                localStorage.removeItem('userEmail');  // Clear user email on logout
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
    const reviewContainer = document.getElementById("reviewsList");

    loadReviews();

    reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
        if (!isLoggedIn) {
            alert("You must be logged in to submit a review.");
            reviewForm.reset();
            window.location.href = '../HTML Pages/login.html';
            return;
        }

        const reviewerName = document.getElementById("reviewerName").value;
        const reviewerImage = document.getElementById("reviewerImage").files[0];
        const reviewRating = document.getElementById("reviewRating").value;
        const reviewText = document.getElementById("reviewText").value;
        const userEmail = localStorage.getItem("userEmail");  // Get logged-in user's email

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
                    userEmail: userEmail  // Store email to identify the review owner
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
                userEmail: userEmail  // Store email to identify the review owner
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

        // Only allow editing or deleting if the review belongs to the logged-in user's email
        const currentUserEmail = localStorage.getItem("userEmail");  // Get logged-in user's email
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

    // Edit Review Logic
    function editReview(review) {
        const reviewerName = prompt("Edit your review name:", review.name);
        const reviewText = prompt("Edit your review text:", review.text);
        const reviewRating = prompt("Edit your rating (1-5):", review.rating);

        if (reviewerName && reviewText && reviewRating) {
            review.name = reviewerName;
            review.text = reviewText;
            review.rating = reviewRating;
            saveReview(review);

            // Reload reviews to reflect changes
            document.getElementById("reviewsList").innerHTML = '';
            loadReviews();
        }
    }

    // Delete Review Logic
    function deleteReview(reviewId) {
        const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
        const currentUserEmail = localStorage.getItem("userEmail"); // Get logged-in user's email
        
        if (!isLoggedIn || !currentUserEmail) {
            alert("You must be logged in to delete a review.");
            return;  // Prevent deletion if the user is not logged in
        }

        let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
        reviews = reviews.filter(review => review.id !== reviewId);
        localStorage.setItem("reviews", JSON.stringify(reviews));

        // Remove the review from the DOM
        const reviewCard = document.querySelector(`[data-id="${reviewId}"]`);
        reviewCard.remove();
    }
});
















