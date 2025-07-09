# MovieHub Frontend

## Overview
MovieHub is a web application built using the MERN stack (MongoDB, Express, React, Node.js) that allows users to manage and explore movies. The application includes user authentication via Supabase, an admin panel for CRUD operations on movies, and a user-friendly interface for browsing movie details.

## Features
- User registration and login using Supabase
- Admin panel for managing movies (Create, Read, Update, Delete)
- Home page displaying a list of movies
- Movie details page for viewing individual movie information

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)
- MongoDB (for the backend)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd MovieHub/frontend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Set up environment variables for Supabase:
   Create a `.env` file in the `frontend` directory and add your Supabase URL and API key:
   ```
   REACT_APP_SUPABASE_URL=<your-supabase-url>
   REACT_APP_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   ```

### Running the Application

To start the frontend application, run:
```
npm start
```
This will start the development server and open the application in your default web browser.

### Folder Structure
- `public/`: Contains the main HTML file.
- `src/`: Contains all React components, pages, and services.
  - `components/`: Reusable components like Login, Register, and AdminPanel.
  - `pages/`: Different pages of the application.
  - `services/`: API service for making requests to the backend.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.