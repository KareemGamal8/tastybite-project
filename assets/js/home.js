(function () {
  const fallbackImage = 'https://cdn.dummyjson.com/recipe-images/1.webp';

  document.addEventListener('DOMContentLoaded', function () {
    setupNavigation();
    setupFooterYear();
    loadPopularRecipes();
  });

  function setupNavigation() {
    const toggleButton = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (!toggleButton || !navMenu) {
      return;
    }

    toggleButton.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      toggleButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  function setupFooterYear() {
    const yearElement = document.getElementById('current-year');

    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  async function loadPopularRecipes() {
    const popularRecipesElement = document.getElementById('popular-recipes');

    if (!popularRecipesElement) {
      return;
    }

    popularRecipesElement.innerHTML = createLoadingHTML('Loading popular recipes...');

    try {
      const recipes = await window.RecipeAPI.getAllRecipes();
      const popularRecipes = recipes
        .slice()
        .sort(function (firstRecipe, secondRecipe) {
          return (secondRecipe.rating || 0) - (firstRecipe.rating || 0);
        })
        .slice(0, 4);

      popularRecipesElement.innerHTML = popularRecipes.map(createRecipeCardHTML).join('');
      setupImageFallbacks(popularRecipesElement);
    } catch (error) {
      popularRecipesElement.innerHTML = createStateHTML('Popular recipes are unavailable', 'Please check your connection and try again.');
    }
  }

  function createRecipeCardHTML(recipe) {
    const mealTypes = Array.isArray(recipe.mealType) ? recipe.mealType : [];
    const mealTypeBadges = mealTypes
      .slice(0, 2)
      .map(function (mealType) {
        return `<span class="badge">${escapeHTML(mealType)}</span>`;
      })
      .join('');

    return `
      <article class="recipe-card">
        <img src="${escapeAttribute(recipe.image || fallbackImage)}" alt="${escapeAttribute(recipe.name)}" loading="lazy">
        <div class="card-body">
          <div class="badge-row">
            <span class="badge">${escapeHTML(recipe.cuisine || 'Global')}</span>
            ${mealTypeBadges}
          </div>
          <h3><a class="card-title" href="recipe-details.html?id=${Number(recipe.id)}">${escapeHTML(recipe.name)}</a></h3>
          <div class="card-bottom">
            <span><span class="rating">&#9733;</span> ${formatRating(recipe.rating)}</span>
            <span>${Number(recipe.prepTimeMinutes) || 0} min prep</span>
          </div>
          <a class="btn btn-secondary btn-small" href="recipe-details.html?id=${Number(recipe.id)}">View Recipe</a>
        </div>
      </article>
    `;
  }

  function setupImageFallbacks(parentElement) {
    const images = parentElement.querySelectorAll('img');

    images.forEach(function (image) {
      image.addEventListener('error', function () {
        image.src = fallbackImage;
      }, { once: true });
    });
  }

  function createLoadingHTML(message) {
    return `<div class="loading-box">${escapeHTML(message)}</div>`;
  }

  function createStateHTML(title, message) {
    return `
      <div class="state-box">
        <h3>${escapeHTML(title)}</h3>
        <p>${escapeHTML(message)}</p>
      </div>
    `;
  }

  function formatRating(rating) {
    return Number(rating || 0).toFixed(1);
  }

  function escapeHTML(value) {
    return String(value || '').replace(/[&<>"']/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[character];
    });
  }

  function escapeAttribute(value) {
    return escapeHTML(value);
  }

  window.TastyBiteUI = {
    createRecipeCardHTML,
    setupImageFallbacks,
    createLoadingHTML,
    createStateHTML,
    escapeHTML,
    escapeAttribute,
    formatRating,
    fallbackImage
  };
})();
