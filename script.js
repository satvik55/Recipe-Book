document.addEventListener('DOMContentLoaded', () => {
    const addRecipeSection = document.getElementById('addRecipeSection');
    const viewRecipesSection = document.getElementById('viewRecipesSection');
    const showAddRecipeFormBtn = document.getElementById('showAddRecipeFormBtn');
    const showAllRecipesBtn = document.getElementById('showAllRecipesBtn');
    const recipeForm = document.getElementById('recipeForm');
    const recipeNameInput = document.getElementById('recipeName');
    const recipeImageInput = document.getElementById('recipeImage');
    const recipeIngredientsInput = document.getElementById('recipeIngredients');
    const recipeStepsInput = document.getElementById('recipeSteps');
    const recipesContainer = document.getElementById('recipesContainer');
    const recipeSearchInput = document.getElementById('recipeSearchInput');
    const searchBtn = document.getElementById('searchBtn');
    const noRecipesMessage = document.querySelector('.no-recipes-message');

    const recipeDetailModal = document.getElementById('recipeDetailModal');
    const closeModalBtn = recipeDetailModal.querySelector('.close-button');
    const modalRecipeName = document.getElementById('modalRecipeName');
    const modalRecipeImage = document.getElementById('modalRecipeImage');
    const modalRecipeIngredients = document.getElementById('modalRecipeIngredients');
    const modalRecipeSteps = document.getElementById('modalRecipeSteps');
    const deleteRecipeBtn = document.getElementById('deleteRecipeBtn');

    let recipes = [];

    const loadRecipes = () => {
        const storedRecipes = localStorage.getItem('recipes');
        if (storedRecipes) {
            recipes = JSON.parse(storedRecipes);
        }
        displayRecipes(recipes);
    };

    const saveRecipes = () => {
        localStorage.setItem('recipes', JSON.stringify(recipes));
    };

    const showSection = (sectionToShow) => {
        addRecipeSection.classList.add('hidden');
        viewRecipesSection.classList.add('hidden');

        sectionToShow.classList.remove('hidden');
    };

    const displayRecipes = (recipesToDisplay) => {
        recipesContainer.innerHTML = '';
        if (recipesToDisplay.length === 0) {
            noRecipesMessage.classList.remove('hidden');
            recipesContainer.appendChild(noRecipesMessage);
            return;
        } else {
            noRecipesMessage.classList.add('hidden');
        }

        const recipesGrid = document.createElement('div');
        recipesGrid.classList.add('recipes-grid');

        recipesToDisplay.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            recipeCard.dataset.id = recipe.id;

            recipeCard.innerHTML = `
                <img src="${recipe.image || 'https://via.placeholder.com/200?text=No+Image'}" alt="${recipe.name}">
                <h3>${recipe.name}</h3>
                <p>${recipe.ingredients.split('\n')[0]}...</p>
            `;
            recipeCard.addEventListener('click', () => showRecipeDetails(recipe.id));
            recipesGrid.appendChild(recipeCard);
        });
        recipesContainer.appendChild(recipesGrid);
    };

    recipeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!recipeNameInput.value.trim() || !recipeIngredientsInput.value.trim() || !recipeStepsInput.value.trim()) {
            alert('Please fill in all required fields (Name, Ingredients, Steps).');
            return;
        }

        const newRecipe = {
            id: Date.now(),
            name: recipeNameInput.value.trim(),
            image: recipeImageInput.value.trim(),
            ingredients: recipeIngredientsInput.value.trim(),
            steps: recipeStepsInput.value.trim()
        };

        recipes.push(newRecipe);
        saveRecipes();
        displayRecipes(recipes);

        recipeForm.reset();
        showSection(viewRecipesSection);
        alert('Recipe added successfully!');
    });

    const showRecipeDetails = (recipeId) => {
        const recipe = recipes.find(r => r.id === recipeId);
        if (!recipe) return;

        modalRecipeName.textContent = recipe.name;
        modalRecipeImage.src = recipe.image || 'https://via.placeholder.com/400?text=No+Image';
        modalRecipeImage.alt = recipe.name;

        modalRecipeIngredients.innerHTML = '';
        recipe.ingredients.split('\n').forEach(ingredient => {
            if (ingredient.trim()) {
                const li = document.createElement('li');
                li.textContent = ingredient.trim();
                modalRecipeIngredients.appendChild(li);
            }
        });

        modalRecipeSteps.innerHTML = '';
        recipe.steps.split('\n').forEach(step => {
            if (step.trim()) {
                const li = document.createElement('li');
                li.textContent = step.trim();
                modalRecipeSteps.appendChild(li);
            }
        });

        deleteRecipeBtn.dataset.id = recipe.id;
        recipeDetailModal.classList.remove('hidden');
    };

    closeModalBtn.addEventListener('click', () => {
        recipeDetailModal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === recipeDetailModal) {
            recipeDetailModal.classList.add('hidden');
        }
    });

    deleteRecipeBtn.addEventListener('click', () => {
        const recipeIdToDelete = parseInt(deleteRecipeBtn.dataset.id);
        if (confirm('Are you sure you want to delete this recipe?')) {
            recipes = recipes.filter(recipe => recipe.id !== recipeIdToDelete);
            saveRecipes();
            displayRecipes(recipes);
            recipeDetailModal.classList.add('hidden');
            alert('Recipe deleted successfully!');
        }
    });

    const performSearch = () => {
        const searchTerm = recipeSearchInput.value.toLowerCase().trim();
        if (searchTerm === '') {
            displayRecipes(recipes);
            return;
        }

        const filteredRecipes = recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(searchTerm) ||
            recipe.ingredients.toLowerCase().includes(searchTerm)
        );
        displayRecipes(filteredRecipes);
    };

    searchBtn.addEventListener('click', performSearch);
    recipeSearchInput.addEventListener('keyup', performSearch);

    showAddRecipeFormBtn.addEventListener('click', () => {
        showSection(addRecipeSection);
    });

    showAllRecipesBtn.addEventListener('click', () => {
        showSection(viewRecipesSection);
        displayRecipes(recipes);
    });

    loadRecipes();
    showSection(viewRecipesSection);
});