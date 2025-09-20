document.addEventListener('DOMContentLoaded', () => {
    const favoritesGrid = document.getElementById('favorites-grid');
    let allRecipes = [];
    let favoriteIds = [];

    fetch('data/recipes.json')
        .then(response => response.json())
        .then(data => {
            allRecipes = data;
            loadAndDisplayFavorites();
        })
        .catch(error => console.error('Error fetching recipes:', error));
    function loadAndDisplayFavorites() {
        favoriteIds = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
        const favoriteRecipes = allRecipes.filter(recipe => favoriteIds.includes(recipe.id));
        
        favoritesGrid.innerHTML = ''; 

        if (favoriteRecipes.length === 0) {
            favoritesGrid.innerHTML = '<p>You haven\'t saved any favorite recipes yet. Click the heart icon on a recipe to add it here!</p>';
            return;
        }
        favoriteRecipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'favorite-card';
            card.dataset.id = recipe.id;
            card.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.name}">
                <div class="favorite-card-content">
                    <h3>${recipe.name}</h3>
                    <p>${recipe.description}</p>
                    <div class="card-actions">
                        <a href="#" class="btn view-recipe-btn">View Recipe</a>
                        <button class="btn-secondary remove-btn">Remove</button>
                    </div>
                </div>
            `;
            favoritesGrid.appendChild(card);
        });
    }
    favoritesGrid.addEventListener('click', (event) => {
        const target = event.target;
        const card = target.closest('.favorite-card');
        if (!card) return;

        const recipeId = parseInt(card.dataset.id);
        if (target.classList.contains('remove-btn')) {
            const index = favoriteIds.indexOf(recipeId);
            if (index > -1) {
                favoriteIds.splice(index, 1);
            }
            localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteIds));
            card.remove();
            if (favoriteIds.length === 0) {
                 favoritesGrid.innerHTML = '<p>You haven\'t saved any favorite recipes yet. Click the heart icon on a recipe to add it here!</p>';
            }
        }
        if(target.classList.contains('view-recipe-btn')) {
            alert('Opening recipe details modal is not yet implemented on this page.');
        }
    });
});
