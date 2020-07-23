document.addEventListener('DOMContentLoaded', start)

const URL = 'http://localhost:3000/quotes?_embed=likes';

const newQuoteButton = document.getElementById('new-quote-form');

function start(){
    fetchQuotes();
    
    newQuoteButton.addEventListener('submit', (e) => {
        postQuote(e)
    });
}

const fetchQuotes = () => {
    fetch(URL)
    .then(resp => resp.json())
    .then(quotes => displayQuotes(quotes))
    .catch(error => console.log(error))
}

const displayQuotes = (quotes) => {
    quotes.forEach(quote => renderQuote(quote))
}

const renderQuote = (quote) => {
    const quoteList = document.querySelector('#quote-list');

    let quoteCard = document.createElement('li');
    let blockquote = document.createElement('blockquote');
    let quoteP = document.createElement('p');
    let quoteFooter = document.createElement('footer');
    let pageBreak = document.createElement('br');
    let likeButton = document.createElement('button');
    let deleteButton = document.createElement('button');
    let span = document.createElement('span');

    quoteP.innerHTML = quote.quote;
    quoteFooter.innerHTML = "Author: " + quote.author;
    span.textContent = 0;
    likeButton.textContent = 'Click to Like: ';
    deleteButton.textContent = 'Click here to Delete';
    span.dataset.id = quote.id;

    quoteCard.classList = 'quote-card';
    blockquote.classList = 'blockquote';
    quoteP.classList = 'mb-0';
    quoteFooter.classList = 'blockquote-footer';
    likeButton.classList = 'btn-success';
    deleteButton.classList = 'btn-danger';

    deleteButton.addEventListener('click', () => {
        fetchDelete(quote, quoteCard)
    })

    likeButton.appendChild(span);
    blockquote.append(quoteP, quoteFooter, pageBreak, likeButton, deleteButton);
    quoteCard.append(blockquote);
    quoteList.append(quoteCard);
}

const postQuote = (e) => {

    e.preventDefault();

    let newQuoteData = {
        "quote": document.getElementById('new-quote').value,
        "author": document.getElementById('author').value
    }
    
    fetch(URL, {
        method : 'POST',
        headers: {'content-type' : 'application/json', 'accept' : 'application/json'},
        body : JSON.stringify(newQuoteData)
      })
      .then(response => response.json())
      .then(newQuote => renderQuote(newQuote));

    document.getElementById('new-quote-form').reset();
}

// const updateQuote = (e) => {
//     console.log(e.target);
//     if(e.target.className === 'btn-success'){
//         fetch(URL + e.target.dataset.id)
//         .then(resp => resp.json())
//         .then(quote => renderQuote(quote))
//     } else if(e.target.className === 'btn-danger'){
//         fetchDelete(e.target.dataset.id);
//     }
// }

const fetchDelete = (quote, quoteCard) => {
    const options = {
        method: 'DELETE'
    }
    fetch('http://localhost:3000/quotes/' + quote.id, options)
    .then(response => response.json())
    .then(quoteCard.remove())

    //fetchQuotes();
}
