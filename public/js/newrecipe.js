$(function () {
  const addNewRecipe = async (event) => {
    event.preventDefault();

    let name = $('#name').val();
    let description = $('#description').val();
    let time_total = $('time-total').val();

    console.log(name);
    console.log(description);

    if (name && description) {
      const response = await fetch(`../api/recipes`, {
        method: 'POST',
        body: JSON.stringify({ name, description, time_total }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        await alert('Error adding recipe');
        // document.location.reload();
      }
    }
  };

  $('#recipe-submit').on('click', addNewRecipe);
  $('#Tag-Button').on('click', addTag);
  $('#Tag-Container').on('click', '.Tag-Remove-Button', removeTag);
  $('#Ingredient-Button').on('click', addIngredient);
  $('#Ingredient-Container').on('click', '.Ing-Remove-Button', removeIngredient);
});
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
          class: 'mb-0',
          style: 'width: 16rem; background-color:#ffffff; border-radius: 50px; text-align: center;',
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
          class: 'mb-0',
          style: 'width: 16rem; background-color:#ffffff; border-radius: 50px; text-align: center;',
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
