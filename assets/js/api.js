(function () {
  const API_BASE_URL = 'https://dummyjson.com/recipes';
  let cachedRecipes = null;

  async function request(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Could not load recipe data. ${error.message}`);
    }
  }

  async function getAllRecipes() {
    if (cachedRecipes) {
      return cachedRecipes;
    }

    const data = await request('?limit=0');
    cachedRecipes = Array.isArray(data.recipes) ? data.recipes : [];
    return cachedRecipes;
  }

  async function getRecipeById(id) {
    return await request(`/${id}`);
  }

  async function searchRecipes(query) {
    const encodedQuery = encodeURIComponent(query.trim());
    return await request(`/search?q=${encodedQuery}`);
  }

  async function getRecipeList(options = {}) {
    const params = new URLSearchParams();

    if (options.limit !== undefined) {
      params.set('limit', options.limit);
    }

    if (options.skip !== undefined) {
      params.set('skip', options.skip);
    }

    return await request(`?${params.toString()}`);
  }

  window.RecipeAPI = {
    getAllRecipes,
    getRecipeById,
    searchRecipes,
    getRecipeList
  };
})();
