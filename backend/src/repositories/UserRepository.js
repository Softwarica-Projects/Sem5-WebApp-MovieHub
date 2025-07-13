const BaseRepository = require('./BaseRepository');
const User = require('../models/userModel');

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        return await this.findOne({ email });
    }

    async findByEmailExcludingId(email, excludeId) {
        return await this.findOne({ email, _id: { $ne: excludeId } });
    }

    async getUserWithFavorites(userId) {
        return await this.findById(userId, {
            path: 'favourites',
            select: ''
        });
    }

    async addToFavorites(userId, movieId) {
        return await this.updateById(userId, {
            $addToSet: { favourites: movieId }
        });
    }

    async removeFromFavorites(userId, movieId) {
        return await this.updateById(userId, {
            $pull: { favourites: movieId }
        });
    }

    async findByIdWithoutPassword(id) {
        return await this.findById(id).select('-password -__v');
    }
}

module.exports = UserRepository;
