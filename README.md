# Gutenberg Books ([Demo Site](https://zepto-apps-jobtask.netlify.app/))

## Overview

The Book Library App is a front-end project that fetches data from the Gutenberg API and displays a list of books in a user-friendly format. Users can search for books, filter by genre, manage a wishlist, and navigate through paginated book lists. The application is fully responsive and styled using vanilla CSS.

## Features

- **Book List Display**: Shows a clean and organized list of books, including:

  - Title (truncated to 20 characters if longer)
  - Author name
  - Cover image
  - Book ID

- **Search Functionality**: Real-time search bar to filter books by title.

- **Genre Filter**: Dropdown filter to select and display books based on genre/topic.

- **Wishlist Management**: Users can save books to a wishlist using localStorage. The wishlist button can be toggled to add or remove books.

- **Pagination**: Users can navigate through the books list using next and previous buttons.

- **Smooth Animations**: Implemented smooth animations for showing or hiding books, enhancing user experience.

- **Persistent User Preferences**: Utilizes localStorage to save the user’s search and filter preferences, ensuring they persist when the page is refreshed.

- **Responsive Design**: The layout is fully responsive, ensuring a seamless experience on both desktop and mobile devices.

- **User Interface**: Includes a homepage, a wishlist page, and individual book detail pages with a navigation bar.
  
- **Loader**: A loading indicator is implemented on both the book list and details pages, providing feedback to users while content is being fetched.

## Technologies Used

- **Languages**: HTML, CSS, JavaScript
- **API**: [Gutendex API](https://gutendex.com/)
- **Styling**: Vanilla CSS (with a preference for custom styles over frameworks)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shamsad-alam-meraj/zepto-apps-task.git

   ```

2. `cd zepto-apps-task`

3. Open the project folder in Visual Studio Code:

   - Launch Visual Studio Code.
   - Click on File in the menu, then select Open Folder....
   - Navigate to the zepto-apps-task folder you just cloned and click Open.

4. Open the index.html file:

   - Locate the index.html file in the Explorer panel on the left side of VS Code.
   - Right-click on index.html and select Open with Live Server.
     - If you don't have the Live Server extension installed, you can install it from the Extensions marketplace within VS Code.

5. View the application in your web browser:

   - Live Server will open the index.html file in your default web browser, allowing you to interact with the application in real time.

### [Click Here to See The Live Demo Site](https://zepto-apps-jobtask.netlify.app/)
