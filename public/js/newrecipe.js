$(function () {
  ///////////////////////////////////////////////////////////////////
  //                      Event Listenters
  ///////////////////////////////////////////////////////////////////
  $('#recipe-submit').on('click', addNewRecipe);
  $('#recipe-update-submit').on('click', updateRecipe);
  $('#Button-Delete-Recipe').on('click', deleteRecipe);
  $('#Tag-Button').on('click', addTag);
  $('#Tag-Container').on('click', '.Tag-Remove-Button', removeTag);
  $('#Ingredient-Button').on('click', addIngredient);
  $('#Ingredient-Container').on('click', '.Ing-Remove-Button', removeIngredient);

  Initilize();
});

/**
 * Initializes the application by populating arrays with tag and ingredient information from specific containers.
 * Adds tag IDs to the 'alltags' array and extracts ingredient details (ID and quantity) into the 'allIngredients' array.
 * @returns {void}
 */
const Initilize = () => {
  for (const child of $('#Tag-Container').children()) {
    alltags.push($(child).attr('id'));
  }

  for (const child of $('#Ingredient-Container').children()) {
    const newIng = {
      ingredient_id: $(child).attr('id'),
      quantity: $(child).children().eq(0).text().split(' - ')[0].match(/\d+/)[0],
    };

    allIngredients.push(newIng);
  }

  // console.log(allIngredients);
};

/**
 * ==========================================================================================================================================
 * Handles the submission of a new recipe form by sending a POST and PUT request to the server with the provided recipe details.
 * Calls the common 'submitRecipe' function with the 'POST' or 'PUT' type.
 * @param {Event} event - The event object triggering the function (usually a form submission event).
 * @returns {Promise<void>} - Redirects to the dashboard on successful recipe addition; displays an alert on error.
 */
const addNewRecipe = async (event) => {
  event.preventDefault();
  submitRecipe('POST');
};

const updateRecipe = async (event) => {
  event.preventDefault();
  submitRecipe('PUT');
};
// ===========================================================================================================================================

/**
 * Submits a recipe to the server based on the specified request type ('POST' or 'PUT').
 * Extracts recipe details from the form elements and sends them in the request body.
 * Redirects to the dashboard on successful submission; displays an alert on error.
 * @param {string} type - The type of request ('POST' for new recipe, 'PUT' for recipe update).
 * @returns {Promise<void>} - Redirects to the dashboard on successful submission; displays an alert on error.
 */
