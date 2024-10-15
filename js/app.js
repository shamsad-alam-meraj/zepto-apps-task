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
let nextUrl = null;
let previousUrl = null;
const savedSearch = localStorage.getItem("search") || "";
const savedGenre = localStorage.getItem("genre") || "";

// Fetch books from the API
async function fetchBooks(url = "https://gutendex.com/books/") {
  const response = await fetch(url);
  const data = await response.json();

  books = data.results;
  filteredBooks = books;
  nextUrl = data.next;
  previousUrl = data.previous;

  displayBooks();
  populateGenres();
  updatePaginationButtons();
}

// Update pagination buttons' disabled state
function updatePaginationButtons() {
  prevPageButton.disabled = !previousUrl ? true : false;
  nextPageButton.disabled = !nextUrl ? true : false;
}

// Display the list of books
function displayBooks() {
  booksContainer.innerHTML = "";
  const wishlist = getWishlist();

  filteredBooks.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    const isWishlisted = wishlist.some(
      (wishlistBook) => wishlistBook.id === book.id
    );
    const authorNames = book.authors.map((author) => author.name).join(", ");
    const imageUrl =
      book.formats["image/jpeg"] || "../images/default_image.jpg";
    bookCard.innerHTML = `
        <a href="book-details.html?id=${book.id}">
          <img src="${imageUrl}" alt="${book.title}">
        </a>
       <p>
         <a href="book-details.html?id=${book.id}">
          ${
            book.title.length > 15
              ? book.title.substring(0, 15) + "..."
              : book.title
          }
          </a>
       </p>
        <p>by ${
          authorNames.length > 15
            ? authorNames.substring(0, 15) + "..."
            : authorNames
        } </p>
        <p>Book ID: ${book.id}</p>
        <button class="wishlist-btn ${
          isWishlisted ? "wishlisted" : ""
        }" data-id="${book.id}">
          ${isWishlisted ? "Wishlisted ❤️" : "Add to Wishlist ❤️"}
        </button>
      `;
    booksContainer.appendChild(bookCard);
    setTimeout(() => {
      bookCard.classList.add("visible");
    }, 10);
  });

  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const bookId = parseInt(btn.getAttribute("data-id"));
      const book = books.find((b) => b.id === bookId);
      toggleWishlist(book);
    });
  });
}

// Populate genre filter options
function populateGenres() {
  const genres = new Set();
  books.forEach((book) => {
    if (book.subjects && book.subjects.length) {
      book.bookshelves.forEach((subject) => genres.add(subject));
    }
  });

  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreFilter.appendChild(option);
  });
}

// Load saved preferences from localStorage
function loadPreferences() {
  if (savedSearch) {
    searchInput.value = savedSearch;
    handleSearch(savedSearch);
  }

  if (savedGenre) {
    genreFilter.value = savedGenre;
    handleGenreChange(savedGenre);
  }
}

// Handle search input
searchInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const searchText = e.target.value.toLowerCase();
    localStorage.setItem("search", searchText);
    handleSearch(searchText);
  }
});

// Handle genre filter change
genreFilter.addEventListener("change", async (e) => {
  const selectedGenre = e.target.value;
  localStorage.setItem("genre", selectedGenre);

  if (selectedGenre) {
    handleGenreChange(selectedGenre);
  } else {
    filteredBooks = books;
    currentPage = 1;
    displayBooks();
  }
});

// Search handling function
async function handleSearch(searchText) {
  try {
    const response = await fetch(
      `https://gutendex.com/books/?search=${encodeURIComponent(searchText)}`
    );
    const data = await response.json();
    filteredBooks = data.results;
    nextUrl = data.next;
    previousUrl = data.previous;
    currentPage = 1;
    displayBooks();
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

// Genre change handling function
async function handleGenreChange(selectedGenre) {
  try {
    const response = await fetch(
      `https://gutendex.com/books/?topic=${encodeURIComponent(selectedGenre)}`
    );
    const data = await response.json();
    filteredBooks = data.results;
    nextUrl = data.next;
    previousUrl = data.previous;
    currentPage = 1;
    displayBooks();
  } catch (error) {
    console.error("Error fetching books by topic:", error);
  }
}

// Pagination controls
nextPageButton.addEventListener("click", () => {
  if (nextUrl) {
    fetchBooks(nextUrl);
  }
});

prevPageButton.addEventListener("click", () => {
  if (previousUrl) {
    fetchBooks(previousUrl);
  }
});

// Wishlist management
function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function toggleWishlist(book) {
  let wishlist = getWishlist();
  const isBookInWishlist = wishlist.some(
    (wishlistBook) => wishlistBook.id === book.id
  );
  if (isBookInWishlist) {
    wishlist = wishlist.filter((wishlistBook) => wishlistBook.id !== book.id);
  } else {
    wishlist.push(book);
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  displayBooks();
}

if (savedGenre || savedSearch) {
  // Load saved preferences on page load
  loadPreferences();
} else {
  // Initial fetch
  fetchBooks();
}
