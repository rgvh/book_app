DROP TABLE IF EXISTS books;
CREATE TABLE books {
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(255),
  description TEXT,
  bookshelf VARCHAR(255)
};

INSERT INTO books (image_url, title, author, isbn, description)
VALUES ('http://books.google.com/books/content?id=8VnJLu3AvvQC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api', 
'The Shining', 'Stephen King', '9780385528863', 
'With an excerpt from the sequel, Doctor Sleep. Terrible events occur at an isolated hotel in the off season, when a small boy with psychic powers struggles to hold his own against the forces of evil that are driving his father insane.')
VALUES (???, )