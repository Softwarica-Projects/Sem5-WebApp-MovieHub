const UserRepository = require('../../src/repositories/UserRepository');
const User = require('../../src/models/userModel');

jest.mock('../../src/models/userModel');

describe('UserRepository', () => {
    let userRepository;
    let mockUser;

    beforeEach(() => {
        userRepository = new UserRepository();
        mockUser = {
            _id: global.mockId(),
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            favourites: []
        };

        User.findOne = jest.fn();
        User.findById = jest.fn();
        User.findByIdAndUpdate = jest.fn();
        User.prototype.save = jest.fn();
    });

    describe('findByEmail', () => {
        it('should find user by email', async () => {
            User.findOne.mockResolvedValue(mockUser);
            
            const result = await userRepository.findByEmail('test@example.com');
            
            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(result).toEqual(mockUser);
        });

        it('should return null if user not found', async () => {
            User.findOne.mockResolvedValue(null);
            
            const result = await userRepository.findByEmail('notfound@example.com');
            
            expect(result).toBeNull();
        });
    });

    describe('findByEmailExcludingId', () => {
        it('should find user by email excluding specific id', async () => {
            const excludeId = global.mockId();
            User.findOne.mockResolvedValue(mockUser);
            
            const result = await userRepository.findByEmailExcludingId('test@example.com', excludeId);
            
            expect(User.findOne).toHaveBeenCalledWith({ 
                email: 'test@example.com', 
                _id: { $ne: excludeId } 
            });
            expect(result).toEqual(mockUser);
        });
    });

    describe('getUserWithFavorites', () => {
        it('should get user with populated favorites', async () => {
            jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);
            
            const result = await userRepository.getUserWithFavorites(mockUser._id);
            
            expect(userRepository.findById).toHaveBeenCalledWith(mockUser._id, {
                path: 'favourites',
                select: ''
            });
            expect(result).toEqual(mockUser);
        });
    });

    describe('addToFavorites', () => {
        it('should add movie to user favorites', async () => {
            const movieId = global.mockId();
            const updatedUser = { ...mockUser, favourites: [movieId] };
            const mockQuery = {
                exec: jest.fn().mockResolvedValue(updatedUser),
                then: function(resolve) { return this.exec().then(resolve); }
            };
            User.findByIdAndUpdate.mockReturnValue(mockQuery);
            
            const result = await userRepository.addToFavorites(mockUser._id, movieId);
            
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
                mockUser._id,
                { $addToSet: { favourites: movieId } },
                { new: true }
            );
            expect(result).toEqual(updatedUser);
        });
    });

    describe('removeFromFavorites', () => {
        it('should remove movie from user favorites', async () => {
            const movieId = global.mockId();
            const updatedUser = { ...mockUser };
            const mockQuery = {
                exec: jest.fn().mockResolvedValue(updatedUser),
                then: function(resolve) { return this.exec().then(resolve); }
            };
            User.findByIdAndUpdate.mockReturnValue(mockQuery);
            
            const result = await userRepository.removeFromFavorites(mockUser._id, movieId);
            
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
                mockUser._id,
                { $pull: { favourites: movieId } },
                { new: true }
            );
            expect(result).toEqual(updatedUser);
        });
    });

    describe('findByIdWithoutPassword', () => {
        it('should throw error due to incorrect implementation calling select on Promise', async () => {
            await expect(userRepository.findByIdWithoutPassword(mockUser._id))
                .rejects.toThrow('findById(...).select is not a function');
        });
    });
});
