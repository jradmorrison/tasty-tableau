$(function () {
  const addNewRecipe = async (event) => {
    event.preventDefault();
    submitRecipe('POST');
  };

  const updateRecipe = async (event) => {
    event.preventDefault();
    submitRecipe('PUT');
  };

  $('#recipe-submit').on('click', addNewRecipe);
  $('#recipe-update-submit').on('click', updateRecipe);
  $('#Tag-Button').on('click', addTag);
  $('#Tag-Container').on('click', '.Tag-Remove-Button', removeTag);
  $('#Ingredient-Button').on('click', addIngredient);
  $('#Ingredient-Container').on('click', '.Ing-Remove-Button', removeIngredient);

  Initilize();
});

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

  console.log(allIngredients);
};

const submitRecipe = async (type) => {
  let name = $('#name').val();
  let category_id = $('#Input-Category').val();
  let description = $('#description').val();
  let time_total = `PT${$('time-prep-hours').val()}H${$('time-prep-minute').val()}M`;
  let instructions = $('#instructions').val();

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
//TAGS SECTION
//Variable user for submitting tags at the end
const alltags = [];

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

const removeTag = async (event) => {
  event.preventDefault();
  const tagID = $(event.target).attr('id');
  const index = alltags.indexOf(tagID);

  if (index !== -1) {
    alltags.splice(index, 1);
  }

  $(event.target.parentNode.parentNode).remove();
};

//INGREDIENT SECTION
const allIngredients = [];
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

const removeIngredient = async (event) => {
  event.preventDefault();
  const ingId = $(event.target).attr('id');
  const index = allIngredients.findIndex((ingredient) => ingredient.ingredient_id === ingId);

  if (index !== -1) {
    allIngredients.splice(index, 1);
  }

  $(event.target.parentNode.parentNode).remove();
};

// <div class="m-1 d-flex justify-content-center gap-1 align-items-center" style="height: 30px;">
//   <div>
//     <p class="mb-0" style="width: 16rem; background-color:#ffffff; border-radius: 50px; text-align: center;">
//       1.5 lb - Chicken
//     </p>
//   </div>
//   <div>
//     <button type="button" style="width: 30px; border-radius: 5px; text-align: center;">
//       -
//     </button>
//   </div>
// </div>;
