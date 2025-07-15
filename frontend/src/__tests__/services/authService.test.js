import axios from '../../config/axiosConfig';
import { registerUser, loginUser, getFavouriteMovies } from '../../services/authService';
jest.mock('../../config/axiosConfig');
const mockedAxios = axios;

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    test('should register user successfully', async () => {
      const userData = {
        name: 'Rishan Shrestha',
        email: 'rishan@gmail.com',
        password: 'password123',
      };

      const mockResponse = {
        data: {
          message: 'User registered successfully',
          user: { id: '123', name: 'Rishan Shrestha', email: 'rishan@gmail.com' },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await registerUser(userData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle registration error', async () => {
      const userData = {
        name: 'Rishan Shrestha',
        email: 'rishan@gmail.com',
        password: 'password123',
      };

      const mockError = {
        response: {
          data: { message: 'Email already exists' },
          status: 400,
        },
      };

      mockedAxios.post.mockRejectedValue(mockError);

      await expect(registerUser(userData)).rejects.toEqual(mockError);
      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/register', userData);
    });
  });

  describe('loginUser', () => {
    test('should login user successfully', async () => {
      const credentials = {
        email: 'rishan@gmail.com',
        password: 'password123',
      };

      const mockResponse = {
        data: {
          token: 'jwt-token',
          id: '123',
          name: 'Rishan Shrestha',
          role: 'user',
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await loginUser(credentials);

      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle login error', async () => {
      const credentials = {
        email: 'rishan@gmail.com',
        password: 'wrongpassword',
      };

      const mockError = {
        response: {
          data: { message: 'Invalid credentials' },
          status: 401,
        },
      };

      mockedAxios.post.mockRejectedValue(mockError);

      await expect(loginUser(credentials)).rejects.toEqual(mockError);
      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/login', credentials);
    });
  });

  describe('getFavouriteMovies', () => {
    test('should get favourite movies successfully', async () => {
      const mockResponse = {
        data: {
          favorites: [
            { id: '1', title: 'Movie 1' },
            { id: '2', title: 'Movie 2' },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getFavouriteMovies();

      expect(mockedAxios.get).toHaveBeenCalledWith('/auth/favorites');
      expect(result).toEqual(mockResponse.data);
    });
  });
});
