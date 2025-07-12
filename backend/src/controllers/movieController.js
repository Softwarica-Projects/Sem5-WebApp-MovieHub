const MovieService = require('../services/MovieService');
const { NotFoundException } = require('../exceptions');

class MovieController {
    constructor() {
        this.movieService = new MovieService();
    }

    async createMovie(req, res, next) {
        try {
            const coverImagePath = req.file ? `/uploads/${req.file.filename}` : null;
            await this.movieService.createMovie(req.body, coverImagePath);
            res.status(201).json({
                success: true,
                message: 'Movie created successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    async updateMovie(req, res, next) {
        try {
            const coverImagePath = req.file ? `/uploads/${req.file.filename}` : null;
            await this.movieService.updateMovie(req.params.id, req.body, coverImagePath);

            res.status(200).json({
                success: true,
                message: 'Movie updated successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    async getMovies(req, res, next) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const movies = await this.movieService.getMovies(basePath);
            res.status(200).json(movies);
        } catch (error) {
            next(error);
        }
    }

    async getMovieById(req, res, next) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const userId = req.user ? req.user.id : null;
            const movie = await this.movieService.getMovieById(req.params.id, basePath, userId);
            res.status(200).json(movie);
        } catch (error) {
            next(error);
        }
    }

    async deleteMovie(req, res, next) {
        try {
            const result = await this.movieService.deleteMovie(req.params.id);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    async rateMovie(req, res, next) {
        try {
            const result = await this.movieService.addRating(req.params.movieId, req.user.id, req.body);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    async viewMovie(req, res, next) {
        try {
            const result = await this.movieService.incrementMovieView(req.params.movieId, req.user.id);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    async toggleFeatured(req, res, next) {
        try {
            const movieId = req.params.movieId;
            const movie = await this.movieService.movieRepository.findById(movieId);
            if (!movie) {
                throw new NotFoundException('Movie', movieId);
            }

            const updatedMovie = await this.movieService.movieRepository.updateById(movieId, {
                featured: !movie.featured
            });

            res.status(200).json({
                success: true,
                message: `Movie ${updatedMovie.featured ? 'marked as featured' : 'removed from featured'}`,
            });
        } catch (error) {
            next(error);
        }
    }

    async getFeaturedMovies(req, res, next) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const movies = await this.movieService.getFeaturedMovies(basePath);
            res.status(200).json(movies);
        } catch (error) {
            next(error);
        }
    }

    async getRecentlyAddedMovies(req, res, next) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const movies = await this.movieService.getRecentMovies(5, basePath);
            res.status(200).json(movies);
        } catch (error) {
            next(error);
        }
    }

    async getTopViewedMovies(req, res, next) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const movies = await this.movieService.getMostViewedMovies(5, basePath);
            res.status(200).json(movies);
        } catch (error) {
            next(error);
        }
    }

    async getSoonReleasingMovies(req, res, next) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const currentDate = new Date();
            const movies = await this.movieService.movieRepository.find(
                { releaseDate: { $gt: currentDate } },
                'genre',
                { releaseDate: 1 }
            );
            const limitedMovies = movies.slice(0, 5);
            const formattedMovies = this.movieService.formatMoviesWithBasePath(limitedMovies, basePath);

            res.status(200).json(formattedMovies);
        } catch (error) {
            next(error);
        }
    }

    async toggleFavorite(req, res, next) {
        try {
            const AuthService = require('../services/AuthService');
            const authService = new AuthService();
            const { movieId } = req.params;
            const userId = req.user.id;

            const user = await authService.userRepository.findById(userId);
            const isFavorite = user.favourites.includes(movieId);

            if (isFavorite) {
                await authService.removeFromFavorites(userId, movieId);
                res.status(200).json({
                    success: true,
                    message: 'Movie removed from favorites'
                });
            } else {
                await authService.addToFavorites(userId, movieId);
                res.status(200).json({
                    success: true,
                    message: 'Movie added to favorites'
                });
            }
        } catch (error) {
            next(error);
        }
    }

    async searchMovies(req, res, next) {
        try {
            const { query, genreId } = req.query;
            const basePath = `${req.protocol}://${req.get('host')}`;

            let movies;
            if (genreId) {
                movies = await this.movieService.getMoviesByGenre(genreId, basePath);
            } else if (query) {
                movies = await this.movieService.searchMovies(query, basePath);
            } else {
                movies = await this.movieService.getMovies(basePath);
            }

            res.status(200).json(movies);
        } catch (error) {
            next(error);
        }
    }
}

const movieController = new MovieController();

module.exports = {
    createMovie: movieController.createMovie.bind(movieController),
    updateMovie: movieController.updateMovie.bind(movieController),
    getMovies: movieController.getMovies.bind(movieController),
    getMovieById: movieController.getMovieById.bind(movieController),
    deleteMovie: movieController.deleteMovie.bind(movieController),
    rateMovie: movieController.rateMovie.bind(movieController),
    viewMovie: movieController.viewMovie.bind(movieController),
    toggleFeatured: movieController.toggleFeatured.bind(movieController),
    getFeaturedMovies: movieController.getFeaturedMovies.bind(movieController),
    getRecentlyAddedMovies: movieController.getRecentlyAddedMovies.bind(movieController),
    getTopViewedMovies: movieController.getTopViewedMovies.bind(movieController),
    getSoonReleasingMovies: movieController.getSoonReleasingMovies.bind(movieController),
    toggleFavorite: movieController.toggleFavorite.bind(movieController),
    searchMovies: movieController.searchMovies.bind(movieController)
};