const baseURL = 'http://localhost:3000/'
const quotesURL = baseURL + 'quotes/'
const likesURL = baseURL + 'likes/'
const quotesAndLikesURL = baseURL + 'quotes?_embed=likes'

document.addEventListener('DOMContentLoaded', () => {
  getQuotes()
  createNewQuote()
  createEditForm()
  handleQuoteButtons()
  handleEditEvent()
  sortButton()
})

// renders the quotes to the DOM
const getQuotes = () => {
  fetch(quotesAndLikesURL)
    .then(resp => resp.json())
    .then(quotes => renderAllQuotes(quotes))
}

const renderAllQuotes = quotes => {
  quotes.forEach(quote => renderQuote(quote))
}

const renderQuote = quote => {
  const ul = document.getElementById('quote-list')

  const li = document.createElement('li')
  li.classList += 'quote-card'
  li.dataset.quoteId = quote.id
  ul.appendChild(li)

  const blockquote = document.createElement('blockquote')
  blockquote.classList += 'blockquote'
  li.appendChild(blockquote)
  blockquote.innerHTML = `
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
    <button class='btn-danger'>Delete</button>
    <button class='btn-warning'>Edit</button>
  `
}

// handles the submit form and updates the DOM
const createNewQuote = () => {
  const form = document.getElementById('new-quote-form')

  form.addEventListener('submit', e => {
    e.preventDefault()

    // get data form input
    const quote = e.target.quote.value
    const author = e.target.author.value
    // make post request

    const postRequest = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accepts: 'application/json'
      },
      body: JSON.stringify({
        quote: quote,
        author: author
      })
    }
    fetch(quotesURL, postRequest)
      .then(resp => resp.json())
      .then(quote => {
        // update the DOM
        updateQuotesList(quote)
        form.reset()
      })
      .catch(err => console.log(err))
  })
}

const updateQuotesList = quote => {
  fetch(quotesAndLikesURL)
    .then(resp => resp.json())
    .then(data => {
      const quote = data[data.length - 1]
      renderQuote(quote)
    })
}

// handles the like and delete buttons and updates the DOM
const handleQuoteButtons = () => {
  document.addEventListener('click', e => {
    if (e.target.matches('.btn-danger')) {
      deleteQuote(e)
    }
    if (e.target.matches('.btn-success')) {
      likeQuote(e)
    }
    if (e.target.matches('.btn-warning')) {
      editQuote(e)
    }
  })
}

const likeQuote = e => {
  const li = e.target.closest('li.quote-card')
  const quoteId = li.dataset.quoteId

  const postRequest = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accepts: 'application/json'
    },
    body: JSON.stringify({
      quoteId: parseInt(quoteId),
      createdAt: Date.now()
    })
  }

  fetch(likesURL, postRequest)
    .then(resp => resp.json())
    .then(like => {
      updateLikesInDOM(li, like.quoteId)
    })
}

const updateLikesInDOM = (li, quoteId) => {
  const likeBtn = li.querySelector('button.btn-success')
  const likeNumber = likeBtn.lastChild

  fetch(`http://localhost:3000/likes?quoteId=${quoteId}`)
    .then(resp => resp.json())
    .then(likes => {
      likeNumber.textContent = likes.length
    })
}

const deleteQuote = e => {
  const li = e.target.closest('li.quote-card')
  const quoteId = li.dataset.quoteId

  fetch(quotesURL + quoteId, { method: 'DELETE' })
    .then(resp => resp.json())
    .then(li.remove())
}

const editQuote = e => {
  const editForm = document.getElementById('edit-quote-form')
  editForm.style.display = 'block'

  // get the quote and author from the DOM
  const quoteCard = e.target.closest('.quote-card')
  const quote = quoteCard.querySelector('p').textContent
  const author = quoteCard.querySelector('footer').textContent
  const quoteId = quoteCard.dataset.quoteId

  // grab the edit form and populate input fields
  editForm.quote.value = quote
  editForm.author.value = author
  editForm.dataset.quoteId = quoteId
}

const handleEditEvent = () => {
  // find another way of finding edit form and quoteId
  const editForm = document.getElementById('edit-quote-form')
  // quoteId
  editForm.addEventListener('submit', e => {
    e.preventDefault()

    const quoteId = editForm.dataset.quoteId
    // make a patch request
    const patchRequest = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accepts: 'application/json'
      },
      body: JSON.stringify({
        author: editForm.author.value,
        quote: editForm.quote.value
      })
    }

    fetch(quotesURL + quoteId, patchRequest)
      .then(resp => resp.json())
      .then(editedQuote => {
        // update the DOM
        updateQuoteInDOM(editedQuote)
      })

    // clear form & hide form
    editForm.reset()
    editForm.style.display = 'none'
  })
}

const updateQuoteInDOM = quote => {
  const quoteList = document.getElementById('quote-list')

  // find the correct li using quote.id
  const quoteLi = quoteList.querySelector(`li[data-quote-id="${quote.id}"`)

  // replace its content
  quoteLi.querySelector('p').textContent = quote.quote
  quoteLi.querySelector('footer').textContent = quote.author
}

const createEditForm = () => {
  // create an edit form
  const editForm = document.createElement('form')
  editForm.id = 'edit-quote-form'
  editForm.style.display = 'none'

  const quoteLabel = document.createAttribute('label')
  quoteLabel.textContent = 'Edit Quote'

  const htmlForm = `
    <label>Edit Quote</label>
    <input name="quote" class="form-control" placeholder="A smart quote"><br>
    <label>Edit Author</label>
    <input name="author" class="form-control" placeholder="Someone smart said this"><br>
    <button type="submit" class="btn btn-primary">Edit</button>
    <br>
    <hr>
    <br>
  `
  editForm.innerHTML = htmlForm

  // add form before postForm
  const postForm = document.getElementById('new-quote-form')
  postForm.parentElement.insertBefore(editForm, postForm)
}

const sortButton = () => {
  // get container append before the list
  const bodyContainer = document.querySelector('body.container').children[1]
  const ul = document.getElementById('quote-list')

  // make button with styles (active and inactive states)
  const sortButton = document.createElement('button')
  sortButton.textContent = 'Sort by Author name'
  sortButton.classList += 'btn btn-primary enabled'

  bodyContainer.insertBefore(sortButton, ul)

  // add functionality to sort alphabetically when active and by id when not active
  sortButton.addEventListener('click', e => {
    if (e.target.matches('button.enabled')) {
      e.target.classList.remove('enabled')
      e.target.classList.add('disabled')

      getSortedList()
      // make fetch and sort update the DOM
    } else if (e.target.matches('button.disabled')) {
      e.target.classList.remove('disabled')
      e.target.classList.add('enabled')

      document.getElementById('quote-list').innerHTML = ''
      getQuotes()
    }
  })
}

const getSortedList = () => {
  // get ul
  const ul = document.getElementById('quote-list')

  fetch(quotesAndLikesURL)
    .then(resp => resp.json())
    .then(data => {
      const sortedArray = data.sort((a, b) => (a.author > b.author ? 1 : -1))

      // empty list first
      document.getElementById('quote-list').innerHTML = ''
      renderAllQuotes(sortedArray)
    })
}
