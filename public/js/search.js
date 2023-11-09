// async function findTagRecipes() {
//     const tagString = 'He';//get element name

//     if (tagString) {
//         const response = await fetch(`/api/tags/search/${tagString}`, {
//         });

//         console.log(response);
//     }
// }

const findTagRecipes = async (event) => {
    // event.preventDefault();

    const tagString = event.target.value;
    // console.log(tagString);

    if (tagString) {
        const response = await fetch(`/api/tags/search/${tagString}`);

        const data = await response.json();

        document.querySelector('#test-text').innerHTML = data[0].name;
        console.trace(data[0].name);
    }
}


document.querySelector('#search-input').addEventListener('keyup', findTagRecipes);
// findTagRecipes();