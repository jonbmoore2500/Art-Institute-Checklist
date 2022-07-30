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
    fetch(`https://api.artic.edu/api/v1/artworks/search?q=${searchInput}`)
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

// preps data for use in preview and mustSee sections
let previewArr = []
function handlePreviewPrep(input) {
    fetch(`https://api.artic.edu/api/v1/artworks?ids=${input}&fields=id,title,thumbnail,place_of_origin,date_display,artist_title,medium_display,gallery_title`)
    .then(resp => resp.json())
    .then(data => {
        previewArr = data.data
        //handleMustSeePrep(previewArr)
        // handleMustSeePrep gets gallery info, need gallery IDs from this fetch to access them
    }) 
}
// let dispArr = []
// function handleMustSeePrep(inputArr) {
//     dispArr = inputArr.filter(obj => {
//         obj.
//     })
    // pare down arr to just those with gallery IDs, 
    // fetch their info
    // replace the gallery IDs with gallery #s from request
// }

let previewObj = {}
function createPreview(event) {
    let imageId = parseInt(event.target.id)
    let previewHolder = document.getElementById('prevInfo')
    const noDispWarn = document.createElement('p')
    noDispWarn.setAttribute('id', 'warning')
    noDispWarn.textContent = 'This work isn\'t currently on display at the AIC, we hope you can come back when it is!'
    // matches option from results with prepped obj, sets previewObj
    // works, would like to clean up and do without a for loop
    for (let i=0; i<previewArr.length; i++) {
        if (previewArr[i].id === imageId) {
            previewObj = previewArr[i]
        }
    }
    // populates preview with data
    previewHolder.innerHTML = `
    <p>Title: ${previewObj.title}</p>
    <p>Artist: ${previewObj.artist}</p>
    <p>Medium: ${previewObj.medium_display}</p>
    <p>Year: ${previewObj.date_display}</p>
    <p>Place of Origin: ${previewObj.place_of_origin}</p>
    `
    // if not on display (gallery_title === null), displays that warning (only if not already included based on number of child nodes) and removes/replaces button
    if (previewObj.gallery_title === null) {
        document.querySelector('#addingBtn').style.display = 'none'
        if (parseInt(previewHolder.childElementCount) === 5) {
            previewHolder.appendChild(noDispWarn)
    }} else {
        document.querySelector('#addingBtn').style.display = 'block'
        
    }

    // need to make undefined display as "unknown"
}

// adds selected works to MustSee section
const button = document.getElementById('addingBtn')
button.addEventListener('click', () => {
    let mustSeeUl = document.querySelector('#toDoList')
    let li = document.createElement('li')
    mustSeeArr = [previewObj.title, previewObj.gallery_title]
    li.innerHTML = `
        <p class='titles'>${mustSeeArr[0]}</p>
        <p class='gallery'>Location: ${mustSeeArr[1]}</p>
        `
    // console.log(mustSeeArr)
    mustSeeUl.appendChild(li)
})