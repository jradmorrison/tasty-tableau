$(function() {
    const findTagRecipes = async (event) => {
        // event.preventDefault();
    
        const tagString = event.target.value;
    

    
        if (tagString) {
            const response = await fetch(`/api/tags/search/${tagString}`);
    
            const data = await response.json();
    
            document.querySelector('#test-text').innerHTML = data[0].name;
            document.querySelector('#test-img').src = data[0].image;

        }
        else {
            document.querySelector('#test-text').innerHTML = '';
            document.querySelector('#test-img').src = '';
        }
    }
    
    
    document.querySelector('#search-input').addEventListener('keyup', findTagRecipes);
});

