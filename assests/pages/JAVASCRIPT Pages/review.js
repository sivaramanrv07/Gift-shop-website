// review.js

// Handle review form submission
document.getElementById('add-review-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default form submission

    // Get form data
    const name = document.getElementById('review-name').value;
    const image = document.getElementById('review-image').value;
    const rating = document.getElementById('review-rating').value;
    const text = document.getElementById('review-text').value;

    // Validate input
    if (name === "" || image === "" || rating < 1 || rating > 5 || text === "") {
        alert("Please fill out all fields correctly.");
        return;
    }

    // Create a review object (you can send this to a server if needed)
    const review = {
        name: name,
        image: image,
        rating: rating,
        text: text
    };

    // Store the review in localStorage (for simplicity, you could also send this to a backend)
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    reviews.push(review);
    localStorage.setItem("reviews", JSON.stringify(reviews));

    // Update the UI with the new review
    displayReviews();

    // Reset form
    document.getElementById('add-review-form').reset();
});

// Function to display all reviews
function displayReviews() {
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    // Get the reviews container and clear it
    const reviewsContainer = document.getElementById('reviews-container');
    reviewsContainer.innerHTML = "";

    // Loop through reviews and create HTML elements for each
    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review');

        reviewElement.innerHTML = `
            <div class="review-image">
                <img src="${review.image}" alt="Review Image">
            </div>
            <div class="review-info">
                <h3>${review.name}</h3>
                <p>Rating: ${review.rating} / 5</p>
                <p>${review.text}</p>
            </div>
        `;

        // Append the review to the container
        reviewsContainer.appendChild(reviewElement);
    });
}

// Call displayReviews on page load to show all reviews
window.onload = function() {
    displayReviews();
};

