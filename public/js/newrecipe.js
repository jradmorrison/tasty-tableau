$(function() {

    const addNewRecipe = async (event) => {
        event.preventDefault();

        let name = $('#name').val();
        let description = $('#description').val();
        let time_total = $('time-total').val();

        if (name && description) {
            const response = await fetch(`../api/recipes`, {
                method: 'POST',
                body: JSON.stringify({ name, description, time_total }),
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            console.log(data);

            if (response.ok) {
                document.location.replace('/dashboard');
            } else {
                await alert('Error adding recipe');
                document.location.reload();
            }
        }
    }

    $('#recipe-submit').on('click', addNewRecipe);
});