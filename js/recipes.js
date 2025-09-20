document.addEventListener('DOMContentLoaded', () => {

    const recipesGrid = document.getElementById('recipes-grid');
    const searchInput = document.getElementById('search-input');
    const categoryRadios = document.querySelectorAll('input[name="category"]');
    const dietCheckboxes = document.querySelectorAll('input[name="diet"]');
    const sortSelect = document.getElementById('sort-select');
    const modal = document.getElementById('recipe-modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');
    const featuredRecipeSection = document.getElementById('featured-recipe');
    const mobileFilterBtn = document.getElementById('mobile-filter-btn');
    const filtersSidebar = document.getElementById('filters-sidebar');

    let allRecipes = []; 
    let favoriteIds = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];


    fetch('data/recipes.json')
        .then(response => response.json())
        .then(data => {
            allRecipes = data;
            displayFeaturedRecipe(allRecipes); 
            renderRecipes(); 
        })
        .catch(error => console.error('Error fetching recipes:', error));
    function displayFeaturedRecipe(recipes) {
        if (!featuredRecipeSection || recipes.length === 0) return;
        const featured = recipes[1]; 
        
        featuredRecipeSection.innerHTML = `
            <div class="featured-recipe-image">
                <img src="${featured.hero_image || featured.image}" alt="${featured.name}">
            </div>
            <div class="featured-recipe-content">
                <h4>✨ Featured Recipe</h4>
                <h2>${featured.name}</h2>
                <p>${featured.description}</p>
                <button class="btn view-recipe-btn" data-id="${featured.id}">View Recipe</button>
            </div>
        `;
        featuredRecipeSection.querySelector('.view-recipe-btn').addEventListener('click', (e) => {
            const recipeId = parseInt(e.currentTarget.dataset.id);
            const recipe = allRecipes.find(r => r.id === recipeId);
            if (recipe) showModal(recipe);
        });
    }
    function renderRecipes() {
        const searchValue = searchInput.value.toLowerCase();
        const selectedCategory = document.querySelector('input[name="category"]:checked').value;
        const selectedDiets = Array.from(dietCheckboxes)
                                   .filter(checkbox => checkbox.checked)
                                   .map(checkbox => checkbox.value);

        let filteredRecipes = allRecipes.filter(recipe => {
            const nameMatch = recipe.name.toLowerCase().includes(searchValue) || recipe.description.toLowerCase().includes(searchValue);
            const categoryMatch = selectedCategory === 'all' || recipe.category === selectedCategory;
            const dietMatch = selectedDiets.every(diet => recipe.dietary.includes(diet));
            return nameMatch && categoryMatch && dietMatch;
        });

        const sortValue = sortSelect.value;
        if (sortValue === 'calories-asc') {
            filteredRecipes.sort((a, b) => a.calories - b.calories);
        } else if (sortValue === 'calories-desc') {
            filteredRecipes.sort((a, b) => b.calories - a.calories);
        }

        displayRecipes(filteredRecipes);
    }
    function displayRecipes(recipes) {
        recipesGrid.innerHTML = '';
        if (recipes.length === 0) {
            recipesGrid.innerHTML = '<p style="text-align:center; grid-column: 1 / -1;">No recipes found matching your criteria.</p>';
            return;
        }

        recipes.forEach(recipe => {
            const isFavorited = favoriteIds.includes(recipe.id);
            const card = document.createElement('div');
            card.className = 'recipe-card';
            card.dataset.id = recipe.id;

            card.innerHTML = `
                <div class="recipe-card-image-container">
                    <img src="${recipe.image}" alt="${recipe.name}">
                    <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" data-recipe-id="${recipe.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="recipe-card-content">
                    <h3>${recipe.name}</h3>
                    <div class="recipe-card-details">
                        <span><i class="far fa-clock"></i> ${recipe.time || '25'} min</span>
                        <span><i class="fas fa-fire-alt"></i> ${recipe.calories} kcal</span>
                    </div>
                    <button class="btn view-recipe-btn">View Recipe</button>
                </div>
            `;
            recipesGrid.appendChild(card);
        });
    }   
    searchInput.addEventListener('input', renderRecipes);
    dietCheckboxes.forEach(checkbox => checkbox.addEventListener('change', renderRecipes));
    categoryRadios.forEach(radio => radio.addEventListener('change', renderRecipes));
    sortSelect.addEventListener('change', renderRecipes);


    mobileFilterBtn.addEventListener('click', () => {
        filtersSidebar.classList.toggle('active');
    });

    recipesGrid.addEventListener('click', (event) => {
        const target = event.target;
        if (target.closest('.favorite-btn')) {
            const button = target.closest('.favorite-btn');
            const recipeId = parseInt(button.dataset.recipeId);
            toggleFavorite(recipeId, button);
            return;
        }
        if (target.classList.contains('view-recipe-btn')) {
            const card = target.closest('.recipe-card');
            if (card) {
                const recipeId = parseInt(card.dataset.id);
                const recipe = allRecipes.find(r => r.id === recipeId);
                if (recipe) showModal(recipe);
            }
        }
    });

    function toggleFavorite(recipeId, buttonElement) {
        const index = favoriteIds.indexOf(recipeId);
        if (index > -1) {
            favoriteIds.splice(index, 1);
        } else {
            favoriteIds.push(recipeId);
        }
        localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteIds));
        buttonElement.classList.toggle('favorited');
    }

    function showModal(recipe) {
        const ingredientsHtml = recipe.ingredients.map(ing => `<li>${ing}</li>`).join('');
        const stepsHtml = recipe.steps.map((step, index) => `
            <div class="step">
                ${step.image ? `<div class="step-image"><img src="${step.image}" alt="Step ${index + 1}"></div>` : ''}
                <div class="step-text">
                    <h4>Step ${index + 1}</h4>
                    <p>${step.text}</p>
                </div>
            </div>
        `).join('');

        modalBody.innerHTML = `
            <h2>${recipe.name}</h2>
            <p class="modal-description">${recipe.description}</p>
            <img src="${recipe.hero_image || recipe.image}" alt="${recipe.name}" class="modal-main-image">
            <div class="modal-details-grid">
                <div class="ingredients-nutrition">
                    <h3>Ingredients</h3>
                    <ul class="ingredients-list">${ingredientsHtml}</ul>
                </div>
                <div class="instructions">
                    <h3>Instructions</h3>
                    <ol class="instructions-list">${recipe.steps.map(s => `<li>${s.text}</li>`).join('')}</ol>
                </div>
            </div>
        `;
        modal.classList.add('show');
    }
    function closeModal() {
        modal.classList.remove('show');
    }

    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) closeModal();
    });
});