$(function () {
  ///////////////////////////////////////////////////////////////////
  //                      Event Listenters
  ///////////////////////////////////////////////////////////////////

  $('#search-input').on('input', UpdateSearch);
  $('#search-input').on('keyup', searchByTerm);
});

let search = ''; //Default variable for search

/**
 * Finds recipes associated with a specific tag by sending a GET request to the server.
 * Updates the dropdown list with the search results.
 * @param {string} search - The tag to search for.
 * @returns {Promise<void>} - Updates the dropdown list based on the search results.
 */
const findTagRecipes = async (search) => {
  if (search) {
    const response = await fetch(`/api/tags/search/${search}`);

    // console.trace(response);
    const data = await response.json();
    // console.trace(data);

    UpdateDropdown(data, 10);
  } else {
    UpdateDropdown(null, 0);
  }
};

/**
 * Handles the search functionality by triggering a search when the Enter key is pressed in the search input field.
 * Redirects to the search results page with the entered search term.
 * @param {Event} event - The event object triggering the function (usually a key press event).
 * @returns {void}
 */
const searchByTerm = async (event) => {
  event.preventDefault();

  if (event.key === 'Enter') {
    console.log('entery enterer');
    var searchTerm = $('#search-input').val();
    console.log(searchTerm);

    document.location.replace(`/search/${searchTerm}`);
  }
};

/**
 * Updates the search results based on the user's input after a short delay.
 * @param {Event} e - The event object triggering the function (usually an input event).
 * @returns {void}
 */
const UpdateSearch = (e) => {
  var thisSearch = $(this).val();
  search = thisSearch;

  //Delay the search action by 50 milliseconds to allow user input to stabalize.
  setTimeout(function () {
    if (search == thisSearch) {
      //Update the search results.
      findTagRecipes(search);
    }
  }, 200);
};

/**
 * Updates the dropdown list with the specified search results.
 * @param {Array} Results - The array of search results to display in the dropdown.
 * @param {number} ResultsToDisplay - The maximum number of results to display in the dropdown.
 * @returns {void}
 */
const UpdateDropdown = (Results, ResultsToDisplay) => {
  // Clear all existing dropdown items.
  $('#Drop-Down').empty();

  for (let i = 0; i < ResultsToDisplay; i++) {
    if (i >= Results.length) {
      return; // Return if Results exceed out Results to Display
    }

    // Create a dropdown item with movie information.
    let dropdownItem = $('<a></a>', {
      class: 'dropdown',
      href: `/recipes/${Results[i].id}`,
    }).append(
      $('<p>', {
        html: Results[i].name,
      })
    );

    // Append the dropdown item to the dropdown list
    $('#Drop-Down').append(dropdownItem);
  }
};
