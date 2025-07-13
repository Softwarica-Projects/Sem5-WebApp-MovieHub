const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const { JWT_SECRET } = require('../config/jwtConfig');
const { ValidationException, NotFoundException, ConflictException, UnauthorizedException } = require('../exceptions');
const Roles = require('../enums/roles.enum');
const RegexConstants = require('../constants/regex.constants');

class AuthService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    validateEmail(email) {
        if (!email) {
            throw new ValidationException('Email is required', 'email');
        }
        if (!RegexConstants.EMAIL.test(email)) {
            throw new ValidationException('Please enter a valid email address', 'email');
        }
    }

    validatePassword(password) {
        if (!password) {
            throw new ValidationException('Password is required', 'password');
        }
        if (password.length < 6) {
            throw new ValidationException('Password must be at least 6 characters long', 'password');
        }
    }

    validateName(name) {
        if (!name) {
            throw new ValidationException('Name is required', 'name');
        }
        if (name.trim().length < 2) {
            throw new ValidationException('Name must be at least 2 characters long', 'name');
        }
    }

    validateUserData(userData) {
        const { name, email, password } = userData;
        this.validateName(name);
        this.validateEmail(email);
        this.validatePassword(password);
    }

    async registerUser(userData) {
        const { name, email, password } = userData;
        this.validateName(name);
        this.validateEmail(email);
        this.validatePassword(password);

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.userRepository.create({
            name: name.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
            role: Roles.USER
        });

        const { password: _, ...userWithoutPassword } = newUser.toObject();
        return userWithoutPassword;
    }

    async loginUser(credentials) {
        const { email, password } = credentials;

        this.validateEmail(email);
        this.validatePassword(password);

        const user = await this.userRepository.findByEmail(email.toLowerCase());
        if (!user) {
            throw new ValidationException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ValidationException('Invalid email or password');
        }

        const token = jwt.sign(
            { id: user._id, name: user.name, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }

    async loginAdmin(credentials) {
        const { email, password } = credentials;

        this.validateEmail(email);
        this.validatePassword(password);

        const admin = await this.userRepository.findByEmail(email.toLowerCase());
        if (!admin || admin.role !== Roles.ADMIN) {
            throw new ValidationException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            throw new ValidationException('Invalid email or password');
        }

        const token = jwt.sign(
            { id: admin._id, name: admin.name, role: admin.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            message: 'Admin login successful',
            token,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        };
    }

    async changePassword(userId, passwordData) {
        const { oldPassword, newPassword } = passwordData;

        this.validatePassword(oldPassword);
        this.validatePassword(newPassword);

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User', userId);
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            throw new ValidationException('Old password is incorrect');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await this.userRepository.updateById(userId, { password: hashedNewPassword });

        return { message: 'Password changed successfully' };
    }

    async getUserProfile(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User', userId);
        }

        const { password: _, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
    }

    async updateUserProfile(userId, profileData, imagePath = null) {
        const { name, email } = profileData;

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User', userId);
        }

        const updateData = {};

        if (name !== undefined) {
            this.validateName(name);
            updateData.name = name.trim();
        }

        if (email !== undefined) {
            this.validateEmail(email);
            const normalizedEmail = email.toLowerCase();
            
            if (normalizedEmail !== user.email) {
                const existingUser = await this.userRepository.findByEmailExcludingId(normalizedEmail, userId);
                if (existingUser) {
                    throw new ConflictException('Email already exists');
                }
            }
            updateData.email = normalizedEmail;
        }

        if (imagePath) {
            updateData.image = imagePath;
        }

        await this.userRepository.updateById(userId, updateData);

        return { message: 'Profile updated successfully' };
    }

    async getFavoriteMovies(userId) {
        const user = await this.userRepository.getUserWithFavorites(userId);
        if (!user) {
            throw new NotFoundException('User', userId);
        }

        return user.favourites;
    }

    async addToFavorites(userId, movieId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User', userId);
        }

        await this.userRepository.addToFavorites(userId, movieId);
        return { message: 'Movie added to favorites' };
    }

    async removeFromFavorites(userId, movieId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User', userId);
        }

        await this.userRepository.removeFromFavorites(userId, movieId);
        return { message: 'Movie removed from favorites' };
    }
}

module.exports = AuthService;
