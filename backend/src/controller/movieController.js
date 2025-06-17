const Movie = require('../models/movieModel');

class MovieController {
    constructor(Movie) {
        this.Movie = Movie;
    }

    // Create a new movie
    async createMovie(req, res) {
        try {
            let { title, description, releaseDate, genre, trailerLink, movieLink, cast, runtime, movieType } = req.body;
            const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

            // Parse cast if it's a string
            if (typeof cast === 'string') {
                cast = JSON.parse(cast);
            }

            const movie = new this.Movie({
                title,
                description,
                releaseDate,
                genre,
                trailerLink,
                movieLink,
                cast,
                coverImage,
                runtime,
                movieType, // <-- make sure to include this!
            });

            await movie.save();
            res.status(201).json({ message: 'Movie created successfully', movie });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update an existing movie
    async updateMovie(req, res) {
        try {
            let { title, description, releaseDate, genre, trailerLink, movieLink, cast, runtime, movieType } = req.body;
            const coverImage = req.file ? `/uploads/${req.file.filename}` : undefined;

            // Parse cast if it's a string
            if (typeof cast === 'string') {
                cast = JSON.parse(cast);
            }

            const updateData = {
                title,
                description,
                releaseDate,
                genre, // Single genre ID
                trailerLink,
                movieLink,
                cast,
                runtime,
                movieType, // <-- include movieType
            };

            if (coverImage) {
                updateData.coverImage = coverImage;
            }

            const movie = await this.Movie.findByIdAndUpdate(req.params.id, updateData, { new: true });
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }

            const basePath = `${req.protocol}://${req.get('host')}`;
            movie.coverImage = movie.coverImage ? `${basePath}${movie.coverImage}` : null;

            res.status(200).json({ message: 'Movie updated successfully', movie });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get all movies
    async getMovies(req, res) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            // Populate genre to get genre name
            const movies = await this.Movie.find().populate('genre', 'name');

            // Add base path to the coverImage URL
            const moviesWithBasePath = movies.map(movie => ({
                ...movie.toObject(),
                coverImage: movie.coverImage ? `${basePath}${movie.coverImage}` : null,
                genre: movie.genre && typeof movie.genre === 'object' ? movie.genre.name : movie.genre,
            }));

            res.status(200).json(moviesWithBasePath);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get a movie by ID
    async getMovieById(req, res) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const movie = await this.Movie.findById(req.params.id);
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }
            res.status(200).json(movie);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteMovie(req, res) {
        try {
            const movie = await this.Movie.findByIdAndDelete(req.params.id);
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async rateMovie(req, res) {
        try {
            const { movieId } = req.params;
            const { rating, review } = req.body;
            const userId = req.user.id; // Assuming `req.user` contains the authenticated user's info

            // Validate rating
            if (rating < 1 || rating > 5) {
                return res.status(400).json({ message: 'Rating must be between 1 and 5' });
            }

            // Find the movie
            const movie = await this.Movie.findById(movieId);
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }

            // Check if the user has already rated the movie
            const existingRating = movie.ratings.find((r) => r.userId.toString() === userId);
            if (existingRating) {
                // Update the existing rating and review
                existingRating.rating = rating;
                existingRating.review = review;
            } else {
                // Add a new rating
                movie.ratings.push({ userId, rating, review });
            }

            // Recalculate the average rating
            const totalRatings = movie.ratings.reduce((sum, r) => sum + r.rating, 0);
            movie.averageRating = totalRatings / movie.ratings.length;

            // Save the movie
            await movie.save();

            res.status(200).json({ message: 'Rating submitted successfully', movie });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async viewMovie(req, res) {
        try {
            const { movieId } = req.params;
            const userId = req.user.id; // Assuming `req.user` contains the authenticated user's info

            // Find the movie
            const movie = await this.Movie.findById(movieId);
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }

            // Check if the user has already viewed the movie
            if (!movie.viewedBy.includes(userId)) {
                movie.views += 1; // Increment the view count
                movie.viewedBy.push(userId); // Add the user to the viewedBy list
            }

            // Save the movie
            await movie.save();

            res.status(200).json({ message: 'Movie view recorded', views: movie.views });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async toggleFeatured(req, res) {
        try {
            const { movieId } = req.params;

            // Find the movie
            const movie = await this.Movie.findById(movieId);
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }

            // Toggle the featured flag
            movie.featured = !movie.featured;
            await movie.save();
            res.status(200).json({ message: `Movie ${movie.featured ? 'marked as featured' : 'removed from featured'}`, movie });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Append the new APIs

    // Get top 5 featured movies
    async getFeaturedMovies(req, res) {
        try {
            const movies = await this.Movie.find({ featured: true })
                .sort({ createdAt: -1 }) // Sort by most recently featured
                .limit(5);
            res.status(200).json({ movies });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get top 5 recently added movies
    async getRecentlyAddedMovies(req, res) {
        try {
            const movies = await this.Movie.find()
                .sort({ createdAt: -1 }) // Sort by most recently added
                .limit(5);
            res.status(200).json({ movies });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get top 5 mostly viewed movies (unique views per user)
    async getTopViewedMovies(req, res) {
        try {
            // Fetch all movies and calculate unique views
            const movies = await this.Movie.find();
            const moviesWithUniqueViews = movies.map(movie => ({
                ...movie.toObject(),
                uniqueViews: movie.viewedBy.length, // Count unique users in the 'viewedBy' array
            }));

            // Sort movies by unique views in descending order and take the top 5
            const topViewedMovies = moviesWithUniqueViews
                .sort((a, b) => b.uniqueViews - a.uniqueViews)
                .slice(0, 5);

            res.status(200).json({ movies: topViewedMovies });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get top 5 soon-to-be-released movies
    async getSoonReleasingMovies(req, res) {
        try {
            const currentDate = new Date();
            const movies = await this.Movie.find({ releaseDate: { $gt: currentDate } })
                .sort({ releaseDate: 1 }) // Sort by release date in ascending order
                .limit(5);
            res.status(200).json({ movies });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Toggle favorite movie
    async toggleFavorite(req, res) {
        try {
            const { movieId } = req.params;
            const userId = req.user.id; // Assuming `req.user` contains the authenticated user's info

            // Find the user
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if the movie is already in the user's favorites
            const isFavorite = user.favourites.includes(movieId);

            if (isFavorite) {
                // Remove the movie from favorites
                user.favourites = user.favourites.filter((fav) => fav.toString() !== movieId);
                await user.save();
                return res.status(200).json({ message: 'Movie removed from favorites' });
            } else {
                // Add the movie to favorites
                user.favourites.push(movieId);
                await user.save();
                return res.status(200).json({ message: 'Movie added to favorites' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = MovieController;