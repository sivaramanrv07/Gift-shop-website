
function displayFeatures(data) {
    const boxContainer = document.getElementById('box-container');
    
    data.features.forEach(feature => {
        const featureDiv = document.createElement('div');
        featureDiv.classList.add('box');
        
    
        featureDiv.innerHTML = `
            <img src="${feature.image}" alt="${feature.title}">
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
            <button type="button" class="button read-more-btn">${feature.buttonText}</button>
        `;

   
        boxContainer.appendChild(featureDiv);

     
        const readMoreButton = featureDiv.querySelector('.read-more-btn');
        const description = featureDiv.querySelector('p');
        const moreText = description.querySelector('.more-text');
        
    
        moreText.style.display = 'none';

        readMoreButton.addEventListener('click', () => {
            if (moreText.style.display === 'none') {
                moreText.style.display = 'inline';  
                readMoreButton.textContent = 'Read Less';  
            } else {
                moreText.style.display = 'none'; 
                readMoreButton.textContent = 'Read More';  
            }
        });
    });
}


fetch('../JSON Pages/features.json')
    .then(response => response.json())  
    .then(data => {
        displayFeatures(data);  
    })
    .catch(error => console.error('Error loading JSON:', error));