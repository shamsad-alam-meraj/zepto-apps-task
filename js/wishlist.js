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
    const imageUrl =
      book.formats["image/jpeg"] || "../images/default_image.jpg";
    const authorNames = book.authors.map((author) => author.name).join(", ");
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
          <button class="remove-btn" data-id="${
            book.id
          }">Remove from Wishlist</button>
        `;

    wishlistContainer.appendChild(bookCard);
    setTimeout(() => {
      bookCard.classList.add("visible");
    }, 10);
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
