DROP TABLE IF EXISTS books;
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(255),
  description TEXT,
  bookshelf VARCHAR(255)
);

INSERT INTO books (author, title, isbn, image_url, description, bookshelf)
VALUES ('Stephen King', 'The Shining', '9780385528863', 'http://books.google.com/books/content?id=8VnJLu3AvvQC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api', 
'With an excerpt from the sequel, Doctor Sleep. Terrible events occur at an isolated hotel in the off season, when a small boy with psychic powers struggles to hold his own against the forces of evil that are driving his father insane.', 'horror');
INSERT INTO books (author, title, isbn, image_url, description, bookshelf)
VALUES ('Frank Herbert', 'Dune', '9780575081505','http://books.google.com/books/content?id=deRpPwAACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api', 
'The Duke of Atreides has been manoeuvred by his arch-enemy, Baron Harkonnen, into administering the desert planet of Dune. Although it is almost completely without water, Dune is a planet of fabulous wealth, for it is the only source of a drug prized throughout the Galactic Empire. The Duke and his son, Paul, are expecting treachery, and it duly comes - but from a shockingly unexpected place. Then Paul succeeds his father, and he becomes a catalyst for the native people of Dune, whose knowledge of the ecology of the planet gives them vast power. They have been waiting for a leader like Paul Atreides, a leader who can harness that force ... DUNE: one of the most brilliant science fiction novels ever written, as engrossing and heart-rending today as it was when it was first published half a century ago. Joint winner of the HUGO AWARD for best novel, 1966 Winner of the NEBULA AWARD for best novel, 1965', 'SciFi');