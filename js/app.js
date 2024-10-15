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

function updatePaginationButtons() {
  prevPageButton.disabled = !previousUrl ? true : false;
  nextPageButton.disabled = !nextUrl ? true : false;
}

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

    bookCard.innerHTML = `
        <a href="book-details.html?id=${book.id}">
          <img src="${book.formats["image/jpeg"]}" alt="${book.title}">
        </a>
        <h3>
          <a href="book-details.html?id=${book.id}">${book.title}</a>
        </h3>
        <p>by ${authorNames}</p>
        <p>ID: ${book.id}</p>
        <button class="wishlist-btn ${
          isWishlisted ? "wishlisted" : ""
        }" data-id="${book.id}">
          ${isWishlisted ? "Wishlisted ❤️" : "Add to Wishlist ❤️"}
        </button>
      `;
    booksContainer.appendChild(bookCard);
  });

  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const bookId = parseInt(btn.getAttribute("data-id"));
      const book = books.find((b) => b.id === bookId);
      toggleWishlist(book);
    });
  });
}

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

searchInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const searchText = e.target.value.toLowerCase();
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
});

// Genre filter
genreFilter.addEventListener("change", async (e) => {
  const selectedGenre = e.target.value;
  if (selectedGenre) {
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
  } else {
    filteredBooks = books;
    currentPage = 1;
    displayBooks();
  }
});

// Pagination
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

fetchBooks();
