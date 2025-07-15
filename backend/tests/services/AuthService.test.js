const AuthService = require('../../src/services/AuthService');
const UserRepository = require('../../src/repositories/UserRepository');
const MovieRepository = require('../../src/repositories/MovieRepository');
const { ValidationException, ConflictException, NotFoundException } = require('../../src/exceptions');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../src/repositories/UserRepository');
jest.mock('../../src/repositories/MovieRepository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
    let authService;
    let mockUserRepository;
    let mockMovieRepository;
    let mockUser;

    beforeEach(() => {
        mockUserRepository = new UserRepository();
        mockMovieRepository = new MovieRepository();
        authService = new AuthService();
        authService.userRepository = mockUserRepository;
        authService.movieRepository = mockMovieRepository;

        mockUser = {
            _id: global.mockId(),
            name: 'Test User',
            email: 'test@gmail.com',
            password: 'hashedPassword',
            role: 'user',
            favourites: [],
            toObject: function() {
                return { 
                    _id: this._id, 
                    name: this.name, 
                    email: this.email, 
                    password: this.password, 
                    role: this.role, 
                    favourites: this.favourites 
                };
            }
        };
    });

    describe('validateUserData', () => {
        it('should validate valid user data', () => {
            const validData = {
                name: 'Rishan Shrestha',
                email: 'rishan@gmail.com',
                password: 'password123'
            };

            expect(() => authService.validateUserData(validData)).not.toThrow();
        });

        it('should throw ValidationException for missing name', () => {
            const invalidData = {
                email: 'rishan@gmail.com',
                password: 'password123'
            };

            expect(() => authService.validateUserData(invalidData)).toThrow(ValidationException);
        });

        it('should throw ValidationException for invalid email', () => {
            const invalidData = {
                name: 'Rishan Shrestha',
                email: 'invalid-email',
                password: 'password123'
            };

            expect(() => authService.validateUserData(invalidData)).toThrow(ValidationException);
        });

        it('should throw ValidationException for short password', () => {
            const invalidData = {
                name: 'Rishan Shrestha',
                email: 'rishan@gmail.com',
                password: '123'
            };

            expect(() => authService.validateUserData(invalidData)).toThrow(ValidationException);
        });
    });

    describe('registerUser', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                name: 'Rishan Shrestha',
                email: 'rishan@gmail.com',
                password: 'password123'
            };

            mockUserRepository.findByEmail.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedPassword');
            mockUserRepository.create.mockResolvedValue({
                toObject: () => ({
                    _id: expect.any(String),
                    name: 'Rishan Shrestha',
                    email: 'rishan@gmail.com',
                    role: 'user',
                    favourites: []
                })
            });

            const result = await authService.registerUser(userData);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
            expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
            expect(mockUserRepository.create).toHaveBeenCalledWith({
                name: userData.name,
                email: userData.email.toLowerCase(),
                password: 'hashedPassword',
                role: 'user'
            });
            expect(result).toEqual({
                _id: expect.any(String),
                name: userData.name,
                email: userData.email,
                role: 'user',
                favourites: []
            });
        });

        it('should throw ConflictException if user already exists', async () => {
            const userData = {
                name: 'Rishan Shrestha',
                email: 'rishan@gmail.com',
                password: 'password123'
            };

            mockUserRepository.findByEmail.mockResolvedValue(mockUser);

            await expect(authService.registerUser(userData)).rejects.toThrow(ConflictException);
        });
    });

    describe('loginUser', () => {
        it('should login user successfully', async () => {
            const credentials = {
                email: 'test@gmail.com',
                password: 'password123'
            };

            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mockToken');

            const result = await authService.loginUser(credentials);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(credentials.email);
            expect(bcrypt.compare).toHaveBeenCalledWith(credentials.password, mockUser.password);
            expect(jwt.sign).toHaveBeenCalled();
            expect(result).toEqual({
                message: 'Login successful',
                token: 'mockToken',
                user: {
                    id: mockUser._id,
                    name: mockUser.name,
                    email: mockUser.email,
                    role: mockUser.role
                }
            });
        });

        it('should throw ValidationException for invalid credentials', async () => {
            const credentials = {
                email: 'test@gmail.com',
                password: 'wrongPassword'
            };

            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await expect(authService.loginUser(credentials)).rejects.toThrow(ValidationException);
        });

        it('should throw ValidationException for non-existent user', async () => {
            const credentials = {
                email: 'nonexistent@gmail.com',
                password: 'password123'
            };

            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(authService.loginUser(credentials)).rejects.toThrow(ValidationException);
        });
    });

    describe('loginAdmin', () => {
        it('should login admin successfully', async () => {
            const adminUser = { ...mockUser, role: 'admin' };
            const credentials = {
                email: 'admin@gmail.com',
                password: 'password123'
            };

            mockUserRepository.findByEmail.mockResolvedValue(adminUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mockToken');

            const result = await authService.loginAdmin(credentials);

            expect(result).toEqual({
                message: 'Admin login successful',
                token: 'mockToken',
                user: {
                    id: adminUser._id,
                    name: adminUser.name,
                    email: adminUser.email,
                    role: adminUser.role
                }
            });
        });

        it('should throw ValidationException for non-admin user', async () => {
            const credentials = {
                email: 'test-user@gmail.com',
                password: 'password123'
            };

            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);

            await expect(authService.loginAdmin(credentials)).rejects.toThrow(ValidationException);
        });
    });

    describe('changePassword', () => {
        it('should change password successfully', async () => {
            const passwordData = {
                oldPassword: 'oldPassword',
                newPassword: 'newPassword123'
            };

            mockUserRepository.findById.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            bcrypt.hash.mockResolvedValue('newHashedPassword');
            mockUserRepository.updateById.mockResolvedValue(mockUser);

            const result = await authService.changePassword(mockUser._id, passwordData);

            expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUser._id);
            expect(bcrypt.compare).toHaveBeenCalledWith(passwordData.oldPassword, mockUser.password);
            expect(bcrypt.hash).toHaveBeenCalledWith(passwordData.newPassword, 10);
            expect(mockUserRepository.updateById).toHaveBeenCalledWith(mockUser._id, { password: 'newHashedPassword' });
            expect(result).toEqual({ message: 'Password changed successfully' });
        });

        it('should throw ValidationException for incorrect current password', async () => {
            const passwordData = {
                oldPassword: 'wrongPassword',
                newPassword: 'newPassword123'
            };

            mockUserRepository.findById.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await expect(authService.changePassword(mockUser._id, passwordData)).rejects.toThrow(ValidationException);
        });
    });

    describe('getUserProfile', () => {
        it('should get user profile successfully', async () => {
            mockUserRepository.findById.mockResolvedValue(mockUser);

            const result = await authService.getUserProfile(mockUser._id);

            expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUser._id);
            expect(result).toEqual({
                _id: mockUser._id,
                name: mockUser.name,
                email: mockUser.email,
                role: mockUser.role,
                favourites: mockUser.favourites
            });
        });

        it('should throw NotFoundException for non-existent user', async () => {
            mockUserRepository.findByIdWithoutPassword.mockResolvedValue(null);

            await expect(authService.getUserProfile(mockUser._id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateUserProfile', () => {
        it('should update user profile successfully', async () => {
            const profileData = {
                name: 'Updated Name',
                email: 'updated@gmail.com'
            };

            mockUserRepository.findById.mockResolvedValue(mockUser);
            mockUserRepository.findByEmailExcludingId.mockResolvedValue(null);
            mockUserRepository.updateById.mockResolvedValue({ ...mockUser, ...profileData });

            const result = await authService.updateUserProfile(mockUser._id, profileData);

            expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUser._id);
            expect(mockUserRepository.findByEmailExcludingId).toHaveBeenCalledWith(profileData.email, mockUser._id);
            expect(mockUserRepository.updateById).toHaveBeenCalledWith(mockUser._id, profileData);
            expect(result).toEqual({ message: 'Profile updated successfully' });
        });

        it('should throw ConflictException for existing email', async () => {
            const profileData = {
                name: 'Updated Name',
                email: 'existing@gmail.com'
            };

            mockUserRepository.findById.mockResolvedValue(mockUser);
            mockUserRepository.findByEmailExcludingId.mockResolvedValue({ _id: 'otherId' });

            await expect(authService.updateUserProfile(mockUser._id, profileData)).rejects.toThrow(ConflictException);
        });
    });

    describe('getFavoriteMovies', () => {
        it('should get favorite movies successfully', async () => {
            const movieId = global.mockId();
            const userWithFavorites = { ...mockUser, favourites: [{ _id: movieId }] };
            mockUserRepository.getUserWithFavorites.mockResolvedValue(userWithFavorites);

            const result = await authService.getFavoriteMovies(mockUser._id);

            expect(mockUserRepository.getUserWithFavorites).toHaveBeenCalledWith(mockUser._id);
            expect(result).toEqual(userWithFavorites.favourites);
        });
    });

    describe('addToFavorites', () => {
        it('should add movie to favorites successfully', async () => {
            const movieId = global.mockId();

            mockUserRepository.findById.mockResolvedValue(mockUser);
            mockUserRepository.addToFavorites.mockResolvedValue(mockUser);

            const result = await authService.addToFavorites(mockUser._id, movieId);

            expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUser._id);
            expect(mockUserRepository.addToFavorites).toHaveBeenCalledWith(mockUser._id, movieId);
            expect(result).toEqual({ message: 'Movie added to favorites' });
        });

        it('should throw NotFoundException for non-existent movie', async () => {
            const movieId = global.mockId();
            mockMovieRepository.findById.mockResolvedValue(null);

            await expect(authService.addToFavorites(mockUser._id, movieId)).rejects.toThrow(NotFoundException);
        });
    });

    describe('removeFromFavorites', () => {
        it('should remove movie from favorites successfully', async () => {
            const movieId = global.mockId();

            mockUserRepository.findById.mockResolvedValue(mockUser);
            mockUserRepository.removeFromFavorites.mockResolvedValue(mockUser);

            const result = await authService.removeFromFavorites(mockUser._id, movieId);

            expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUser._id);
            expect(mockUserRepository.removeFromFavorites).toHaveBeenCalledWith(mockUser._id, movieId);
            expect(result).toEqual({ message: 'Movie removed from favorites' });
        });

        it('should throw NotFoundException for non-existent movie', async () => {
            const movieId = global.mockId();
            mockMovieRepository.findById.mockResolvedValue(null);

            await expect(authService.removeFromFavorites(mockUser._id, movieId)).rejects.toThrow(NotFoundException);
        });
    });
});
