const Movie = require('../models/movieModel');

class MovieController {
    constructor(Movie) {
        this.Movie = Movie;
    }

    async createMovie(req, res) {
        try {
            let { title, description, releaseDate, genre, trailerLink, movieLink, cast, runtime, movieType } = req.body;
            const coverImage = req.file ? `/uploads/${req.file.filename}` : null;
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
                movieType,
            });

            await movie.save();
            res.status(201).json({ message: 'Movie created successfully', movie });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateMovie(req, res) {
        try {
            let { title, description, releaseDate, genre, trailerLink, movieLink, cast, runtime, movieType } = req.body;
            const coverImage = req.file ? `/uploads/${req.file.filename}` : undefined;

            if (typeof cast === 'string') {
                cast = JSON.parse(cast);
            }

            const updateData = {
                title,
                description,
                releaseDate,
                genre,
                trailerLink,
                movieLink,
                cast,
                runtime,
                movieType,
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

    async getMovies(req, res) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const movies = await this.Movie.find().populate('genre', 'name');
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

    async getMovieById(req, res) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const movie = await this.Movie.findById(req.params.id)
                .populate('genre', 'name')
                .populate({
                    path: 'ratings.userId',
                    select: 'name',
                    model: 'User'
                });
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }
            movie.coverImage = movie.coverImage ? `${basePath}${movie.coverImage}` : null;
            const ratingsWithUserName = (movie.ratings || []).map(rating => ({
                _id: rating._id,
                userId: rating.userId?._id || rating.userId,
                userName: rating.userId?.name || null,
                rating: rating.rating,
                review: rating.review,
            }));

            const movieObj = movie.toObject();
            movieObj.ratings = ratingsWithUserName;

            let isFavourite = false;
            if (req.user && req.user.id) {
                const User = require('../models/userModel');
                const user = await User.findById(req.user.id);
                if (user && user.favourites && user.favourites.some(fav => fav.toString() === movie._id.toString())) {
                    isFavourite = true;
                }
            }
            movieObj.isFavourite = isFavourite;
            return res.status(200).json(movieObj);
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
            const userId = req.user.id;
            if (rating < 1 || rating > 5) {
                return res.status(400).json({ message: 'Rating must be between 1 and 5' });
            }
            const movie = await this.Movie.findById(movieId);
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }

            const existingRating = movie.ratings.find((r) => r.userId.toString() === userId);
            if (existingRating) {
                existingRating.rating = rating;
                existingRating.review = review;
            } else {
                movie.ratings.push({ userId, rating, review });
            }

            const totalRatings = movie.ratings.reduce((sum, r) => sum + r.rating, 0);
            movie.averageRating = totalRatings / movie.ratings.length;

            await movie.save();

            res.status(200).json({ message: 'Rating submitted successfully', movie });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async viewMovie(req, res) {
        try {
            const { movieId } = req.params;
            const userId = req.user.id;

            const movie = await this.Movie.findById(movieId);
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }
            movie.views += 1;
            movie.viewedBy.push(userId);
            await movie.save();
            res.status(200).json({ message: 'Movie view recorded', views: movie.views });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async toggleFeatured(req, res) {
        try {
            const { movieId } = req.params;
            const movie = await this.Movie.findById(movieId);
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }
            movie.featured = !movie.featured;
            await movie.save();
            res.status(200).json({ message: `Movie ${movie.featured ? 'marked as featured' : 'removed from featured'}`, movie });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getFeaturedMovies(req, res) {
        try {
            const movies = await this.Movie.find({ featured: true })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('genre', 'name');
            const moviesWithGenre = movies.map(movie => ({
                ...movie.toObject(),
                coverImage: movie.coverImage ? `${req.protocol}://${req.get('host')}${movie.coverImage}` : null,
                genre: movie.genre && typeof movie.genre === 'object' ? movie.genre._id : movie.genre,
                genreName: movie.genre && typeof movie.genre === 'object' ? movie.genre.name : '',
            }));
            res.status(200).json(moviesWithGenre);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getRecentlyAddedMovies(req, res) {
        try {
            const movies = await this.Movie.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('genre', 'name');
            const moviesWithGenre = movies.map(movie => ({
                ...movie.toObject(),
                coverImage: movie.coverImage ? `${req.protocol}://${req.get('host')}${movie.coverImage}` : null,
                genre: movie.genre && typeof movie.genre === 'object' ? movie.genre._id : movie.genre,
                genreName: movie.genre && typeof movie.genre === 'object' ? movie.genre.name : '',
            }));
            res.status(200).json(moviesWithGenre);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getTopViewedMovies(req, res) {
        try {
            const movies = await this.Movie.find().populate('genre', 'name');
            const moviesWithUniqueViews = movies.map(movie => ({
                ...movie.toObject(),
                uniqueViews: movie.viewedBy.length,
                coverImage: movie.coverImage ? `${req.protocol}://${req.get('host')}${movie.coverImage}` : null,
                genre: movie.genre && typeof movie.genre === 'object' ? movie.genre._id : movie.genre,
                genreName: movie.genre && typeof movie.genre === 'object' ? movie.genre.name : '',
            }));

            const topViewedMovies = moviesWithUniqueViews
                .sort((a, b) => b.uniqueViews - a.uniqueViews)
                .slice(0, 5);

            res.status(200).json(topViewedMovies);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getSoonReleasingMovies(req, res) {
        try {
            const currentDate = new Date();
            const basePath = `${req.protocol}://${req.get('host')}`;
            const movies = await this.Movie.find({ releaseDate: { $gt: currentDate } })
                .sort({ releaseDate: 1 })
                .limit(5)
                .populate('genre', 'name');
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

    async toggleFavorite(req, res) {
        try {
            const { movieId } = req.params;
            const userId = req.user.id;
            const User = require('../models/userModel');
            const user = await User.findById(userId);
            const isFavorite = user.favourites.includes(movieId);

            if (isFavorite) {
                user.favourites = user.favourites.filter((fav) => fav.toString() !== movieId);
                await user.save();
                return res.status(200).json({ message: 'Movie removed from favorites' });
            } else {
                user.favourites.push(movieId);
                await user.save();
                return res.status(200).json({ message: 'Movie added to favorites' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async searchMovies(req, res) {
        try {
            const { query, genreId } = req.query;
            const basePath = `${req.protocol}://${req.get('host')}`;
            let filter = {};

            if (query) {
                filter.title = { $regex: query, $options: 'i' };
            }
            if (genreId) {
                filter.genre = genreId;
            }

            const movies = await this.Movie.find(filter).populate('genre', 'name');
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
}

module.exports = MovieController;