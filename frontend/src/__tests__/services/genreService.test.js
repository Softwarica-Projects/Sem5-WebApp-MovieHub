import axios from '../../config/axiosConfig';
import {
  createGenre,
  getGenres,
  getGenreById,
  updateGenre,
  deleteGenre,
} from '../../services/genreService';

jest.mock('../../config/axiosConfig');
const mockedAxios = axios;

describe('genreService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createGenre', () => {
    test('should create genre successfully', async () => {
      const genreData = new FormData();
      genreData.append('name', 'Action');
      genreData.append('description', 'Action movies');

      const mockResponse = {
        data: {
          message: 'Genre created successfully',
          genre: {
            _id: '1',
            name: 'Action',
            description: 'Action movies',
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await createGenre(genreData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/genres', genreData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle create genre error', async () => {
      const genreData = new FormData();
      genreData.append('name', 'Action');

      const mockError = {
        response: {
          data: { message: 'Genre already exists' },
          status: 400,
        },
      };

      mockedAxios.post.mockRejectedValue(mockError);

      await expect(createGenre(genreData)).rejects.toEqual(mockError);
      expect(mockedAxios.post).toHaveBeenCalledWith('/genres', genreData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    });
  });

  describe('getGenres', () => {
    test('should fetch all genres successfully', async () => {
      const mockResponse = {
        data: {
          genres: [
            { _id: '1', name: 'Action', description: 'Action movies' },
            { _id: '2', name: 'Comedy', description: 'Comedy movies' },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getGenres();

      expect(mockedAxios.get).toHaveBeenCalledWith('/genres');
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle get genres error', async () => {
      const mockError = {
        response: {
          data: { message: 'Failed to fetch genres' },
          status: 500,
        },
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(getGenres()).rejects.toEqual(mockError);
      expect(mockedAxios.get).toHaveBeenCalledWith('/genres');
    });
  });

  describe('getGenreById', () => {
    test('should fetch genre by id successfully', async () => {
      const genreId = '1';
      const mockResponse = {
        data: {
          genre: {
            _id: '1',
            name: 'Action',
            description: 'Action movies',
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getGenreById(genreId);

      expect(mockedAxios.get).toHaveBeenCalledWith(`/genres/${genreId}`);
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle get genre by id error', async () => {
      const genreId = '999';
      const mockError = {
        response: {
          data: { message: 'Genre not found' },
          status: 404,
        },
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(getGenreById(genreId)).rejects.toEqual(mockError);
      expect(mockedAxios.get).toHaveBeenCalledWith(`/genres/${genreId}`);
    });
  });

  describe('updateGenre', () => {
    test('should update genre successfully', async () => {
      const genreId = '1';
      const genreData = new FormData();
      genreData.append('name', 'Updated Action');
      genreData.append('description', 'Updated action movies');

      const mockResponse = {
        data: {
          message: 'Genre updated successfully',
          genre: {
            _id: '1',
            name: 'Updated Action',
            description: 'Updated action movies',
          },
        },
      };

      mockedAxios.put.mockResolvedValue(mockResponse);

      const result = await updateGenre(genreId, genreData);

      expect(mockedAxios.put).toHaveBeenCalledWith(`/genres/${genreId}`, genreData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle update genre error', async () => {
      const genreId = '1';
      const genreData = new FormData();
      genreData.append('name', 'Updated Action');

      const mockError = {
        response: {
          data: { message: 'Genre not found' },
          status: 404,
        },
      };

      mockedAxios.put.mockRejectedValue(mockError);

      await expect(updateGenre(genreId, genreData)).rejects.toEqual(mockError);
      expect(mockedAxios.put).toHaveBeenCalledWith(`/genres/${genreId}`, genreData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    });
  });

  describe('deleteGenre', () => {
    test('should delete genre successfully', async () => {
      const genreId = '1';
      const mockResponse = {
        data: {
          message: 'Genre deleted successfully',
        },
      };

      mockedAxios.delete.mockResolvedValue(mockResponse);

      const result = await deleteGenre(genreId);

      expect(mockedAxios.delete).toHaveBeenCalledWith(`/genres/${genreId}`);
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle delete genre error', async () => {
      const genreId = '999';
      const mockError = {
        response: {
          data: { message: 'Genre not found' },
          status: 404,
        },
      };

      mockedAxios.delete.mockRejectedValue(mockError);

      await expect(deleteGenre(genreId)).rejects.toEqual(mockError);
      expect(mockedAxios.delete).toHaveBeenCalledWith(`/genres/${genreId}`);
    });

    test('should handle delete genre with movies error', async () => {
      const genreId = '1';
      const mockError = {
        response: {
          data: { message: 'Cannot delete genre with associated movies' },
          status: 400,
        },
      };

      mockedAxios.delete.mockRejectedValue(mockError);

      await expect(deleteGenre(genreId)).rejects.toEqual(mockError);
      expect(mockedAxios.delete).toHaveBeenCalledWith(`/genres/${genreId}`);
    });
  });
});
