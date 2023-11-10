const formatRecipe = (recipe) => {
    recipe.image = recipe.images.split(', ')[0].slice(1);
    if (recipe.image.charAt(recipe.image.length - 1) === ']') {
      recipe.image = recipe.image.slice(0, recipe.image.length - 1);
    }
    if (!recipe.time_total.startsWith('PT') || recipe.time_total == 'PT0S') {
      recipe.time_total = 'Cook time not available'
    }
    else {
      recipe.time_total = recipe.time_total.slice(2);
      recipe.time_total = formatTime(recipe.time_total);
    }
    return recipe;
};

module.exports = formatRecipe;