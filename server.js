'use strict';

// PROVIDE ACCESS TO ENVIRONMENTAL VARIABLES IN .env
require('dotenv').config();

// App dependencies
const express = require('express');
const superagent = require('superagent');
const methodOverride = require('method-override')
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
app.use(methodOverride('_method'));

// Method override to change POST to PUT for updates

app.use(methodOverride((request, response) => {
  console.log(request.body._method);
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    console.log('Helloooooooooo');
    // look in urlencoded POST body and delete it
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}))

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

// API Routes

app.get('/', getBooks);
app.post('/searches', createSearch);
app.get('/searches/new', newSearch);
app.post('/books', createBook);
app.get('/books/:id', getBook);
app.put('/books/:id', updateBook);
// app.delete('/books/:id', deleteBook);


// Catch-all
app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// HELPER FUNCTIONs

// constructor

function Book(info) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  let httpRegex = /^(http:\/\/)/g;

  // this.image_url = info.imageLinks.thumbnail.replace(httpRegex, 'https://') || placeholderImage;
  this.image_url = info.imageLinks ? info.imageLinks.thumbnail.replace(httpRegex, 'https://') : placeholderImage;
  this.title = info.title ? info.title : 'No title available';
  // this.isbn = `ISBN_13 ${info.industryIdentifiers.identifier}` || 'No ISBN available';
  this.isbn = info.industryIdentifiers ? `ISBN_13 ${info.industryIdentifiers[0].identifier}` : 'No author available';
  // this.author = info.authors || 'No author available';
  this.author = info.authors ? info.authors[0] : 'No author available';
  this.description = info.description ? info.description : 'no description available';
}

function getBooks(request, response) {
  let SQL = 'SELECT * FROM books;';

  return client.query(SQL)
    .then(results => {
      console.log(results.rows);
      if (results.rows.rowCount === 0) {
        response.render('pages/searches/new');
      } else {
        response.render('pages/index', { results: results.rows})
      }
    })
    .catch(err => handleError(err, response));
}

// Note that .ejs file extension is not required
function newSearch(request, response) {
  response.render('pages/searches/new');
}

function createBook(request, response) {
  let normalizedShelf = request.body.bookshelf.toLowerCase();

  let { title, author, isbn, image_url, description } = request.body;
  let SQL = 'INSERT INTO books (title, author, isbn, image_url, description, bookshelf) VALUES ($1, $2, $3, $4, $5, $6);';
  let values = [title, author, isbn, image_url, description, normalizedShelf];

  return client.query(SQL, values)
    // .then(() => {
    //   SQL = 'SELECT * FROM books WHERE isbn=$1;';
    //   values = [request.body.isbn];
    //   return client.query(SQL, values)
        .then(result => response.redirect('/'))
    .catch(err => handleError(err, response));
}

function getBook(request, response) {
  getBookshelves()
    .then(shelves => {
      let SQL = 'SELECT * FROM books WHERE id=$1;';
      let values = [request.params.id];
      client.query(SQL, values)
        .then(result => response.render('pages/books/show', { book: result.rows[0], bookshelves: shelves.rows }))
        .catch(err => handleError(err, response));
    })
}

function getBookshelves() {
  let SQL = 'SELECT DISTINCT bookshelf FROM books ORDER BY bookshelf;';

  return client.query(SQL);
}

function updateBook(request, response) {
  let normalizedShelf = request.body.bookshelf.toLowerCase();
  console.log(request.body.bookshelf);

  let id = request.params.id; // what id of book did the user select
  let { title, author, isbn, image_url, description } = request.body; 
  let SQL = 'UPDATE books SET title=$1, author=$2, isbn=$3, image_url=$4, description=$5, bookshelf=$6 WHERE id=$7;';
  let values = [title, author, isbn, image_url, description, normalizedShelf, id]; 

  return client.query(SQL, values)
    // .then(() => {
    //   SQL = 'SELECT * FROM books WHERE isbn=$1;';
    //   values = [request.body.isbn];
    //   return client.query(SQL, values)
        .then(result => response.redirect(`/books/${id}`))
    //     .catch(handleError);
    // })
    .catch(err => handleError(err, response));
};

// Does handleError function need to move here???

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
    .then(results => response.render('pages/searches/show', { results: results }))
    .catch(err => handleError(err, response));
}

function handleError(error, response) {
  response.status(500).render('pages/error', {error: error});
}



