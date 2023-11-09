$(function() {

    $('[data-toggle="popover"]').popover();

    const addToFavorites = async (event) => {
        event.preventDefault();

        const id = event.target.dataset.id;
        // console.log(event.target.dataset.id);

        if (id) {
            const response = await fetch(`../api/favorites/user/${id}`, {
                method: 'POST',
                body: '',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            // console.log(data);
        }
    }

    $('.add-to-favorites-btn').on('click', addToFavorites);
})