const submitRecipe = async (type) => {
  let name = $('#name').val();
  let category_id = $('#Input-Category').val();
  let description = $('#description').val();
  let timeHours = $('#time-prep-hours').val();
  let timeMinutes = $('#time-prep-minutes').val();

  let time_total = `PT${timeHours}H${timeMinutes}M`;
  if (timeHours == 0) {
    time_total = `PT${timeMinutes}M`;
  } else if (timeMinutes == 0) {
    time_total = `PT${timeHours}H`;
  }

  let instructions = $('#instructions').val().trim();
  if (instructions.endsWith('.')) {
    console.trace('ends with period');
    instructions = instructions.slice(0, -1);
  } else {
    console.trace('doesnt end with period');
  }

  instructions = instructions.replaceAll('.', '.,');
  instructions = '[' + instructions + ']';

  //Ingredients
  let formIng = $('#Ingredient-Container').children();
  let ingredients = [];
  for (const inputIng of formIng) {
    let name = $(inputIng).children().eq(0).text().split('-');
    let newing = {
      ing: $(inputIng).attr('id'),
      quantity: name[0].trim(),
    };
    ingredients.push(newing);
  }
  console.log(ingredients);

  //Tags
  let tags = [];
  for (const inputTag of alltags) {
    tags.push(inputTag);
  }

  console.log(name);
  console.log(description);
  let fetchLocation = `../api/recipes`;
  if (type === 'PUT') {
    let url = window.location.href.split('/');
    let recipeID = url[url.length - 1];
    fetchLocation = `../${recipeID}`;
    console.log(recipeID);
  }
  if (name && description && category_id) {
    console.log(type);
    const response = await fetch(fetchLocation, {
      method: type,
      body: JSON.stringify({ name, description, time_total, category_id, instructions, ingredients, tags }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      await alert('Error adding recipe');
      document.location.reload();
    }
  }
};

/**
 * Handles the deletion of a recipe by sending a DELETE request to the server.
 * Redirects to the dashboard on successful deletion; displays an alert on error.
 * @param {Event} e - The event object triggering the function (usually a button click event).
 * @returns {Promise<void>} - Redirects to the dashboard on successful deletion; displays an alert on error.
 */
const deleteRecipe = async (e) => {
  e.preventDefault();
  try {
    let url = window.location.href.split('/');
    let recipeID = url[url.length - 1];
    const response = await fetch(`../${recipeID}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    console.log(response.ok);
    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      await alert('Error deleting recipe');
      document.location.reload();
    }
  } catch (err) {
    console.error(err);
  }
};

///////////////////////////////////////////////////////////////////
//                      Handle Tags
///////////////////////////////////////////////////////////////////
const alltags = [];

/**
 * Handles the addition of a new tag by updating the 'alltags' array and modifying the DOM to display the new tag.
 * Prevents the addition of duplicate tags.
 * @param {Event} event - The event object triggering the function (usually a button click event).
 * @returns {void}
 */
const addTag = async (event) => {
  event.preventDefault();

  const newTag = $('#Input-Tag').val();
  if (alltags.includes(newTag)) return;
  alltags.push(newTag);

  const item = $('#Tag-Container').append(
    $('<div>', {
      id: newTag,
      class: 'm-1 d-flex justify-content-center gap-1 align-items-center',
      style: 'height: 30px;',
    }).append(
      $('<div>').append(
        $('<p>', {
          class: 'mb-0 add-recipe-item',
          text: $('#Input-Tag option:selected').text(),
        })
      ),
      $('<div>').append(
        $('<button>', {
          class: 'Tag-Remove-Button',
          type: 'button',
          style: 'width: 30px; border-radius: 5px; text-align: center;',
          text: '-',
          id: newTag,
        })
      )
    )
  );
  console.log(alltags);
};

/**
 * Handles the removal of a tag by updating the 'alltags' array and removing the corresponding DOM element.
 * @param {Event} event - The event object triggering the function (usually a button click event).
 * @returns {void}
 */
const removeTag = async (event) => {
  event.preventDefault();
  const tagID = $(event.target).attr('id');
  const index = alltags.indexOf(tagID);

  if (index !== -1) {
    alltags.splice(index, 1);
  }

  $(event.target.parentNode.parentNode).remove();
};

///////////////////////////////////////////////////////////////////
//                      Handle Ingredients
///////////////////////////////////////////////////////////////////
const allIngredients = [];

/**
 * Handles the addition of a new ingredient by updating the 'allIngredients' array
 * and modifying the DOM to display the new ingredient.
 * Prevents the addition of duplicate ingredients.
 * @param {Event} event - The event object triggering the function (usually a button click event).
 * @returns {void}
 */
const addIngredient = async (event) => {
  event.preventDefault();

  const newIng = {
    ingredient_id: $('#Input-Ingredient').val(),
    quantity: $('#Input-Quantity').val() + ' ' + $('#Input-Unit').val(),
  };
  const name = $('#Input-Ingredient option:selected').text();

  if (allIngredients.includes(newIng.ingredient_id)) return;
  allIngredients.push(newIng);

  const item = $('#Ingredient-Container').append(
    $('<div>', {
      id: newIng.ingredient_id,
      class: 'm-1 d-flex justify-content-center gap-1 align-items-center',
      style: 'height: 30px;',
    }).append(
      $('<div>').append(
        $('<p>', {
          class: 'mb-0 add-recipe-item',
          text: `${newIng.quantity} - ${name}`,
        })
      ),
      $('<div>').append(
        $('<button>', {
          class: 'Ing-Remove-Button',
          type: 'button',
          style: 'width: 30px; border-radius: 5px; text-align: center;',
          text: '-',
        })
      )
    )
  );
};

/**
 * Handles the removal of an ingredient by updating the 'allIngredients' array
 * and removing the corresponding DOM element.
 * @param {Event} event - The event object triggering the function (usually a button click event).
 * @returns {void}
 */
const removeIngredient = async (event) => {
  event.preventDefault();
  const ingId = $(event.target).attr('id');
  const index = allIngredients.findIndex((ingredient) => ingredient.ingredient_id === ingId);

  if (index !== -1) {
    allIngredients.splice(index, 1);
  }

  $(event.target.parentNode.parentNode).remove();
};
