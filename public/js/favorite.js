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

  $('.add-to-favorites-btn').on('click', updateFavorites);
  $('.remove-from-favorites-btn').on('click', updateFavorites);
});
