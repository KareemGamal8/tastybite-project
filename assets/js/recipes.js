(function () {
  const recipesPerPage = 10;
  let allRecipes = [];
  let currentPage = 1;
  let searchText = '';
  let selectedMealType = 'all';
  let selectedCuisine = 'all';
  let selectedSort = 'default';

  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const clearSearchButton = document.getElementById('clear-search');
  const mealTypeFilter = document.getElementById('meal-type-filter');
  const cuisineFilter = document.getElementById('cuisine-filter');
  const sortFilter = document.getElementById('sort-filter');
  const resetFiltersButton = document.getElementById('reset-filters');
  const recipesGrid = document.getElementById('recipes-grid');
  const resultsCount = document.getElementById('results-count');
  const previousPageButton = document.getElementById('previous-page');
  const nextPageButton = document.getElementById('next-page');
  const pageStatus = document.getElementById('page-status');

  document.addEventListener('DOMContentLoaded', initRecipesPage);

  async function initRecipesPage() {
    recipesGrid.innerHTML = window.TastyBiteUI.createLoadingHTML('Loading recipes...');

    try {
      allRecipes = await window.RecipeAPI.getAllRecipes();
      populateFilters(allRecipes);
      setupEvents();
      renderRecipes();
    } catch (error) {
      recipesGrid.innerHTML = window.TastyBiteUI.createStateHTML('Recipes are unavailable', 'Please check your connection and try again.');
      resultsCount.textContent = 'Showing 0 of 0 recipes';
      updatePagination(0);
    }
  }

  function setupEvents() {
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      searchText = searchInput.value.trim();
      currentPage = 1;
      renderRecipes();
    });

    clearSearchButton.addEventListener('click', function () {
      searchInput.value = '';
      searchText = '';
      currentPage = 1;
      renderRecipes();
    });

    searchInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        searchText = searchInput.value.trim();
        currentPage = 1;
        renderRecipes();
      }
    });

    mealTypeFilter.addEventListener('change', function () {
      selectedMealType = mealTypeFilter.value;
      currentPage = 1;
      renderRecipes();
    });

    cuisineFilter.addEventListener('change', function () {
      selectedCuisine = cuisineFilter.value;
      currentPage = 1;
      renderRecipes();
    });

    sortFilter.addEventListener('change', function () {
      selectedSort = sortFilter.value;
      currentPage = 1;
      renderRecipes();
    });

    resetFiltersButton.addEventListener('click', resetFilters);

    previousPageButton.addEventListener('click', function () {
      if (currentPage > 1) {
        currentPage -= 1;
        renderRecipes();
      }
    });

    nextPageButton.addEventListener('click', function () {
      const totalPages = Math.ceil(getFilteredRecipes().length / recipesPerPage);

      if (currentPage < totalPages) {
        currentPage += 1;
        renderRecipes();
      }
    });
  }

  function populateFilters(recipes) {
    const mealTypes = [...new Set(recipes.flatMap(function (recipe) {
      return Array.isArray(recipe.mealType) ? recipe.mealType : [];
    }).filter(Boolean))].sort();

    const cuisines = [...new Set(recipes.map(function (recipe) {
      return recipe.cuisine;
    }).filter(Boolean))].sort();

    addOptions(mealTypeFilter, mealTypes);
    addOptions(cuisineFilter, cuisines);
  }

  function addOptions(selectElement, options) {
    options.forEach(function (optionText) {
      const option = document.createElement('option');
      option.value = optionText;
      option.textContent = optionText;
      selectElement.appendChild(option);
    });
  }

  function getFilteredRecipes() {
    let filteredRecipes = allRecipes.filter(function (recipe) {
      const recipeName = String(recipe.name || '').toLowerCase();
      const matchesSearch = recipeName.includes(searchText.toLowerCase());
      const matchesMealType = selectedMealType === 'all' || (Array.isArray(recipe.mealType) && recipe.mealType.includes(selectedMealType));
      const matchesCuisine = selectedCuisine === 'all' || recipe.cuisine === selectedCuisine;

      return matchesSearch && matchesMealType && matchesCuisine;
    });

    if (selectedSort === 'name-asc') {
      filteredRecipes = filteredRecipes.slice().sort(function (firstRecipe, secondRecipe) {
        return firstRecipe.name.localeCompare(secondRecipe.name);
      });
    }

    if (selectedSort === 'rating-desc') {
      filteredRecipes = filteredRecipes.slice().sort(function (firstRecipe, secondRecipe) {
        return (secondRecipe.rating || 0) - (firstRecipe.rating || 0);
      });
    }

    return filteredRecipes;
  }

  function renderRecipes() {
    const filteredRecipes = getFilteredRecipes();
    const totalPages = Math.max(1, Math.ceil(filteredRecipes.length / recipesPerPage));

    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * recipesPerPage;
    const currentRecipes = filteredRecipes.slice(startIndex, startIndex + recipesPerPage);

    renderResultsCount(filteredRecipes.length, currentRecipes.length, startIndex);
    updatePagination(filteredRecipes.length);

    if (currentRecipes.length === 0) {
      recipesGrid.innerHTML = window.TastyBiteUI.createStateHTML('No recipes found', 'Try a different search term or reset the filters.');
      return;
    }

    recipesGrid.innerHTML = currentRecipes.map(window.TastyBiteUI.createRecipeCardHTML).join('');
    window.TastyBiteUI.setupImageFallbacks(recipesGrid);
  }

  function renderResultsCount(totalRecipes, visibleRecipesCount, startIndex) {
    if (totalRecipes === 0) {
      resultsCount.textContent = 'Showing 0 of 0 recipes';
      return;
    }

    const startNumber = startIndex + 1;
    const endNumber = startIndex + visibleRecipesCount;
    resultsCount.textContent = `Showing ${startNumber}-${endNumber} of ${totalRecipes} recipes`;
  }

  function updatePagination(totalRecipes) {
    const totalPages = Math.max(1, Math.ceil(totalRecipes / recipesPerPage));

    pageStatus.textContent = `Page ${currentPage} of ${totalPages}`;
    previousPageButton.disabled = currentPage === 1 || totalRecipes === 0;
    nextPageButton.disabled = currentPage === totalPages || totalRecipes === 0;
  }

  function resetFilters() {
    searchText = '';
    selectedMealType = 'all';
    selectedCuisine = 'all';
    selectedSort = 'default';
    currentPage = 1;

    searchInput.value = '';
    mealTypeFilter.value = 'all';
    cuisineFilter.value = 'all';
    sortFilter.value = 'default';
    renderRecipes();
  }
})();
