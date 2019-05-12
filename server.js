'use strict';

// PROVIDE ACCESS TO ENVIRONMENTAL VARIABLES IN .env
require('dotenv').config();

// App dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');

// App Setup
const app = express();
const PORT = process.env.PORT

// Database setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// Application Middleware
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

// API Routes
// Renders the search form
app.get('/', getBooks); 

// Creates a new search to the Google Books API
app.post('/searches', createSearch);

// Catch-all
app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// HELPER FUNCTIONs

function getBooks(request, response) {
  let SQL = 'SELECT * FROM books;';

  return client.query(SQL)
  .then(results => {
    console.log(results.rows);
    response.render('pages/index', { results: results.row})
  })
  // .catch(handleError(error, response));
}

// Note that .ejs file extension is not required
function newSearch(request, response) {
  response.render('pages/index');
}

// No API key required
// Console.log request.body and request.body.search
function createSearch(request, response) {
  console.log(request.body)

  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if (request.body.search[1] === 'title') { url += `+intitle:${request.body.search[0]}`; }
  if (request.body.search[1] === 'author') { url += `+inauthor:${request.body.search[0]}`; }

  console.log(url);
  // response.send( 'OK');

  superagent.get(url)
    // .then(apiResponse => console.log(apiResponse.body.items))
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(results => response.render('pages/searches/new', { searchResults: results }))
    .catch(err => handleError(err, response));

  // Error handling ?

  function handleError(error, response) {
    response.render('pages/error', {error: error});
  };

}

// constructor

function Book(info) {
  this.image_url = info.imageLinks.thumbnail || 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = info.title || 'No title available';
  this.author = info.authors || 'No author available';
  this.description = info.description || 'no description available';
  // const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
}

