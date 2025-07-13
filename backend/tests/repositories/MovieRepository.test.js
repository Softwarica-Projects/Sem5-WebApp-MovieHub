const MovieRepository = require('../../src/repositories/MovieRepository');
const Movie = require('../../src/models/movieModel');

jest.mock('../../src/models/movieModel', () => ({
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findOneAndUpdate: jest.fn(),
    modelName: 'Movie'
}));

describe('MovieRepository', () => {
    let movieRepository;
    let mockMovie;

    beforeEach(() => {
        movieRepository = new MovieRepository();
        mockMovie = {
            _id: '687243ec095f03e825779a5f',
            title: 'Test Movie',
            description: 'Test Description',
            runtime: 120,
            releaseDate: new Date('2025-07-12T11:15:56.723Z'),
            genre: '687243ec095f03e825779a60',
            movieType: 'movie',
            featured: false,
            ratings: [],
            viewedBy: [],
            views: 0,
            averageRating: 0
        };

        jest.clearAllMocks();
    });

    describe('findWithGenre', () => {
        it('should find movies with genre populated', async () => {
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([mockMovie])
            };
            
            mockQuery.then = jest.fn((resolve) => {
                resolve([mockMovie]);
                return Promise.resolve([mockMovie]);
            });

            Movie.find.mockReturnValue(mockQuery);

            const result = await movieRepository.findWithGenre();

            expect(Movie.find).toHaveBeenCalledWith({});
            expect(result).toEqual([mockMovie]);
        });

        it('should find movies with filter and genre populated', async () => {
            const filter = { featured: true };
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([mockMovie])
            };
            
            mockQuery.then = jest.fn((resolve) => {
                resolve([mockMovie]);
                return Promise.resolve([mockMovie]);
            });

            Movie.find.mockReturnValue(mockQuery);

            const result = await movieRepository.findWithGenre(filter);

            expect(Movie.find).toHaveBeenCalledWith(filter);
            expect(result).toEqual([mockMovie]);
        });
    });

    describe('findByIdWithGenreAndRatings', () => {
        it('should find movie by id with genre and ratings populated', async () => {
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockMovie)
            };
            
            mockQuery.then = jest.fn((resolve) => {
                resolve(mockMovie);
                return Promise.resolve(mockMovie);
            });

            Movie.findById.mockReturnValue(mockQuery);

            const result = await movieRepository.findByIdWithGenreAndRatings(mockMovie._id);

            expect(Movie.findById).toHaveBeenCalledWith(mockMovie._id);
            expect(result).toEqual(mockMovie);
        });
    });

    describe('findByGenre', () => {
        it('should find movies by genre', async () => {
            const genreId = '687243ec095f03e825779a66';
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([mockMovie])
            };
            
            mockQuery.then = jest.fn((resolve) => {
                resolve([mockMovie]);
                return Promise.resolve([mockMovie]);
            });

            Movie.find.mockReturnValue(mockQuery);

            const result = await movieRepository.findByGenre(genreId);

            expect(Movie.find).toHaveBeenCalledWith({ genre: genreId });
            expect(result).toEqual([mockMovie]);
        });
    });

    describe('findFeaturedMovies', () => {
        it('should find featured movies', async () => {
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([mockMovie])
            };
            
            mockQuery.then = jest.fn((resolve) => {
                resolve([mockMovie]);
                return Promise.resolve([mockMovie]);
            });

            Movie.find.mockReturnValue(mockQuery);

            const result = await movieRepository.findFeaturedMovies();

            expect(Movie.find).toHaveBeenCalledWith({ featured: true });
            expect(result).toEqual([mockMovie]);
        });
    });

    describe('searchMovies', () => {
        it('should search movies by title and description', async () => {
            const searchTerm = 'test';
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([mockMovie])
            };
            
            mockQuery.then = jest.fn((resolve) => {
                resolve([mockMovie]);
                return Promise.resolve([mockMovie]);
            });

            Movie.find.mockReturnValue(mockQuery);

            const result = await movieRepository.searchMovies(searchTerm);

            expect(Movie.find).toHaveBeenCalledWith({
                $or: [
                    { title: /test/i },
                    { description: /test/i }
                ]
            });
            expect(result).toEqual([mockMovie]);
        });
    });

    describe('findRecentMovies', () => {
        it('should find recent movies', async () => {
            const limit = 5;
            const mockLimitQuery = {
                exec: jest.fn().mockResolvedValue([mockMovie])
            };
            
            mockLimitQuery.then = jest.fn((resolve) => {
                resolve([mockMovie]);
                return Promise.resolve([mockMovie]);
            });

            const mockSortQuery = {
                limit: jest.fn().mockReturnValue(mockLimitQuery)
            };
            
            const mockPopulateQuery = {
                sort: jest.fn().mockReturnValue(mockSortQuery)
            };
            
            const mockQuery = {
                populate: jest.fn().mockReturnValue(mockPopulateQuery)
            };

            Movie.find.mockReturnValue(mockQuery);

            const result = await movieRepository.findRecentMovies(limit);

            expect(Movie.find).toHaveBeenCalledWith({});
            expect(mockQuery.populate).toHaveBeenCalledWith('genre');
            expect(mockPopulateQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(mockSortQuery.limit).toHaveBeenCalledWith(limit);
            expect(result).toEqual([mockMovie]);
        });
    });

    describe('findTopRatedMovies', () => {
        it('should find top rated movies', async () => {
            const limit = 5;
            const mockLimitQuery = {
                exec: jest.fn().mockResolvedValue([mockMovie])
            };
            
            mockLimitQuery.then = jest.fn((resolve) => {
                resolve([mockMovie]);
                return Promise.resolve([mockMovie]);
            });

            const mockSortQuery = {
                limit: jest.fn().mockReturnValue(mockLimitQuery)
            };
            
            const mockPopulateQuery = {
                sort: jest.fn().mockReturnValue(mockSortQuery)
            };
            
            const mockQuery = {
                populate: jest.fn().mockReturnValue(mockPopulateQuery)
            };

            Movie.find.mockReturnValue(mockQuery);

            const result = await movieRepository.findTopRatedMovies(limit);

            expect(Movie.find).toHaveBeenCalledWith({});
            expect(mockQuery.populate).toHaveBeenCalledWith('genre');
            expect(mockPopulateQuery.sort).toHaveBeenCalledWith({ averageRating: -1 });
            expect(mockSortQuery.limit).toHaveBeenCalledWith(limit);
            expect(result).toEqual([mockMovie]);
        });
    });

    describe('findMostViewedMovies', () => {
        it('should find most viewed movies', async () => {
            const limit = 5;
            const mockLimitQuery = {
                exec: jest.fn().mockResolvedValue([mockMovie])
            };
            
            mockLimitQuery.then = jest.fn((resolve) => {
                resolve([mockMovie]);
                return Promise.resolve([mockMovie]);
            });

            const mockSortQuery = {
                limit: jest.fn().mockReturnValue(mockLimitQuery)
            };
            
            const mockPopulateQuery = {
                sort: jest.fn().mockReturnValue(mockSortQuery)
            };
            
            const mockQuery = {
                populate: jest.fn().mockReturnValue(mockPopulateQuery)
            };

            Movie.find.mockReturnValue(mockQuery);

            const result = await movieRepository.findMostViewedMovies(limit);

            expect(Movie.find).toHaveBeenCalledWith({});
            expect(mockQuery.populate).toHaveBeenCalledWith('genre');
            expect(mockPopulateQuery.sort).toHaveBeenCalledWith({ views: -1 });
            expect(mockSortQuery.limit).toHaveBeenCalledWith(limit);
            expect(result).toEqual([mockMovie]);
        });
    });

    describe('findByMovieType', () => {
        it('should find movies by type', async () => {
            const movieType = 'movie';
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([mockMovie])
            };
            
            mockQuery.then = jest.fn((resolve) => {
                resolve([mockMovie]);
                return Promise.resolve([mockMovie]);
            });

            Movie.find.mockReturnValue(mockQuery);

            const result = await movieRepository.findByMovieType(movieType);

            expect(Movie.find).toHaveBeenCalledWith({ movieType });
            expect(result).toEqual([mockMovie]);
        });
    });

    describe('incrementView', () => {
        it('should increment movie views and add user to viewedBy', async () => {
            const userId = '687243ec095f03e825779a70';
            const updatedMovie = { ...mockMovie, views: 1, viewedBy: [userId] };
            
            const mockQuery = {
                exec: jest.fn().mockResolvedValue(updatedMovie)
            };
            
            mockQuery.then = jest.fn((resolve) => {
                resolve(updatedMovie);
                return Promise.resolve(updatedMovie);
            });

            Movie.findByIdAndUpdate.mockReturnValue(mockQuery);

            const result = await movieRepository.incrementView(mockMovie._id, userId);

            expect(Movie.findByIdAndUpdate).toHaveBeenCalledWith(
                mockMovie._id,
                { $inc: { views: 1 }, $addToSet: { viewedBy: userId } },
                { new: true }
            );
            expect(result).toEqual(updatedMovie);
        });
    });

    describe('addRating', () => {
        it('should add rating to movie', async () => {
            const userId = '687243ec095f03e825779a70';
            const rating = 4;
            const review = 'Great movie!';
            const updatedMovie = { 
                ...mockMovie, 
                ratings: [{ userId, rating, review }] 
            };
            
            const mockQuery = {
                exec: jest.fn().mockResolvedValue(updatedMovie)
            };
            
            mockQuery.then = jest.fn((resolve) => {
                resolve(updatedMovie);
                return Promise.resolve(updatedMovie);
            });

            Movie.findByIdAndUpdate.mockReturnValue(mockQuery);

            const result = await movieRepository.addRating(mockMovie._id, userId, rating, review);

            expect(Movie.findByIdAndUpdate).toHaveBeenCalledWith(
                mockMovie._id,
                { $push: { ratings: { userId, rating, review } } },
                { new: true }
            );
            expect(result).toEqual(updatedMovie);
        });
    });

    describe('updateRating', () => {
        it('should update existing rating', async () => {
            const userId = '687243ec095f03e825779a70';
            const rating = 5;
            const review = 'Updated review';
            const updatedMovie = { 
                ...mockMovie, 
                ratings: [{ userId, rating, review }] 
            };

            Movie.findOneAndUpdate.mockResolvedValue(updatedMovie);

            const result = await movieRepository.updateRating(mockMovie._id, userId, rating, review);

            expect(Movie.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: mockMovie._id, 'ratings.userId': userId },
                {
                    $set: {
                        'ratings.$.rating': rating,
                        'ratings.$.review': review
                    }
                },
                { new: true }
            );
            expect(result).toEqual(updatedMovie);
        });
    });

    describe('updateAverageRating', () => {
        it('should update movie average rating', async () => {
            const movieWithRatings = {
                ...mockMovie,
                ratings: [
                    { userId: '1', rating: 4 },
                    { userId: '2', rating: 5 }
                ]
            };
            const updatedMovie = { ...movieWithRatings, averageRating: 4.5 };

            const mockFindQuery = {
                exec: jest.fn().mockResolvedValue(movieWithRatings)
            };
            
            mockFindQuery.then = jest.fn((resolve) => {
                resolve(movieWithRatings);
                return Promise.resolve(movieWithRatings);
            });

            const mockUpdateQuery = {
                exec: jest.fn().mockResolvedValue(updatedMovie)
            };
            
            mockUpdateQuery.then = jest.fn((resolve) => {
                resolve(updatedMovie);
                return Promise.resolve(updatedMovie);
            });

            Movie.findById.mockReturnValue(mockFindQuery);
            Movie.findByIdAndUpdate.mockReturnValue(mockUpdateQuery);

            const result = await movieRepository.updateAverageRating(mockMovie._id);

            expect(Movie.findById).toHaveBeenCalledWith(mockMovie._id);
            expect(Movie.findByIdAndUpdate).toHaveBeenCalledWith(
                mockMovie._id,
                { averageRating: 4.5 },
                { new: true }
            );
            expect(result).toEqual(updatedMovie);
        });

        it('should set average rating to 0 when no ratings exist', async () => {
            const movieWithNoRatings = { ...mockMovie, ratings: [] };
            const updatedMovie = { ...movieWithNoRatings, averageRating: 0 };

            const mockFindQuery = {
                exec: jest.fn().mockResolvedValue(movieWithNoRatings)
            };
            
            mockFindQuery.then = jest.fn((resolve) => {
                resolve(movieWithNoRatings);
                return Promise.resolve(movieWithNoRatings);
            });

            const mockUpdateQuery = {
                exec: jest.fn().mockResolvedValue(updatedMovie)
            };
            
            mockUpdateQuery.then = jest.fn((resolve) => {
                resolve(updatedMovie);
                return Promise.resolve(updatedMovie);
            });

            Movie.findById.mockReturnValue(mockFindQuery);
            Movie.findByIdAndUpdate.mockReturnValue(mockUpdateQuery);

            const result = await movieRepository.updateAverageRating(mockMovie._id);

            expect(Movie.findByIdAndUpdate).toHaveBeenCalledWith(
                mockMovie._id,
                { averageRating: 0 },
                { new: true }
            );
            expect(result).toEqual(updatedMovie);
        });
    });
});