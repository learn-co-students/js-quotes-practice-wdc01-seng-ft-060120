let BASEURL = 'http://localhost:3000/'
let QUOTEURL = BASEURL + 'quotes'
let QUOTEFETCHURL = QUOTEURL + '?_embed=likes'
let LIKESURL = BASEURL + 'likes'

document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault()
    let form = document.getElementById('new-quote-form')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        renderNewQuote(form)
    })

    fetchQuotes()
})

let fetchQuotes = () => {
    fetch(QUOTEFETCHURL)
    .then(response => response.json())
    .then(allQuotes => renderQuotes(allQuotes))
}

let renderQuotes = (allQuotes) => {
    allQuotes.forEach(quote => renderQuote(quote))
}

let renderQuote = (quote) => {
    const quoteList = document.getElementById('quote-list')
    let quoteLi = document.createElement('li')
    quoteList.appendChild(quoteLi)

    quoteLi.classList += 'quote-card'
    quoteLi.id = quote.id

    let blockQuote = document.createElement('blockquote')
    blockQuote.classList += 'blockquote'
    quoteLi.appendChild(blockQuote)

    let blockP = document.createElement('p')
    blockP.classList += 'mb-0'
    blockP.innerText = quote.quote
    blockQuote.appendChild(blockP)

    let blockFooter = document.createElement('footer')
    blockFooter.classList += 'blockquote-footer'
    blockFooter.innerText = quote.author
    blockQuote.appendChild(blockFooter)

    let likeButton = document.createElement('button')
    likeButton.classList += 'btn-success'
    
    if (quote.likes) {
        likeButton.innerHTML = `Likes: <span>${quote.likes.length}</span>`
    } else {
        likeButton.innerHTML = `Likes: <span> 0 </span>`
    }
    blockQuote.appendChild(likeButton)

    let deleteButton = document.createElement('button')
    deleteButton.classList += 'btn-danger'
    deleteButton.innerText = 'Delete'
    blockQuote.appendChild(deleteButton)
}

let renderNewQuote = (form) => {
    let quoteInput = form.querySelector('input[name="quote"]')
    let quoteAuthor = form.querySelector('input[name="author"]')
    let newQuote = {
        "quote": `${quoteInput.value}`,
        "author": `${quoteAuthor.value}`
    }

    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            accepts: 'application/json'
        },
        body: JSON.stringify(newQuote)
    }
    
    fetch(QUOTEURL, options)
    .then(response => response.json())
    .then(newQuote => renderQuote(newQuote))
}