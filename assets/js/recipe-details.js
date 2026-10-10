(function () {
  const detailsContainer = document.getElementById('recipe-details');
  const breadcrumbName = document.getElementById('breadcrumb-name');

  document.addEventListener('DOMContentLoaded', initRecipeDetails);

  async function initRecipeDetails() {
    const params = new URLSearchParams(window.location.search);
    const recipeId = Number(params.get('id'));

    if (!Number.isInteger(recipeId) || recipeId <= 0) {
      renderInvalidRecipe();
      return;
    }

    detailsContainer.innerHTML = window.TastyBiteUI.createLoadingHTML('Loading recipe details...');

    try {
      const recipe = await window.RecipeAPI.getRecipeById(recipeId);

      if (!recipe || !recipe.id) {
        renderInvalidRecipe();
        return;
      }

      renderRecipe(recipe);
    } catch (error) {
      detailsContainer.innerHTML = window.TastyBiteUI.createStateHTML('Recipe could not be loaded', 'Please check your connection or return to the recipes page.');
    }
  }

  function renderInvalidRecipe() {
    document.title = 'Recipe Not Found - TastyBite';
    breadcrumbName.textContent = 'Not Found';
    detailsContainer.innerHTML = `
      <div class="state-box">
        <h2>Recipe not found</h2>
        <p>The recipe ID is missing or invalid.</p>
        <a class="btn btn-primary" href="index.html">Return to Recipes</a>
      </div>
    `;
  }

  function renderRecipe(recipe) {
    const mealTypes = Array.isArray(recipe.mealType) ? recipe.mealType : [];
    const totalTime = (Number(recipe.prepTimeMinutes) || 0) + (Number(recipe.cookTimeMinutes) || 0);
    const escapeHTML = window.TastyBiteUI.escapeHTML;
    const escapeAttribute = window.TastyBiteUI.escapeAttribute;

    document.title = `${recipe.name} - TastyBite`;
    breadcrumbName.textContent = recipe.name;

    detailsContainer.innerHTML = `
      <section class="details-card">
        <div class="details-grid">
          <div class="details-image-wrap">
            <img class="details-image" src="${escapeAttribute(recipe.image || window.TastyBiteUI.fallbackImage)}" alt="${escapeAttribute(recipe.name)}">
          </div>

          <div class="details-content">
            <div class="badge-row">
              <span class="badge">${escapeHTML(recipe.cuisine || 'Global')}</span>
              ${mealTypes.map(function (mealType) {
                return `<span class="badge">${escapeHTML(mealType)}</span>`;
              }).join('')}
            </div>

            <h1>${escapeHTML(recipe.name)}</h1>
            <div class="details-meta">
              <strong><span class="rating">&#9733;</span> ${window.TastyBiteUI.formatRating(recipe.rating)}</strong>
              <span>${Number(recipe.reviewCount) || 0} reviews</span>
            </div>

            <div class="stat-list">
              <div class="stat"><span>Prep Time</span><strong>${Number(recipe.prepTimeMinutes) || 0} min</strong></div>
              <div class="stat"><span>Cook Time</span><strong>${Number(recipe.cookTimeMinutes) || 0} min</strong></div>
              <div class="stat"><span>Total Time</span><strong>${totalTime} min</strong></div>
              <div class="stat"><span>Servings</span><strong>${Number(recipe.servings) || 0}</strong></div>
              <div class="stat"><span>Difficulty</span><strong>${escapeHTML(recipe.difficulty || 'Unknown')}</strong></div>
              <div class="stat"><span>Calories</span><strong>${Number(recipe.caloriesPerServing) || 0} kcal</strong></div>
            </div>
          </div>
        </div>

        <div class="recipe-lists">
          <section class="list-panel">
            <h2>Ingredients</h2>
            <ul>
              ${(recipe.ingredients || []).map(function (ingredient) {
                return `<li>${escapeHTML(ingredient)}</li>`;
              }).join('')}
            </ul>
          </section>

          <section class="list-panel">
            <h2>Instructions</h2>
            <ol>
              ${(recipe.instructions || []).map(function (instruction) {
                return `<li>${escapeHTML(instruction)}</li>`;
              }).join('')}
            </ol>
          </section>
        </div>

        <a class="btn btn-primary" href="index.html">Back to Recipes</a>
      </section>
    `;

    window.TastyBiteUI.setupImageFallbacks(detailsContainer);
  }
})();
