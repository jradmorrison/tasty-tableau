const formatTime = require('./formatTime');

const formatRecipe = (recipe) => {
  // console.trace(recipe.images);
    recipe.image = recipe.images.split(', ')[0].slice(1);
    // console.trace(recipe.image);

    if (recipe.image.charAt(recipe.image.length - 1) === ']') {
      recipe.image = recipe.image.slice(0, recipe.image.length - 1);
    }
    // console.trace(recipe.time_total);
    if (!recipe.time_total.startsWith('PT') || recipe.time_total == 'PT0S' || recipe.time_total == 'PT') {
      recipe.time_total = 'Cook time not available'
    }
    else {
      recipe.time_total = recipe.time_total.slice(2);
      recipe.time_total = formatTime(recipe.time_total);
    }
    // console.trace(recipe);

    return recipe;
};

module.exports = formatRecipe;