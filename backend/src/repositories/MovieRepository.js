const BaseRepository = require('./BaseRepository');
const Movie = require('../models/movieModel');
const { ServerException } = require('../exceptions');

class MovieRepository extends BaseRepository {
    constructor() {
        super(Movie);
    }

    async findWithGenre(filter = {}) {
        return await this.find(filter, 'genre', null, null);
    }

    async findByIdWithGenreAndRatings(id) {
        return await this.findById(id, [
            { path: 'genre', select: 'name' },
            { path: 'ratings.userId', select: 'name', model: 'User' }
        ]);
    }

    async findByGenre(genreId) {
        return await this.find({ genre: genreId }, 'genre');
    }

    async findFeaturedMovies() {
        return await this.find({ featured: true }, 'genre');
    }

    async searchMovies(searchTerm) {
        const regex = new RegExp(searchTerm, 'i');
        return await this.find({
            $or: [
                { title: regex },
                { description: regex }
            ]
        }, 'genre');
    }

    async addRating(movieId, userId, rating, review) {
        return await this.updateById(movieId, {
            $push: {
                ratings: {
                    userId,
                    rating,
                    review
                }
            }
        });
    }

    async updateRating(movieId, userId, rating, review) {
        return await this.model.findOneAndUpdate(
            { _id: movieId, 'ratings.userId': userId },
            {
                $set: {
                    'ratings.$.rating': rating,
                    'ratings.$.review': review
                }
            },
            { new: true }
        );
    }

    async incrementView(movieId, userId) {
        return await this.updateById(movieId, {
            $inc: { views: 1 },
            $addToSet: { viewedBy: userId }
        });
    }

    async updateAverageRating(movieId) {
        const movie = await this.findById(movieId);
        if (!movie || movie.ratings.length === 0) {
            return await this.updateById(movieId, { averageRating: 0 });
        }

        const sum = movie.ratings.reduce((acc, rating) => acc + rating.rating, 0);
        const average = sum / movie.ratings.length;
        
        return await this.updateById(movieId, { averageRating: average });
    }

    async findByMovieType(movieType) {
        return await this.find({ movieType }, 'genre');
    }

    async findRecentMovies(limit = 10) {
        try {
            return await this.model.find({})
                .populate('genre')
                .sort({ createdAt: -1 })
                .limit(limit);
        } catch (error) {
            throw new ServerException(`Failed to find recent ${this.model.modelName}s: ${error.message}`);
        }
    }

    async findTopRatedMovies(limit = 10) {
        try {
            return await this.model.find({})
                .populate('genre')
                .sort({ averageRating: -1 })
                .limit(limit);
        } catch (error) {
            throw new ServerException(`Failed to find top rated ${this.model.modelName}s: ${error.message}`);
        }
    }

    async findMostViewedMovies(limit = 10) {
        try {
            return await this.model.find({})
                .populate('genre')
                .sort({ views: -1 })
                .limit(limit);
        } catch (error) {
            throw new ServerException(`Failed to find most viewed ${this.model.modelName}s: ${error.message}`);
        }
    }
}

module.exports = MovieRepository;
