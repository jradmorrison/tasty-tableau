$(function () {
  ///////////////////////////////////////////////////////////////////
  //                      Running Logic
  ///////////////////////////////////////////////////////////////////
  let newLocation = $(location).attr('href');
  if (newLocation.startsWith('https://cryptic-tundra-53497-2c1c36d10121.herokuapp.com/recipes')) {
  // if (newLocation.startsWith('http://localhost:3001/recipes')) {
    localStorage.removeItem('location');
    console.log('correct!');
    let locInStorage = JSON.stringify(newLocation);
    localStorage.setItem('location', locInStorage);
    console.log(locInStorage);
  }


  $('[data-toggle="popover"]').popover();
  $('.add-to-favorites-btn').addClass('loaded');
  $('#review-form').toggle();

  let reviews = $('.review-block');

  for (let i = 0; i < reviews.length; i++) {
    console.log(`rating is: ${reviews[i].dataset.rating}`);

    for (let j = 5; j >= 1; j--) {
      if (j <= reviews[i].dataset.rating) {
        $(reviews[i]).prepend($('<span class = "my-auto fa fa-star checked">'));
      } else {
        $(reviews[i]).prepend($('<span class = "my-auto fa fa-star">'));
      }
    }
  }

  ///////////////////////////////////////////////////////////////////
  //                      Event Listenters
  ///////////////////////////////////////////////////////////////////
  $('.add-to-favorites-btn').on('click', updateFavorites);
  $('.remove-from-favorites-btn').on('click', updateFavorites);
  $('#login-to-save').on('click', goToLogin);
  $('#login-to-review').on('click', goToLogin);
  $('#show-review-form').on('click', showReview);
  $('#review-submit-button').on('click', addReview);
});

/**
 * Updates the user's favorites by sending a POST or DELETE request to the server based on the button's data-action attribute.
 * If the action is POST, an email notification is sent to the recipe author's email obtained from the server response.
 * The button is then hidden, and a tooltip is displayed for a brief period before reloading the page.
 * @param {Event} event - The event object triggering the function (usually a button click event).
 * @returns {Promise<void>} - Reloads the page after updating favorites.
 */
const updateFavorites = async (event) => {
  const id = event.target.dataset.id;

  if (id) {
    const response = await fetch(`../api/favorites/user/${id}`, {
      method: event.target.dataset.action,
      body: '',
      headers: { 'Content-Type': 'application/json' },
    });

    if ((event.target.dataset.action = 'POST')) {
      // Send Email to recipe.id.author .getuser email
    }
    // Hide the button
    $(event.target).hide();

    // Show the tooltip only if the button is visible
    if ($(event.target).is(':visible')) {
      $(event.target).tooltip('show');
    }
    setTimeout(() => {
      document.location.reload();
    }, 1000);

    const data = await response.json();
  }
};

/**
 * Redirects the user to the login page.
 * @returns {void}
 */
const goToLogin = () => {
  document.location.replace('/login');
};

/**
 * Displays the review form by hiding the "show review" form and showing the main review form.
 * @param {Event} event - The event object triggering the function (usually a button click or form submission event).
 * @returns {void}
 */
const showReview = async (event) => {
  event.preventDefault();

  $('#show-review-form').hide();
  $('#review-form').show();
};

/**
 * Adds a review by sending a POST request to the server with the provided rating and review content.
 * @param {Event} event - The event object triggering the function (usually a form submission event).
 * @returns {Promise<void>} - Reloads the page upon successful review submission; displays an alert on error.
 */
const addReview = async (event) => {
  event.preventDefault();

  const rating = $('#rating').val();
  const review = $('#review').val();
  const id = $('#review-form').attr('data-id');

  if (rating && review) {
    const response = await fetch(`/api/reviews/${id}`, {
      method: 'POST',
      body: JSON.stringify({ rating, review }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.reload();
    } else {
      await alert('Error adding review');
    }
  }
};
