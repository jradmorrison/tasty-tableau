$(function () {
  $('[data-toggle="popover"]').popover();
  $('.add-to-favorites-btn').addClass('loaded');

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
    console.trace('Click');
  };

  $('.add-to-favorites-btn').on('click', updateFavorites);
  $('.remove-from-favorites-btn').on('click', updateFavorites);
  $('#login-to-save').on('click', goToLogin);
});
