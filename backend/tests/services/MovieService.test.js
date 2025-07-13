const MovieService = require('../../src/services/MovieService');
const MovieRepository = require('../../src/repositories/MovieRepository');
const GenreRepository = require('../../src/repositories/GenreRepository');
const UserRepository = require('../../src/repositories/UserRepository');
const { ValidationException, NotFoundException } = require('../../src/exceptions');
const mongoose = require('mongoose');

jest.mock('../../src/repositories/MovieRepository');
jest.mock('../../src/repositories/GenreRepository');
jest.mock('../../src/repositories/UserRepository');

const mockUserRepositoryInstance = {
    findById: jest.fn()
};

UserRepository.mockImplementation(() => mockUserRepositoryInstance);

describe('MovieService', () => {
    let movieService;
    let mockMovieRepository;
    let mockGenreRepository;
    let mockUserRepository;
    let mockMovie;
    let mockGenre;
    let mockUser;

    beforeEach(() => {
        mockMovieRepository = new MovieRepository();
        mockGenreRepository = new GenreRepository();
        mockUserRepository = new UserRepository();
        movieService = new MovieService();
        movieService.movieRepository = mockMovieRepository;
        movieService.genreRepository = mockGenreRepository;

        mockMovie = {
            _id: global.mockId(),
            title: 'Test Movie',
            description: 'Test Description',
            releaseDate: new Date(),
            genre: global.mockId(),
            runtime: 120,
            movieType: 'movie',
            cast: [{ name: 'Actor 1', type: 'Actor' }],
            director: 'Test Director',
            coverImage: '/images/test.jpg',
            ratings: [],
            views: 0,
            featured: false,
            averageRating: 0,
            toObject: function() {
                return { 
                    _id: this._id, 
                    title: this.title, 
                    description: this.description, 
                    releaseDate: this.releaseDate,
                    genre: this.genre,
                    runtime: this.runtime,
                    movieType: this.movieType,
                    cast: this.cast,
                    director: this.director,
                    coverImage: this.coverImage,
                    ratings: this.ratings,
                    views: this.views,
                    featured: this.featured,
                    averageRating: this.averageRating
                };
            }
        };

        mockGenre = {
            _id: global.mockId(),
            name: 'Action',
            description: 'Action movies'
        };

        mockUser = {
            _id: global.mockId(),
            name: 'Test User',
            email: 'test@example.com',
            favourites: []
        };
    });

    describe('validateMovieData', () => {
        it('should validate valid movie data', () => {
            const validData = {
                title: 'Test Movie',
                description: 'This is a test movie description',
                releaseDate: new Date(),
                genre: new mongoose.Types.ObjectId(),
                runtime: 120,
                movieType: 'movie',
                cast: [{ name: 'Actor 1', type: 'Actor' }]
            };

            expect(() => movieService.validateMovieData(validData)).not.toThrow();
        });

        it('should throw ValidationException for missing title', () => {
            const invalidData = {
                description: 'This is a test movie description',
                releaseDate: new Date(),
                genre: new mongoose.Types.ObjectId(),
                runtime: 120,
                movieType: 'movie'
            };

            expect(() => movieService.validateMovieData(invalidData)).toThrow(ValidationException);
        });

        it('should throw ValidationException for short description', () => {
            const invalidData = {
                title: 'Test Movie',
                description: 'Short',
                releaseDate: new Date(),
                genre: new mongoose.Types.ObjectId(),
                runtime: 120,
                movieType: 'movie'
            };

            expect(() => movieService.validateMovieData(invalidData)).toThrow(ValidationException);
        });

        it('should throw ValidationException for invalid genre ID', () => {
            const invalidData = {
                title: 'Test Movie',
                description: 'This is a test movie description',
                releaseDate: new Date(),
                genre: 'invalid-id',
                runtime: 120,
                movieType: 'movie'
            };

            expect(() => movieService.validateMovieData(invalidData)).toThrow(ValidationException);
        });

        it('should throw ValidationException for invalid movie type', () => {
            const invalidData = {
                title: 'Test Movie',
                description: 'This is a test movie description',
                releaseDate: new Date(),
                genre: new mongoose.Types.ObjectId(),
                runtime: 120,
                movieType: 'invalid-type'
            };

            expect(() => movieService.validateMovieData(invalidData)).toThrow(ValidationException);
        });
    });

    describe('createMovie', () => {
        it('should create movie successfully', async () => {
            const movieData = {
                title: 'Test Movie',
                description: 'This is a test movie description',
                releaseDate: new Date(),
                genre: mockGenre._id,
                runtime: 120,
                movieType: 'movie',
                cast: JSON.stringify([{ name: 'Actor 1', type: 'Actor' }])
            };

            mockGenreRepository.findById.mockResolvedValue(mockGenre);
            mockMovieRepository.create.mockResolvedValue(mockMovie);

            const result = await movieService.createMovie(movieData, '/images/test.jpg');

            expect(mockGenreRepository.findById).toHaveBeenCalledWith(movieData.genre);
            expect(mockMovieRepository.create).toHaveBeenCalledWith({
                title: movieData.title,
                description: movieData.description,
                releaseDate: movieData.releaseDate,
                genre: movieData.genre,
                trailerLink: null,
                movieLink: null,
                cast: [{ name: 'Actor 1', type: 'Actor' }],
                runtime: movieData.runtime,
                movieType: movieData.movieType,
                coverImage: '/images/test.jpg'
            });
            expect(result).toEqual(mockMovie);
        });

        it('should throw NotFoundException for invalid genre', async () => {
            const movieData = {
                title: 'Test Movie',
                description: 'This is a test movie description',
                releaseDate: new Date(),
                genre: mockGenre._id,
                runtime: 120,
                movieType: 'movie'
            };

            mockGenreRepository.findById.mockResolvedValue(null);

            await expect(movieService.createMovie(movieData)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateMovie', () => {
        it('should update movie successfully', async () => {
            const movieData = {
                title: 'Updated Movie',
                description: 'Updated description',
                releaseDate: new Date(),
                genre: mockGenre._id,
                runtime: 120,
                movieType: 'movie'
            };

            mockMovieRepository.findById.mockResolvedValue(mockMovie);
            mockGenreRepository.findById.mockResolvedValue(mockGenre);
            mockMovieRepository.updateById.mockResolvedValue({ ...mockMovie, ...movieData });

            const result = await movieService.updateMovie(mockMovie._id, movieData);

            expect(mockMovieRepository.findById).toHaveBeenCalledWith(mockMovie._id);
            expect(mockGenreRepository.findById).toHaveBeenCalledWith(movieData.genre);
            expect(mockMovieRepository.updateById).toHaveBeenCalledWith(mockMovie._id, {
                title: movieData.title,
                description: movieData.description,
                releaseDate: movieData.releaseDate,
                genre: movieData.genre,
                trailerLink: null,
                movieLink: null,
                cast: [],
                runtime: movieData.runtime,
                movieType: movieData.movieType
            });
            expect(result).toEqual({ ...mockMovie, ...movieData });
        });

        it('should throw NotFoundException for non-existent movie', async () => {
            const movieData = { title: 'Updated Movie' };
            mockMovieRepository.findById.mockResolvedValue(null);

            await expect(movieService.updateMovie(mockMovie._id, movieData)).rejects.toThrow(NotFoundException);
        });
    });

    describe('getMovies', () => {
        it('should get all movies with formatted paths', async () => {
            const basePath = 'http://localhost:3000';
            const movies = [mockMovie];

            mockMovieRepository.findWithGenre.mockResolvedValue(movies);

            const result = await movieService.getMovies(basePath);

            expect(mockMovieRepository.findWithGenre).toHaveBeenCalled();
            expect(result).toHaveLength(1);
            expect(result[0].coverImage).toBe(`${basePath}${mockMovie.coverImage}`);
        });
    });

    describe('getMovieById', () => {
        it('should get movie by id without user context', async () => {
            const basePath = 'http://localhost:3000';
            mockMovieRepository.findByIdWithGenreAndRatings.mockResolvedValue(mockMovie);

            const result = await movieService.getMovieById(mockMovie._id, basePath);

            expect(mockMovieRepository.findByIdWithGenreAndRatings).toHaveBeenCalledWith(mockMovie._id);
            expect(result.isFavourite).toBe(false);
            expect(result.coverImage).toBe(`${basePath}${mockMovie.coverImage}`);
        });

        it('should get movie by id with user context', async () => {
            const basePath = 'http://localhost:3000';
            const userId = mockUser._id;
            const userWithFavorites = { ...mockUser, favourites: [mockMovie._id] };

            mockMovieRepository.findByIdWithGenreAndRatings.mockResolvedValue(mockMovie);
            mockUserRepositoryInstance.findById.mockResolvedValue(userWithFavorites);

            const result = await movieService.getMovieById(mockMovie._id, basePath, userId);

            expect(mockUserRepositoryInstance.findById).toHaveBeenCalledWith(userId);
            expect(result.isFavourite).toBe(true);
        });

        it('should throw ValidationException for invalid movie ID', async () => {
            const basePath = 'http://localhost:3000';

            await expect(movieService.getMovieById('invalid-id', basePath)).rejects.toThrow(ValidationException);
        });

        it('should throw NotFoundException for non-existent movie', async () => {
            const basePath = 'http://localhost:3000';
            mockMovieRepository.findByIdWithGenreAndRatings.mockResolvedValue(null);

            await expect(movieService.getMovieById(mockMovie._id, basePath)).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteMovie', () => {
        it('should delete movie successfully', async () => {
            mockMovieRepository.deleteById.mockResolvedValue(mockMovie);

            const result = await movieService.deleteMovie(mockMovie._id);

            expect(mockMovieRepository.deleteById).toHaveBeenCalledWith(mockMovie._id);
            expect(result).toEqual({ message: 'Movie deleted successfully' });
        });

        it('should throw NotFoundException for non-existent movie', async () => {
            mockMovieRepository.findById.mockResolvedValue(null);

            await expect(movieService.deleteMovie(mockMovie._id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('getMoviesByGenre', () => {
        it('should get movies by genre', async () => {
            const basePath = 'http://localhost:3000';
            const movies = [mockMovie];

            mockGenreRepository.findById.mockResolvedValue(mockGenre);
            mockMovieRepository.findByGenre.mockResolvedValue(movies);

            const result = await movieService.getMoviesByGenre(mockGenre._id, basePath);

            expect(mockGenreRepository.findById).toHaveBeenCalledWith(mockGenre._id);
            expect(mockMovieRepository.findByGenre).toHaveBeenCalledWith(mockGenre._id);
            expect(result).toHaveLength(1);
        });
    });

    describe('getFeaturedMovies', () => {
        it('should get featured movies', async () => {
            const basePath = 'http://localhost:3000';
            const movies = [{ ...mockMovie, featured: true }];

            mockMovieRepository.findFeaturedMovies.mockResolvedValue(movies);

            const result = await movieService.getFeaturedMovies(basePath);

            expect(mockMovieRepository.findFeaturedMovies).toHaveBeenCalled();
            expect(result).toHaveLength(1);
        });
    });

    describe('searchMovies', () => {
        it('should search movies', async () => {
            const basePath = 'http://localhost:3000';
            const searchTerm = 'Test';
            const movies = [mockMovie];

            mockMovieRepository.advancedSearchMovies.mockResolvedValue(movies);

            const result = await movieService.searchMovies(searchTerm, null, null, null, basePath);

            expect(mockMovieRepository.advancedSearchMovies).toHaveBeenCalledWith(searchTerm, null, null, null);
            expect(result).toHaveLength(1);
        });

        it('should search movies with all parameters', async () => {
            const basePath = 'http://localhost:3000';
            const searchTerm = 'Test';
            const genreId = mockGenre._id;
            const sortBy = 'rating';
            const orderBy = 'desc';
            const movies = [mockMovie];

            mockGenreRepository.findById.mockResolvedValue(mockGenre);
            mockMovieRepository.advancedSearchMovies.mockResolvedValue(movies);

            const result = await movieService.searchMovies(searchTerm, genreId, sortBy, orderBy, basePath);

            expect(mockGenreRepository.findById).toHaveBeenCalledWith(genreId);
            expect(mockMovieRepository.advancedSearchMovies).toHaveBeenCalledWith(searchTerm, genreId, sortBy, orderBy);
            expect(result).toHaveLength(1);
        });

        it('should throw NotFoundException for invalid genre', async () => {
            const searchTerm = 'Test';
            const genreId = mockGenre._id;
            
            mockGenreRepository.findById.mockResolvedValue(null);

            await expect(movieService.searchMovies(searchTerm, genreId, null, null, 'http://localhost:3000')).rejects.toThrow(NotFoundException);
        });

        it('should throw ValidationException for invalid sortBy', async () => {
            const searchTerm = 'Test';
            const invalidSortBy = 'invalid';

            await expect(movieService.searchMovies(searchTerm, null, invalidSortBy, null, 'http://localhost:3000')).rejects.toThrow(ValidationException);
        });

        it('should throw ValidationException for invalid orderBy', async () => {
            const searchTerm = 'Test';
            const invalidOrderBy = 'invalid';

            await expect(movieService.searchMovies(searchTerm, null, null, invalidOrderBy, 'http://localhost:3000')).rejects.toThrow(ValidationException);
        });
    });

    describe('addRating', () => {
        it('should add new rating successfully', async () => {
            const ratingData = { rating: 5, review: 'Great movie!' };
            const movieWithoutRating = { ...mockMovie, ratings: [] };

            mockMovieRepository.findById.mockResolvedValue(movieWithoutRating);
            mockMovieRepository.addRating.mockResolvedValue(mockMovie);
            mockMovieRepository.updateAverageRating.mockResolvedValue(mockMovie);

            const result = await movieService.addRating(mockMovie._id, mockUser._id, ratingData);

            expect(mockMovieRepository.findById).toHaveBeenCalledWith(mockMovie._id);
            expect(mockMovieRepository.addRating).toHaveBeenCalledWith(mockMovie._id, mockUser._id, ratingData.rating, ratingData.review);
            expect(mockMovieRepository.updateAverageRating).toHaveBeenCalledWith(mockMovie._id);
            expect(result).toEqual({ message: 'Rating added successfully' });
        });

        it('should update existing rating', async () => {
            const ratingData = { rating: 4, review: 'Updated review' };
            const movieWithRating = { 
                ...mockMovie, 
                ratings: [{ userId: mockUser._id, rating: 5, review: 'Old review' }] 
            };

            mockMovieRepository.findById.mockResolvedValue(movieWithRating);
            mockMovieRepository.updateRating.mockResolvedValue(mockMovie);
            mockMovieRepository.updateAverageRating.mockResolvedValue(mockMovie);

            const result = await movieService.addRating(mockMovie._id, mockUser._id, ratingData);

            expect(mockMovieRepository.updateRating).toHaveBeenCalledWith(mockMovie._id, mockUser._id, ratingData.rating, ratingData.review);
            expect(result).toEqual({ message: 'Rating added successfully' });
        });

        it('should throw NotFoundException for non-existent movie', async () => {
            const ratingData = { rating: 5, review: 'Great movie!' };
            mockMovieRepository.findByIdWithGenreAndRatings.mockResolvedValue(null);

            await expect(movieService.addRating(mockMovie._id, mockUser._id, ratingData)).rejects.toThrow(NotFoundException);
        });
    });

    describe('incrementMovieView', () => {
        it('should increment movie view successfully', async () => {
            mockMovieRepository.findById.mockResolvedValue(mockMovie);
            mockMovieRepository.incrementView.mockResolvedValue({ ...mockMovie, views: 1 });

            const result = await movieService.incrementMovieView(mockMovie._id, mockUser._id);

            expect(mockMovieRepository.findById).toHaveBeenCalledWith(mockMovie._id);
            expect(mockMovieRepository.incrementView).toHaveBeenCalledWith(mockMovie._id, mockUser._id);
            expect(result).toEqual({ message: 'View recorded successfully' });
        });

        it('should throw NotFoundException for non-existent movie', async () => {
            mockMovieRepository.findById.mockResolvedValue(null);

            await expect(movieService.incrementMovieView(mockMovie._id, mockUser._id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('getMoviesByType', () => {
        it('should get movies by type', async () => {
            const basePath = 'http://localhost:3000';
            const movieType = 'movie';
            const movies = [mockMovie];

            mockMovieRepository.findByMovieType.mockResolvedValue(movies);

            const result = await movieService.getMoviesByType(movieType, basePath);

            expect(mockMovieRepository.findByMovieType).toHaveBeenCalledWith(movieType);
            expect(result).toHaveLength(1);
        });
    });

    describe('getRecentMovies', () => {
        it('should get recent movies', async () => {
            const basePath = 'http://localhost:3000';
            const limit = 5;
            const movies = [mockMovie];

            mockMovieRepository.findRecentMovies.mockResolvedValue(movies);

            const result = await movieService.getRecentMovies(limit, basePath);

            expect(mockMovieRepository.findRecentMovies).toHaveBeenCalledWith(limit);
            expect(result).toHaveLength(1);
        });
    });

    describe('getTopRatedMovies', () => {
        it('should get top rated movies', async () => {
            const basePath = 'http://localhost:3000';
            const limit = 5;
            const movies = [mockMovie];

            mockMovieRepository.findTopRatedMovies.mockResolvedValue(movies);

            const result = await movieService.getTopRatedMovies(limit, basePath);

            expect(mockMovieRepository.findTopRatedMovies).toHaveBeenCalledWith(limit);
            expect(result).toHaveLength(1);
        });
    });

    describe('getMostViewedMovies', () => {
        it('should get most viewed movies', async () => {
            const basePath = 'http://localhost:3000';
            const limit = 5;
            const movies = [mockMovie];

            mockMovieRepository.findMostViewedMovies.mockResolvedValue(movies);

            const result = await movieService.getMostViewedMovies(limit, basePath);

            expect(mockMovieRepository.findMostViewedMovies).toHaveBeenCalledWith(limit);
            expect(result).toHaveLength(1);
        });
    });

    describe('getSoonReleasingMovies', () => {
        it('should get soon releasing movies', async () => {
            const basePath = 'http://localhost:3000';
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 30);
            const movies = [{ ...mockMovie, releaseDate: futureDate }];

            mockMovieRepository.find.mockResolvedValue(movies);

            const result = await movieService.getSoonReleasingMovies(basePath);

            expect(mockMovieRepository.find).toHaveBeenCalledWith(
                { releaseDate: { $gt: expect.any(Date) } },
                'genre',
                { releaseDate: 1 }
            );
            expect(result).toHaveLength(1);
        });
    });

    describe('toggleFeaturedStatus', () => {
        it('should toggle featured status successfully', async () => {
            const movieToToggle = { ...mockMovie, featured: false };
            const updatedMovie = { ...mockMovie, featured: true };

            mockMovieRepository.findById.mockResolvedValue(movieToToggle);
            mockMovieRepository.updateById.mockResolvedValue(updatedMovie);

            const result = await movieService.toggleFeaturedStatus(mockMovie._id);

            expect(mockMovieRepository.findById).toHaveBeenCalledWith(mockMovie._id);
            expect(mockMovieRepository.updateById).toHaveBeenCalledWith(mockMovie._id, { featured: true });
            expect(result).toEqual({
                message: 'Movie marked as featured',
                movie: updatedMovie
            });
        });

        it('should throw NotFoundException for non-existent movie', async () => {
            mockMovieRepository.findById.mockResolvedValue(null);

            await expect(movieService.toggleFeaturedStatus(mockMovie._id)).rejects.toThrow(NotFoundException);
        });
    });
});
