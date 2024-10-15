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
  const response = await fetch("https://gutendex.com/books/");
  const data = await response.json();
  books = data.results;
  filteredBooks = books;
  displayBooks();
  populateGenres();
  updatePaginationButtons(data);
}

function updatePaginationButtons(data) {
  prevPageButton.disabled = currentPage === 1 ? data.previous : !data.previous;
  nextPageButton.disabled = !data.next;
}

currentPageElement.textContent = currentPage;

// Display books with wishlist status
function displayBooks() {
  booksContainer.innerHTML = "";
  const wishlist = getWishlist();
  const start = (currentPage - 1) * booksPerPage;
  const end = start + booksPerPage;
  const booksToShow = filteredBooks.slice(start, end);

  booksToShow.forEach((book) => {
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

  // Add event listener to wishlist buttons
  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const bookId = parseInt(btn.getAttribute("data-id"));
      const book = books.find((b) => b.id === bookId);
      toggleWishlist(book);
    });
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

// Search Books
searchInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const searchText = e.target.value.toLowerCase();
    try {
      const response = await fetch(
        `https://gutendex.com/books/?search=${encodeURIComponent(searchText)}`
      );
      const data = await response.json();
      filteredBooks = data.results;
      currentPage = 1;
      displayBooks();
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }
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

// Fetch wishlist from localStorage
function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

// Add to/remove from wishlist
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

// Initial render of the books
fetchBooks();
