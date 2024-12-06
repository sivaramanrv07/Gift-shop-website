fetch('../JSON Pages/review.json')  // Path to your JSON file
    .then(response => response.json())  // Parse JSON response
    .then(reviews => {
        // Now you have the reviews data and can generate reviews
        generateReviews(reviews);
    })
    .catch(error => console.error('Error loading reviews:', error));

// Function to display the reviews
function generateReviews(reviews) {
    const reviewContainer = document.getElementById('review-slider');
    reviewContainer.innerHTML = "";  // Clear previous reviews

    reviews.forEach((review, index) => {
        const reviewBox = document.createElement('div');
        reviewBox.classList.add('review-box');

        const imgElement = document.createElement('img');
        imgElement.src = review.image;
        imgElement.alt = review.name;
        reviewBox.appendChild(imgElement);

        const starDiv = document.createElement('div');
        starDiv.classList.add('start');
        const nameElement = document.createElement('h3');
        nameElement.textContent = review.name;
        starDiv.appendChild(nameElement);

        const fullStars = Math.floor(review.rating);
        const halfStars = review.rating % 1 >= 0.5;

        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            const star = document.createElement('i');
            star.classList.add('fas', 'fa-star');
            starDiv.appendChild(star);
        }

        // Add half star
        if (halfStars) {
            const halfStar = document.createElement('i');
            halfStar.classList.add('fas', 'fa-star-half-alt');
            starDiv.appendChild(halfStar);
        }

        reviewBox.appendChild(starDiv);

        const reviewText = document.createElement('p');
        reviewText.textContent = review.review;
        reviewBox.appendChild(reviewText);

        const buttonDiv = document.createElement('div');
        buttonDiv.classList.add('review-buttons');
        const editButton = document.createElement('button');
        editButton.textContent = "Edit";
        editButton.onclick = () => editReview(index, reviews);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteReview(index, reviews);

        buttonDiv.appendChild(editButton);
        buttonDiv.appendChild(deleteButton);

        reviewBox.appendChild(buttonDiv);

        reviewContainer.appendChild(reviewBox);
    });
}

// Add new review functionality
document.getElementById('add-review-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('review-name').value;
    const image = document.getElementById('review-image').value;
    const rating = parseFloat(document.getElementById('review-rating').value);
    const reviewText = document.getElementById('review-text').value;

    const newReview = {
        name: name,
        image: image,
        rating: rating,
        review: reviewText
    };

    // Fetch the existing reviews from JSON and add the new one
    fetch('../JSON Pages/review.json')
        .then(response => response.json())
        .then(reviews => {
            reviews.push(newReview);  // Add new review to the array
            generateReviews(reviews);  // Update the display
            this.reset();  // Reset the form
        })
        .catch(error => console.error('Error fetching reviews:', error));
});

// Edit review functionality
function editReview(index, reviews) {
    const review = reviews[index];

    document.getElementById('review-name').value = review.name;
    document.getElementById('review-image').value = review.image;
    document.getElementById('review-rating').value = review.rating;
    document.getElementById('review-text').value = review.review;

    document.getElementById('add-review-form').addEventListener('submit', function (event) {
        event.preventDefault();

        reviews[index] = {
            name: document.getElementById('review-name').value,
            image: document.getElementById('review-image').value,
            rating: parseFloat(document.getElementById('review-rating').value),
            review: document.getElementById('review-text').value
        };

        generateReviews(reviews);  // Re-render the reviews
        this.reset();  // Reset form
    }, { once: true });
}

// Delete review functionality
function deleteReview(index, reviews) {
    reviews.splice(index, 1);  // Remove the review from array
    generateReviews(reviews);  // Update the display
}
