$(function () {
  $('[data-toggle="popover"]').popover();
  $('.add-to-favorites-btn').addClass('loaded');
  $('#review-form').toggle();


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

  const goToLogin = () => {
    document.location.replace('/login');
  };

  const showReview = async (event) => {
    event.preventDefault();
    console.log('clickl ckcl');

    $('#show-review-form').toggle();
    $('#review-form').toggle();
  }

  const addReview = async (event) => {
    event.preventDefault();
    // console.log('clickl ckcl');

    const rating = $('#rating').val();
    const review = $('#review').val();
    const id = $('#review-form').attr("data-id");

    if (rating && review) {
      const response = await fetch(`../api/reviews/${id}`, {
        method: 'POST',
        body: JSON.stringify({ rating, review }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        document.location.reload();
      } else {
        await alert('Error adding recipe');
      }
    }
  }

  $('.add-to-favorites-btn').on('click', updateFavorites);
  $('.remove-from-favorites-btn').on('click', updateFavorites);
  $('#login-to-save').on('click', goToLogin);

  $('#show-review-form').on('click', showReview);
  $('#review-submit-button').on('click', addReview);

});
