const booksContainer = document.getElementById("books-container");
const searchInput = document.getElementById("search-input");
const genreFilter = document.getElementById("genre-filter");
const currentPageElement = document.getElementById("current-page");
const prevPageButton = document.getElementById("prev-page");
const nextPageButton = document.getElementById("next-page");

let books = [];
let filteredBooks = [];
let currentPage = 1;
const booksPerPage = 10;

// Fetch books from API
async function fetchBooks() {
  const response = await fetch("https://gutendex.com/books");
  const data = await response.json();
  books = data.results;
  filteredBooks = books;
  displayBooks();
  populateGenres();
}

// Display books
function displayBooks() {
  booksContainer.innerHTML = "";
  const start = (currentPage - 1) * booksPerPage;
  const end = start + booksPerPage;
  const booksToShow = filteredBooks.slice(start, end);

  booksToShow.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    bookCard.innerHTML = `
      <img src="${book.formats["image/jpeg"]}" alt="${book.title}">
      <h3>${book.title}</h3>
      <p>by ${book.authors.map((author) => author.name).join(", ")}</p>
      <p>ID: ${book.id}</p>
      <button class="wishlist-btn" data-id="${book.id}">❤️</button>
    `;
    booksContainer.appendChild(bookCard);
  });
}

// Populate genre dropdown dynamically
function populateGenres() {
  const genres = new Set();
  books.forEach((book) => {
    if (book.subjects && book.subjects.length) {
      book.subjects.forEach((subject) => genres.add(subject));
    }
  });

  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreFilter.appendChild(option);
  });
}

// Search filter
searchInput.addEventListener("input", (e) => {
  const searchText = e.target.value.toLowerCase();
  filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchText)
  );
  currentPage = 1;
  displayBooks();
});

// Genre filter
genreFilter.addEventListener("change", (e) => {
  const selectedGenre = e.target.value;
  filteredBooks = selectedGenre
    ? books.filter(
        (book) => book.subjects && book.subjects.includes(selectedGenre)
      )
    : books;
  currentPage = 1;
  displayBooks();
});

// Pagination
nextPageButton.addEventListener("click", () => {
  if (currentPage * booksPerPage < filteredBooks.length) {
    currentPage++;
    displayBooks();
  }
});

prevPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayBooks();
  }
});

fetchBooks();
