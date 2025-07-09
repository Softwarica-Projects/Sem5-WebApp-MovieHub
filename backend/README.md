# MovieHub Backend Documentation

## Overview
MovieHub is a full-stack application built using the MERN stack (MongoDB, Express, React, Node.js) with Supabase for authentication. This backend documentation provides an overview of the backend structure, setup instructions, and API endpoints.

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- Supabase

## Project Structure
```
backend
├── src
│   ├── app.js                # Entry point of the application
│   ├── config
│   │   └── db.js            # MongoDB connection configuration
│   ├── controllers
│   │   └── movieController.js # Controller for movie CRUD operations
│   ├── models
│   │   └── movieModel.js     # Mongoose model for movies
│   ├── routes
│   │   ├── adminRoutes.js    # Routes for admin movie management
│   │   └── authRoutes.js     # Routes for user authentication
│   └── utils
│       └── supabaseClient.js  # Supabase client for authentication
├── package.json               # NPM package configuration
└── README.md                  # This documentation file
```

## Setup Instructions
1. **Clone the repository**
   ```
   git clone <repository-url>
   cd MovieHub/backend
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Configure MongoDB**
   - Update the MongoDB connection string in `src/config/db.js`.

4. **Set up Supabase**
   - Create a Supabase project and obtain the API keys.
   - Update the Supabase client configuration in `src/utils/supabaseClient.js`.

5. **Run the application**
   ```
   npm start
   ```

## API Endpoints
### Authentication Routes
- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Log in an existing user.

### Admin Routes
- **POST /api/admin/movies**: Create a new movie.
- **GET /api/admin/movies**: Retrieve all movies.
- **GET /api/admin/movies/:id**: Retrieve a movie by ID.
- **PUT /api/admin/movies/:id**: Update a movie by ID.
- **DELETE /api/admin/movies/:id**: Delete a movie by ID.

## Features
- User registration and login using Supabase.
- Admin panel for managing movies (CRUD operations).
- MongoDB for data storage.

## License
This project is licensed under the MIT License.