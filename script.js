// FIXME: Delete does not aactually delete from library dictionary
// TODO: Need to properly set hasRead based on toggle
// TODO: Need to update hasRead based on toggle
// FIXME: Form autofills with last done content
/* eslint-disable no-use-before-define */
// Library Logic ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const myLibrary = {};

function printMyLibrary() {
  console.log('Printing Library');
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const key in myLibrary) {
    const obj = myLibrary[key];
    // eslint-disable-next-line no-console
    console.log(`ID: ${key}, Title: ${obj.title}, Read?: ${obj.hasRead}`);
  }
}

class Book {
  constructor(title, author, numPages, hasRead, idNum) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.hasRead = hasRead;
    this.idNum = idNum;
  }
}

// Creates a new book object with given data and adds to library
// returns ID number (int) of book in library
function addToLibrary(title, author, numPages, hasRead) {
  // Creates non-secure hashcode based on a string
  function hashCode(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i += 1) {
      const chr = str.charCodeAt(i);
      // eslint-disable-next-line no-bitwise
      hash = (hash << 5) - hash + chr;
      // eslint-disable-next-line no-bitwise
      hash |= 0;
    }
    return hash;
  }

  let idNum = hashCode(title);
  while (idNum in myLibrary) {
    idNum += 1;
  }
  myLibrary[idNum] = new Book(title, author, numPages, hasRead, idNum);
  return idNum;
}

// If book is in the library, deletes it.
// If not in the library, do nothing.
function deleteFromLibrary(idNum) {
  if (idNum in myLibrary) { delete myLibrary.idNum; }
}

// If book is in the library, change read status (true -> false, false -> true).
// If not in the library, do nothing.
function changeReadStatus(idNum) {
  if (idNum in myLibrary) {
    myLibrary[idNum].hasRead = !myLibrary[idNum].hasRead;
  }
}

// Webpage Logic ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// MODAL
const modal = document.querySelector('.modal');
const modalBtn = document.getElementById('add-book');

// When the user clicks on the button, open the modal
modalBtn.onclick = function turnOnModal() {
  modal.style.display = 'block';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function turnOffModal(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

// FORM
const form = document.querySelector('form');
function handleForm(event) { event.preventDefault(); }
form.addEventListener('submit', handleForm);

// eslint-disable-next-line no-unused-vars
function formSubmit() {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const numPages = document.getElementById('pages').value;
  const hasRead = document.getElementById('has-read').value;
  addNewBook(title, author, numPages, hasRead);
  modal.style.display = 'none';
}

// CREATE BOOK ELEMENTS
function addNewBook(title, author, numPages, hasRead) {
  const newID = addToLibrary(title, author, numPages, hasRead);

  // Create a book card with necessary class and ID Num info
  const bookCard = document.createElement('div');
  bookCard.classList.add('book-card');
  bookCard.dataset.idNum = newID;

  // Add information to data card with HTML properties
  const bookName = document.createElement('div');
  bookName.appendChild(document.createTextNode(`${title} by ${author}`));
  bookName.classList.add('name');
  bookCard.appendChild(bookName);
  const bookPages = document.createElement('div');
  bookPages.appendChild(document.createTextNode(`${numPages} pages`));
  bookPages.classList.add('pages');
  bookCard.appendChild(bookPages);
  const bookRead = document.createElement('div');
  bookRead.classList.add('toggle-container');
  bookRead.innerHTML = '<span>Read it?</span>'
                     + '<label class="toggle">'
                     + '<input class="toggle-input" type="checkbox" id="has-read" name="has-read">'
                     + '<span class="toggle-labels" data-on="Yup" data-off="Nope"></span>'
                     + '<span class="toggle-handle"></span>'
                     + '</label>';
  bookRead.setAttribute('onclick', 'return readBook(this)');
  bookCard.appendChild(bookRead);
  const bookDelete = document.createElement('button');
  bookDelete.classList.add('delete');
  bookDelete.setAttribute('onclick', 'return deleteBook(this)');
  bookDelete.innerHTML = 'Delete Book';
  bookCard.appendChild(bookDelete);

  // Insert book card into DOM
  const bookshelf = document.querySelector('.bookshelf');
  bookshelf.appendChild(bookCard);
  printMyLibrary();
}

// Delete book elements
// eslint-disable-next-line no-unused-vars
function deleteBook(element) {
  const bookElement = element.parentElement;
  const bookID = bookElement.dataset.idNum;
  bookElement.remove();
  deleteFromLibrary(bookID);
  printMyLibrary();
}

// Switches book element from read to not read, or vise versa
function readBook(element) {
  const bookElement = element.parentElement;
  const bookID = bookElement.dataset.idNum;
  changeReadStatus(bookID);
  printMyLibrary();
}
