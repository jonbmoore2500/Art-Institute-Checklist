// index.js

// create keyword search function
const searchForm = document.getElementById('artKeywordSearch')
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSearchGet(e);
    searchForm.reset()
})
function handleSearchGet(e) {
    let searchInput = e.target.querySelector('#artSearch').value
    fetch(`https://api.artic.edu/api/v1/artworks/search?q=${searchInput}&limit=40`)
    // remove limit if can't figure out how to make scrolling work correctly
    .then(resp => resp.json())
    .then(data => {
        handleSearchCards(data.data)
    })
}

// create and populate search cards on the left
function handleSearchCards(searchResults) {
    let resultsUl = document.getElementById('results')
    resultsUl.innerHTML = ''
    let previewArr = []
    searchResults.forEach(entry => {
        previewArr.push(entry.id)
        let li = document.createElement('li')
        li.setAttribute('id', entry.id)
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

// preps data for use in preview and mustSee sections
let previewArr = []
function handlePreviewPrep(input) {
    fetch(`https://api.artic.edu/api/v1/artworks?ids=${input}&fields=id,title,thumbnail,place_of_origin,date_display,artist_title,medium_display,gallery_title`)
    .then(resp => resp.json())
    .then(data => {
        previewArr = data.data
    }) 
}

// populates preview section with data from the card being moused over. either shows button or warns based on gallery status
let previewObj = {}
function createPreview(event) {
    let imageId = parseInt(event.target.id)
    let previewHolder = document.getElementById('prevInfo')
    const noDispWarn = document.createElement('p')
    noDispWarn.setAttribute('id', 'warning')
    noDispWarn.textContent = 'This work isn\'t currently on display at the AIC, we hope you can come back when it is!'
    // matches option from results with selected card from results, sets previewObj
    // works, would like to clean up and do without a for loop
    for (let i=0; i<previewArr.length; i++) {
        if (previewArr[i].id === imageId) {
            previewObj = previewArr[i]
            // changes null to anonymous for cleaner display
            if (previewObj.artist_title === null) {
                previewObj.artist_title = 'Anonymous'
            }
        }
    }
    // populates preview with data from previewObj assigned in handlePreviewPrep
    previewHolder.innerHTML = `
    <p>Title: <b>${previewObj.title}</b></p>
    <p>Artist: <b>${previewObj.artist_title}</b></p>
    <p>Medium: <b>${previewObj.medium_display}</b></p>
    <p>Year: <b>${previewObj.date_display}</b></p>
    <p>Place of Origin: <b>${previewObj.place_of_origin}</b></p>
    `
    // if not on display (gallery_title === null), displays that warning (only if not already included based on number of child nodes) and removes/replaces button
    if (previewObj.gallery_title === null) {
        document.querySelector('#addingBtn').style.display = 'none'
        if (parseInt(previewHolder.childElementCount) === 5) {
            previewHolder.appendChild(noDispWarn)
    }} else {
        document.querySelector('#addingBtn').style.display = 'block'
    }
}

// adds selected works to MustSee section
let dedupeArr = []
const button = document.getElementById('addingBtn')
button.addEventListener('click', () => {
    let mustSeeUl = document.querySelector('#toDoList')
    let li = document.createElement('li')
    mustSeeArr = [previewObj.title, previewObj.gallery_title]
    // prevents duplicates from being added to final section
    if (dedupeArr.find(element => element === previewObj.title) !== undefined) {
        return;
    }
    dedupeArr.push(previewObj.title)
    li.innerHTML = `
        <p class='titles'><b>${mustSeeArr[0]}</b></p>
        <p class='gallery'>Location: <b class='bold'>${mustSeeArr[1]}</b></p>
        `
    mustSeeUl.appendChild(li)
})