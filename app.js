// Book class- represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// user Interface class
class UI {
  static displayBooks() {
    const Books = store.getBooks();

    Books.forEach((book) => {
      UI.addBOOKtoList(book);
    });
  }

  static addBOOKtoList(book) {
    const List = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    

    `;

    List.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  //   Alert

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    // vanish in 3 sec
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 2000);
  }
  static clearField() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

// store class ; handles storage

class store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add new Book

document.querySelector("#book-form").addEventListener("submit", (e) => {
  //  Prevent actual Submit
  e.preventDefault();

  // Get form values
  const title = document.querySelector("#title").value,
    author = document.querySelector("#author").value,
    isbn = document.querySelector("#isbn").value;

  // validate the fields
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("please fill in all the fields", "danger");
  } else {
    // initialize book
    const book = new Book(title, author, isbn);

    // Add Book to UI
    UI.addBOOKtoList(book);

    // add book to store
    store.addBook(book);

    // show success message
    UI.showAlert("Book Added", "success");

    //   clear field after submit
    UI.clearField();
  }
});

// event: Remove element

document.querySelector("#book-list").addEventListener("click", (e) => {
  //  remove book from UI
  UI.deleteBook(e.target);

  // remove book from store
  store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  // show success message
  UI.showAlert("Book Removed", "success");
});
