$(function() {

    const addNewRecipe = async (event) => {
        event.preventDefault();

        // console.log('clicky clik');
        // console.log(event.target.dataset.id);
        // console.log($('#name').val());

        let name = $('#name').val();
        let description = $('#description').val();

        console.log(name);
        console.log(description);

        if (name && description) {
            const response = await fetch(`../api/recipes`, {
                method: 'POST',
                body: JSON.stringify({ name, description }),
                headers: { 'Content-Type': 'application/json' },
            });

            // const data = await response.json();

            // console.log(data);
        }
    }

    $('#recipe-submit').on('click', addNewRecipe);
});