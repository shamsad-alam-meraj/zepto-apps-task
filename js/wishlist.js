const wishlistContainer = document.getElementById("wishlist-container");

// Remove from wishlist
function removeFromWishlist(bookId) {
  let wishlist = getWishlist();
  wishlist = wishlist.filter((book) => book.id !== bookId);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  displayWishlist();
}

// get Wish list
function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

// Display wishlist books
function displayWishlist() {
  const wishlist = getWishlist();

  // Clear existing content
  wishlistContainer.innerHTML = "";

  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = "<p>Your wishlist is empty!</p>";
    return;
  }

  wishlist.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");

    bookCard.innerHTML = `
          <img src="${book.formats["image/jpeg"]}" alt="${book.title}">
          <h3>${book.title}</h3>
          <p>by ${book.authors.map((author) => author.name).join(", ")}</p>
          <p>ID: ${book.id}</p>
          <button class="remove-btn" data-id="${
            book.id
          }">Remove from Wishlist</button>
        `;

    wishlistContainer.appendChild(bookCard);
  });

  // Add event listeners to remove buttons
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const bookId = parseInt(btn.getAttribute("data-id"));
      removeFromWishlist(bookId);
    });
  });
}

// Initial render of the wishlist
displayWishlist();
