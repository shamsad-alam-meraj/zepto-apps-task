const bookDetailsContainer = document.getElementById("book-details-container");
let bookData;

function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

// Function to fetch book details based on the ID
async function fetchBookDetails(bookId) {
  showLoader();
  const wishlist = getWishlist();
  try {
    const response = await fetch(`https://gutendex.com/books/${bookId}/`);
    const book = await response.json();
    bookData = book;
    const isWishlisted = wishlist.some(
      (wishlistBook) => wishlistBook.id === book.id
    );

    const formatLinks = Object.keys(book.formats)
      .map(
        (format) =>
          `<a href="${book.formats[format]}" target="_blank">${format}</a>`
      )
      .join(", ");

    bookDetailsContainer.innerHTML = `
          <h1>${book.title}</h1>
          <img src="${book.formats["image/jpeg"]}" alt="${book.title}">
          
          <p><strong>Author(s):</strong></p>
          <ul>
            ${book.authors
              .map(
                (author) =>
                  `<li>${author.name} (${author.birth_year} - ${author.death_year})</li>`
              )
              .join("")}
          </ul>
    
          <p><strong>Translators:</strong></p>
          <ul>
            ${
              book.translators.length > 0
                ? book.translators
                    .map((translator) => `<li>${translator.name}</li>`)
                    .join("")
                : "<li>No translators</li>"
            }
          </ul>
    
          <p><strong>Subjects:</strong></p>
          <ul>
            ${book.subjects.map((subject) => `<li>${subject}</li>`).join("")}
          </ul>
    
          <p><strong>Bookshelves:</strong></p>
          <ul>
            ${book.bookshelves.map((shelf) => `<li>${shelf}</li>`).join("")}
          </ul>
    
          <p><strong>Languages:</strong></p>
          <ul>
            ${book.languages.map((language) => `<li>${language}</li>`).join("")}
          </ul>
    
          <p><strong>Copyright:</strong> ${book.copyright ? "Yes" : "No"}</p>
          <p><strong>Media Type:</strong> ${book.media_type}</p>
    
          <p><strong>Available Formats:</strong> ${formatLinks}</p>
    
          <p><strong>Download Count:</strong> ${book.download_count}</p>
    
          
          <button class="wishlist-btn ${
            isWishlisted ? "wishlisted" : ""
          }" data-id="${book.id}">
            ${isWishlisted ? "Wishlisted ❤️" : "Add to Wishlist ❤️"}
          </button>
        `;
    hideLoader();
  } catch (error) {
    bookDetailsContainer.innerHTML = "<p>Error fetching book details</p>";
    hideLoader();
  }
}

// Get book ID from URL
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get("id");

// Fetch and display book details
if (bookId) {
  fetchBookDetails(bookId);
} else {
  bookDetailsContainer.innerHTML = "<p>Book ID not found!</p>";
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

  // Update button
  const wishlistButton = document.querySelector(
    '.wishlist-btn[data-id="' + book.id + '"]'
  );
  if (wishlistButton) {
    const isStillWishlisted = wishlist.some(
      (wishlistBook) => wishlistBook.id === book.id
    );
    wishlistButton.textContent = isStillWishlisted
      ? "Wishlisted ❤️"
      : "Add to Wishlist ❤️";
    wishlistButton.classList.toggle("wishlisted", isStillWishlisted);
  }
}

// Add to wishlist button functionality
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("wishlist-btn")) {
    if (bookData) {
      toggleWishlist(bookData);
    }
  }
});

// Show loader
function showLoader() {
  document.getElementById("loader").classList.remove("hidden");
}

// Hide loader
function hideLoader() {
  document.getElementById("loader").classList.add("hidden");
}
