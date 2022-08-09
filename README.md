# AIC Must-See

The AIC Must-See app lets users search for, preview, and then add to a checklist artworks they would like to see at the world-renowned Art Institute of Chicago (AIC).
Visit the AIC's website here: [https://www.artic.edu/]

After the user enters a search term, the app lists up to 40 relevant artworks that the AIC has access to. Mousing over any of those results displays additional information about the work in the middle preview section, along with either a button to add the work to the must-see list or a notification that the work is not currently on display. If the user sees a work they are interested in, they can click the button in the preview section to add that work to the must-see list, along with the gallery location of that work to make finding it in the museum a breeze. Don't worry about accidentally adding duplicates to the must-see list, the app automatically prevents that. 


## Code examples

In order to avoid displaying undefined results in the preview section due to delays in the second fetch request not returning quickly enough, the mouseover event listener is only added to the results cards once all the fetch requests have completed. This allows the preview section to be unhidden and prevents displaying undefined results.

```
searchResults.forEach(entry => {
        previewArr.push(entry.id)
        let li = document.createElement('li')
        li.setAttribute('id', entry.id)
        li.className = 'resultsElements'
        li.innerHTML = `
        <p class='titles' id='${entry.id}'>${entry.title}</p>
        `
        Promise.all([searchFetch, previewFetch])
        .then(
        li.addEventListener('mouseover', (e) => {
            document.querySelector('#prevInfo').removeAttribute('hidden');
            createPreview(e)
        })
        )
        resultsUl.appendChild(li)
    })
```


The app uses an array for duplication prevention. 
Upon clicking the button to add a work to the must-see list the function checks the array to see if the work is already included. If not, it creates the card in the must-see list and adds the work to the array. If it is already included, it returns and ends the function before creating a card or adding the work to the array. See line 88 in index.js for the code in context. 

```
let dedupeArr = []
if (dedupeArr.find(element => element === previewObj.title) !== undefined) {
    return;
}
dedupeArr.push(previewObj.title)
```


## Roadmap
Potential future features: 
 - Display sample images of the works in the preview section. The API contains the necessary data, should be achievable with the addition of a backend to store the images.
 - Have a switch to toggle on/off only searching for works in the public domain.
 - Have a switch to toggle on/off displaying search results that are not on display in addition to those that are. 
 - Sort the works in the results section alphabetically.
 - Sort the works in the must-see section either alphabetically or by Gallery #.


## Acknowledgements
Thank you to the AIC for allowing free access to your incredibly thorough API. [https://api.artic.edu/docs/]
And thanks for being a great art museum, I'm glad I have a membership. Shameless plug - get your own membership here! [https://sales.artic.edu/memberships]

Also thank you to [https://arthive.com/] for hosting the image of La Grande Jatte used for the background photo in the search section (and to Georges Seurat for painting it in the first place). 