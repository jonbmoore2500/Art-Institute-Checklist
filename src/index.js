// index.js

const searchForm = document.getElementById('artKeywordSearch')
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSearchGet(e);
    searchForm.reset()
})
function handleSearchGet(e) {
    let searchInput = e.target.querySelector('#artSearch').value
    
    fetch(`https://api.artic.edu/api/v1/artworks/search?q=${searchInput}&query[term][is_public_domain]=true`)
    .then(resp => resp.json())
    .then(data => {
        handleSearchCards(data.data)
    })
}
function handleSearchCards(searchResults) {
    let resultsUl = document.getElementById('results')
    resultsUl.innerHTML = ''
    let previewArr = []
    searchResults.forEach(entry => {
        //console.log(entry)
        previewArr.push(entry.id)
        let li = document.createElement('li')
        // li.setAttribute('id', entry.id)
        li.className = 'resultsElements'
        li.innerHTML = `
        <p class='titles' id='${entry.id}'>${entry.title}</p>
        `
        li.addEventListener('mouseover', (e) => {
            createPreview(e)
        })
        resultsUl.appendChild(li)
    })
    handlePreviewPrep(previewArr.join(','))
}
let previewArr = []
function handlePreviewPrep(input) {
    fetch(`https://api.artic.edu/api/v1/artworks?ids=${input}&fields=id,title,thumbnail,place_of_origin,date_display,artist_title,medium_display`)
    .then(resp => resp.json())
    .then(data => {
        previewArr = data.data
    })   
}
function createPreview(event) {
    let imageId = parseInt(event.target.id)
    let previewObj = {}
    // works, clean up and do without a for loop
    for (let i=0; i<previewArr.length; i++) {
        if (previewArr[i].id === imageId) {
            previewObj = previewArr[i]
        }
    }
    // previewObj = previewArr.find(element => {
    //     element['id'] === imageId
    // })

    console.log(previewObj)
    // use previewObj to populate data in preview section. title, artist, year, country of origin, etc
    // create button to add that work to "must-see" section on the right
}