import axios from '../../config/axiosConfig';
import {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  toggleFeatured,
  getFeaturedMovies,
  getRecentlyAdded,
  getPopularMovies,
  getReleasingSoonMovies,
  getFavMovies,
  toggleFavMovie,
  searchMovies,
  addMovieRating,
  trackMovieView,
} from '../../services/movieService';

jest.mock('../../config/axiosConfig');
const mockedAxios = axios;

describe('movieService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMovie', () => {
    test('should create movie successfully', async () => {
      const movieData = new FormData();
      movieData.append('title', 'Test Movie');
      movieData.append('description', 'A test movie');

      const mockResponse = {
        data: {
          message: 'Movie created successfully',
          movie: {
            _id: '1',
            title: 'Test Movie',
            description: 'A test movie',
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await createMovie(movieData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/movies', movieData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle create movie error', async () => {
      const movieData = new FormData();
      movieData.append('title', 'Test Movie');

      const mockError = {
        response: {
          data: { message: 'Movie title already exists' },
          status: 400,
        },
      };

      mockedAxios.post.mockRejectedValue(mockError);

      await expect(createMovie(movieData)).rejects.toEqual(mockError);
      expect(mockedAxios.post).toHaveBeenCalledWith('/movies', movieData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    });
  });

  describe('getMovies', () => {
    test('should fetch all movies successfully', async () => {
      const mockResponse = {
        data: {
          movies: [
            { _id: '1', title: 'Movie 1', description: 'Description 1' },
            { _id: '2', title: 'Movie 2', description: 'Description 2' },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getMovies();

      expect(mockedAxios.get).toHaveBeenCalledWith('/movies/search');
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle get movies error', async () => {
      const mockError = {
        response: {
          data: { message: 'Failed to fetch movies' },
          status: 500,
        },
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(getMovies()).rejects.toEqual(mockError);
      expect(mockedAxios.get).toHaveBeenCalledWith('/movies/search');
    });
  });

  describe('getMovieById', () => {
    test('should fetch movie by id successfully', async () => {
      const movieId = '1';
      const mockResponse = {
        data: {
          movie: {
            _id: '1',
            title: 'Test Movie',
            description: 'A test movie',
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getMovieById(movieId);

      expect(mockedAxios.get).toHaveBeenCalledWith(`/movies/${movieId}/detail`);
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle get movie by id error', async () => {
      const movieId = '999';
      const mockError = {
        response: {
          data: { message: 'Movie not found' },
          status: 404,
        },
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(getMovieById(movieId)).rejects.toEqual(mockError);
      expect(mockedAxios.get).toHaveBeenCalledWith(`/movies/${movieId}/detail`);
    });
  });

  describe('updateMovie', () => {
    test('should update movie successfully', async () => {
      const movieId = '1';
      const movieData = new FormData();
      movieData.append('title', 'Updated Movie');

      const mockResponse = {
        data: {
          message: 'Movie updated successfully',
          movie: {
            _id: '1',
            title: 'Updated Movie',
          },
        },
      };

      mockedAxios.put.mockResolvedValue(mockResponse);

      const result = await updateMovie(movieId, movieData);

      expect(mockedAxios.put).toHaveBeenCalledWith(`/movies/${movieId}`, movieData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle update movie error', async () => {
      const movieId = '1';
      const movieData = new FormData();
      movieData.append('title', 'Updated Movie');

      const mockError = {
        response: {
          data: { message: 'Movie not found' },
          status: 404,
        },
      };

      mockedAxios.put.mockRejectedValue(mockError);

      await expect(updateMovie(movieId, movieData)).rejects.toEqual(mockError);
      expect(mockedAxios.put).toHaveBeenCalledWith(`/movies/${movieId}`, movieData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    });
  });

  describe('deleteMovie', () => {
    test('should delete movie successfully', async () => {
      const movieId = '1';
      const mockResponse = {
        data: {
          message: 'Movie deleted successfully',
        },
      };

      mockedAxios.delete.mockResolvedValue(mockResponse);

      const result = await deleteMovie(movieId);

      expect(mockedAxios.delete).toHaveBeenCalledWith(`/movies/${movieId}`);
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle delete movie error', async () => {
      const movieId = '999';
      const mockError = {
        response: {
          data: { message: 'Movie not found' },
          status: 404,
        },
      };

      mockedAxios.delete.mockRejectedValue(mockError);

      await expect(deleteMovie(movieId)).rejects.toEqual(mockError);
      expect(mockedAxios.delete).toHaveBeenCalledWith(`/movies/${movieId}`);
    });
  });

  describe('toggleFeatured', () => {
    test('should toggle featured status successfully', async () => {
      const movieId = '1';
      const mockResponse = {
        data: {
          message: 'Movie featured status updated',
          movie: {
            _id: '1',
            title: 'Test Movie',
            isFeatured: true,
          },
        },
      };

      mockedAxios.patch.mockResolvedValue(mockResponse);

      const result = await toggleFeatured(movieId);

      expect(mockedAxios.patch).toHaveBeenCalledWith(`/movies/${movieId}/featured`);
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle toggle featured error', async () => {
      const movieId = '999';
      const mockError = {
        response: {
          data: { message: 'Movie not found' },
          status: 404,
        },
      };

      mockedAxios.patch.mockRejectedValue(mockError);

      await expect(toggleFeatured(movieId)).rejects.toEqual(mockError);
      expect(mockedAxios.patch).toHaveBeenCalledWith(`/movies/${movieId}/featured`);
    });
  });

  describe('getFeaturedMovies', () => {
    test('should fetch featured movies successfully', async () => {
      const mockResponse = {
        data: {
          movies: [
            { _id: '1', title: 'Featured Movie 1', isFeatured: true },
            { _id: '2', title: 'Featured Movie 2', isFeatured: true },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getFeaturedMovies();

      expect(mockedAxios.get).toHaveBeenCalledWith('/movies/featured-movies');
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle get featured movies error', async () => {
      const mockError = {
        response: {
          data: { message: 'Failed to fetch featured movies' },
          status: 500,
        },
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(getFeaturedMovies()).rejects.toEqual(mockError);
      expect(mockedAxios.get).toHaveBeenCalledWith('/movies/featured-movies');
    });
  });

  describe('getRecentlyAdded', () => {
    test('should fetch recently added movies successfully', async () => {
      const mockResponse = {
        data: {
          movies: [
            { _id: '1', title: 'Recent Movie 1', createdAt: '2023-01-01' },
            { _id: '2', title: 'Recent Movie 2', createdAt: '2023-01-02' },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getRecentlyAdded();

      expect(mockedAxios.get).toHaveBeenCalledWith('/movies/recent');
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle get recently added movies error', async () => {
      const mockError = {
        response: {
          data: { message: 'Failed to fetch recent movies' },
          status: 500,
        },
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(getRecentlyAdded()).rejects.toEqual(mockError);
      expect(mockedAxios.get).toHaveBeenCalledWith('/movies/recent');
    });
  });

  describe('getPopularMovies', () => {
    test('should fetch popular movies successfully', async () => {
      const mockResponse = {
        data: {
          movies: [
            { _id: '1', title: 'Popular Movie 1', views: 1000 },
            { _id: '2', title: 'Popular Movie 2', views: 900 },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getPopularMovies();

      expect(mockedAxios.get).toHaveBeenCalledWith('/movies/top-viewed');
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle get popular movies error', async () => {
      const mockError = {
        response: {
          data: { message: 'Failed to fetch popular movies' },
          status: 500,
        },
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(getPopularMovies()).rejects.toEqual(mockError);
      expect(mockedAxios.get).toHaveBeenCalledWith('/movies/top-viewed');
    });
  });

  describe('getReleasingSoonMovies', () => {
    test('should fetch releasing soon movies successfully', async () => {
      const mockResponse = {
        data: {
          movies: [
            { _id: '1', title: 'Upcoming Movie 1', releaseDate: '2024-01-01' },
            { _id: '2', title: 'Upcoming Movie 2', releaseDate: '2024-01-02' },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getReleasingSoonMovies();

      expect(mockedAxios.get).toHaveBeenCalledWith('/movies/soon-releasing');
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle get releasing soon movies error', async () => {
      const mockError = {
        response: {
          data: { message: 'Failed to fetch upcoming movies' },
          status: 500,
        },
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(getReleasingSoonMovies()).rejects.toEqual(mockError);
      expect(mockedAxios.get).toHaveBeenCalledWith('/movies/soon-releasing');
    });
  });

  describe('getFavMovies', () => {
    test('should fetch favorite movies successfully', async () => {
      const mockResponse = {
        data: {
          movies: [
            { _id: '1', title: 'Favorite Movie 1' },
            { _id: '2', title: 'Favorite Movie 2' },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getFavMovies();

      expect(mockedAxios.get).toHaveBeenCalledWith('/auth/favorites');
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle get favorite movies error', async () => {
      const mockError = {
        response: {
          data: { message: 'Failed to fetch favorite movies' },
          status: 500,
        },
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(getFavMovies()).rejects.toEqual(mockError);
      expect(mockedAxios.get).toHaveBeenCalledWith('/auth/favorites');
    });
  });

  describe('toggleFavMovie', () => {
    test('should toggle favorite movie successfully', async () => {
      const movieId = '1';
      const mockResponse = {
        data: {
          message: 'Movie added to favorites',
          isFavorite: true,
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await toggleFavMovie(movieId);

      expect(mockedAxios.post).toHaveBeenCalledWith(`/movies/${movieId}/toggle-favorites`);
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle toggle favorite movie error', async () => {
      const movieId = '999';
      const mockError = {
        response: {
          data: { message: 'Movie not found' },
          status: 404,
        },
      };

      mockedAxios.post.mockRejectedValue(mockError);

      await expect(toggleFavMovie(movieId)).rejects.toEqual(mockError);
      expect(mockedAxios.post).toHaveBeenCalledWith(`/movies/${movieId}/toggle-favorites`);
    });
  });

  describe('searchMovies', () => {
    test('should search movies with all parameters', async () => {
      const searchTerm = 'action';
      const genreId = '1';
      const sortBy = 'title';
      const orderBy = 'asc';

      const mockResponse = {
        data: {
          movies: [
            { _id: '1', title: 'Action Movie 1' },
            { _id: '2', title: 'Action Movie 2' },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await searchMovies(searchTerm, genreId, sortBy, orderBy);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/movies/search?query=action&genreId=1&sortBy=title&orderBy=asc'
      );
      expect(result).toEqual(mockResponse.data);
    });

    test('should search movies with empty parameters', async () => {
      const mockResponse = {
        data: {
          movies: [
            { _id: '1', title: 'Movie 1' },
            { _id: '2', title: 'Movie 2' },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await searchMovies();

      expect(mockedAxios.get).toHaveBeenCalledWith('/movies/search?');
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle search movies error', async () => {
      const mockError = {
        response: {
          data: { message: 'Search failed' },
          status: 500,
        },
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(searchMovies('test')).rejects.toEqual(mockError);
      expect(mockedAxios.get).toHaveBeenCalledWith('/movies/search?query=test');
    });
  });

  describe('addMovieRating', () => {
    test('should add movie rating successfully', async () => {
      const movieId = '1';
      const ratingData = { rating: 5, comment: 'Great movie!' };

      const mockResponse = {
        data: {
          message: 'Rating added successfully',
          rating: {
            _id: '1',
            movieId: '1',
            rating: 5,
            comment: 'Great movie!',
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await addMovieRating(movieId, ratingData);

      expect(mockedAxios.post).toHaveBeenCalledWith(`/movies/${movieId}/rate`, ratingData);
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle add movie rating error', async () => {
      const movieId = '999';
      const ratingData = { rating: 5, comment: 'Great movie!' };

      const mockError = {
        response: {
          data: { message: 'Movie not found' },
          status: 404,
        },
      };

      mockedAxios.post.mockRejectedValue(mockError);

      await expect(addMovieRating(movieId, ratingData)).rejects.toEqual(mockError);
      expect(mockedAxios.post).toHaveBeenCalledWith(`/movies/${movieId}/rate`, ratingData);
    });
  });

  describe('trackMovieView', () => {
    test('should track movie view successfully', async () => {
      const movieId = '1';

      const mockResponse = {
        data: {
          message: 'View tracked successfully',
          views: 101,
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await trackMovieView(movieId);

      expect(mockedAxios.post).toHaveBeenCalledWith(`/movies/${movieId}/view`);
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle track movie view error', async () => {
      const movieId = '999';

      const mockError = {
        response: {
          data: { message: 'Movie not found' },
          status: 404,
        },
      };

      mockedAxios.post.mockRejectedValue(mockError);

      await expect(trackMovieView(movieId)).rejects.toEqual(mockError);
      expect(mockedAxios.post).toHaveBeenCalledWith(`/movies/${movieId}/view`);
    });
  });
});
