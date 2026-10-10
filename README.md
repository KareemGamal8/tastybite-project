# TastyBite

TastyBite is a small, polished restaurant recipe website built with HTML, CSS, Vanilla JavaScript, and the DummyJSON Recipes API. It is designed as a beginner-friendly portfolio project that students can understand, explain, and extend.

## Pages

- `index.html` - Landing page with a hero, popular recipes, and about section.
- `recipes.html` - Recipe listing page with search, filters, sorting, result count, and pagination.
- `recipe-details.html` - Recipe detail page loaded from the recipe ID in the URL.

## Features

- Responsive shared header and footer.
- Popular recipes loaded dynamically from DummyJSON data.
- Recipe cards with image, name, cuisine, rating, prep time, and details link.
- Search by recipe name.
- Dynamic meal type and cuisine dropdowns.
- Sorting by default order, name A-Z, or highest rating.
- Client-side pagination with Previous and Next buttons.
- Recipe details with image, meal types, rating, time, servings, difficulty, ingredients, and instructions.
- Loading, error, no-results, and invalid-ID states.

## Folder Structure

```text
tastybite-project/
|-- index.html
|-- recipes.html
|-- recipe-details.html
|-- assets/
|   |-- css/
|   |   `-- style.css
|   `-- js/
|       |-- api.js
|       |-- home.js
|       |-- recipes.js
|       `-- recipe-details.js
`-- README.md
```

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- DummyJSON Recipes API

No frameworks, build tools, package installs, or backend are required.

## API Endpoints Used

- `https://dummyjson.com/recipes?limit=0`
- `https://dummyjson.com/recipes/{id}`
- `https://dummyjson.com/recipes/search?q={query}` is included in `api.js` for learning, although the listing page filters locally so search can work together with meal type, cuisine, sorting, and pagination.

The project does not use nonexistent endpoints such as `/recipes/meal-type-list` or `/recipes/cuisine-list`. Meal types are extracted with `flatMap()` and `Set`, and cuisines are extracted with `map()` and `Set`.

## How Search, Filters, Sorting, and Pagination Work

The recipes page fetches all recipes once with `/recipes?limit=0`. JavaScript then:

1. Filters by recipe name.
2. Filters by selected meal type.
3. Filters by selected cuisine.
4. Sorts a copied array.
5. Uses `slice()` to show ten recipes for the current page.

Pagination is reset to page 1 whenever search, filters, or sorting changes.

## Recipe Details

The details page reads the selected recipe ID with:

```js
new URLSearchParams(window.location.search)
```

Then it fetches the matching recipe from `https://dummyjson.com/recipes/{id}` and renders the page. Missing or invalid IDs show a friendly error.

## Run Locally

Use VS Code Live Server or any simple static server.

With VS Code Live Server:

1. Open this folder in VS Code.
2. Right-click `index.html`.
3. Choose "Open with Live Server".

With Python:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/index.html`.

## Known Limitations

- DummyJSON is demo data, so recipes and images are limited to what the API provides.
- There is no backend, account system, favorites, or saved user data.
- Search on the listing page intentionally searches recipe names only to keep the project simple for beginners.
