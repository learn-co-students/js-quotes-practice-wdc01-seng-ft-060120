document.addEventListener("DOMContentLoaded", () => {
    const baseURL = "http://localhost:3000/quotes/";
    const newQuoteForm = document.getElementById("new-quote-form");

    newQuoteForm.addEventListener("submit", (e) => {
        e.preventDefault();
        createQuote(e.target)
    })

    const createQuote = (quoteFormData) => {
        const quoteList = document.getElementById("quote-list")
        const quote = {
            "quote": `${quoteFormData.quote.value}`,
            "author": `${quoteFormData.author.value}`,
            "likes": []

        }
        const quoteConfig = {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(quote)
        }
        fetch(baseURL, quoteConfig)
        .then(resp => resp.json())
        .then(quote =>{
            renderQuote(quote, quoteList)
        })
    }

    const getQuotes = () => {
        fetch(`${baseURL}?_embed=likes`)
        .then(resp => resp.json())
        .then(quotes => {
            renderQuotes(quotes);
        })
    }

    const renderQuotes = (quotes) => {
        const quoteList = document.getElementById("quote-list")
        quotes.forEach(quote => {
            renderQuote(quote, quoteList)
        });
    }

    const renderQuote = (quote, quoteList) => {
        const li = document.createElement("li");
        li.innerHTML= `
            <blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
            </blockquote>
        `;
        const likeButton = document.createElement("button");
        likeButton.className = 'btn-success';
        likeButton.innerHTML = `Likes: <span>${quote.likes.length}</span>`;
        li.children[0].appendChild(likeButton);
        likeButton.addEventListener("click", (e) => {
            increaseLikes(quote, e.target)
        })
        const deleteButton = document.createElement("button");
        deleteButton.className = 'btn-danger';
        deleteButton.innerText = "Delete";
        li.children[0].appendChild(deleteButton);
        deleteButton.addEventListener("click", (e) => {
            deleteQuote(quote, li);
        })
        quoteList.appendChild(li);
    }

    const increaseLikes = (quote, button) => {
        const likeObj = {
            "quoteId": quote.id,
            "createdAt": Math.floor(Date.now()/1000)
        }

        const likeConfig = {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json" 
            },
            
            body: JSON.stringify(likeObj)
        }
        fetch('http://localhost:3000/likes', likeConfig)
        .then(resp => resp.json())
        .then(data => {
            let span = button.querySelector("span")
            console.log(data)
            span.innerText = (parseInt(span.innerText, 10) + 1)
        })
    }

    const deleteQuote = (quote, li) => {
        let configObj = {
            method: "DELETE",

            headers:{
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }
        fetch(`${baseURL}${quote.id}`, configObj)
        .then(resp => resp.json)
        .then(data => {
            console.dir(data)
            li.remove()
        })
    }

    getQuotes()

})



/*
* Submitting the form creates a new quote and adds it to the list of quotes
without having to refresh the page. Pessimistic rendering is reccommended.

***************DONE******************
Clicking the delete button should delete the respective quote from the
API and remove it from the page without having to refresh.
    - create the event listener when you add the button
    - pass the quote, and the li 
    - fetch request method delete to the baseURL + quote.id
    - if successful, li.remove

  */