async function findTagRecipes() {
    const tagString = 'He';//get element name

    if (tagString) {
        const response = await fetch(`/api/tags/search/${tagString}`, {
        });

        console.log(response);
    }
}

// const findTagRecipes = async (event) => {
//     event.preventDefault();

//     const tagString = 'Healthy';//get element name

//     if (tagString) {
//         const response = await fetch(`/api/tags/search/${tagString}`, {
//         });

//         console.log(response);
//     }
// }


// document.querySelector('#search-input').addEventListener('onKeyDown', findTagRecipes);
findTagRecipes();