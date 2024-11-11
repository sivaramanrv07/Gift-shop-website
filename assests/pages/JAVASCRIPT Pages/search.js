
document.getElementById('search-icon').addEventListener('click', function(event) {
    const searchBarContainer = document.querySelector('.search-bar-container');
    
  
    searchBarContainer.style.display = searchBarContainer.style.display === 'none' || searchBarContainer.style.display === '' ? 'flex' : 'none';
    
    event.stopPropagation();
  });
  
 
  document.getElementById('close-search').addEventListener('click', function(event) {
    const searchBarContainer = document.querySelector('.search-bar-container');
    searchBarContainer.style.display = 'none';
   
    event.stopPropagation();
  });
 
  document.addEventListener('click', function(event) {
    const searchBarContainer = document.querySelector('.search-bar-container');
    const searchIcon = document.getElementById('search-icon');
  
  
    if (!searchIcon.contains(event.target) && !searchBarContainer.contains(event.target)) {
      searchBarContainer.style.display = 'none';
    }
  });