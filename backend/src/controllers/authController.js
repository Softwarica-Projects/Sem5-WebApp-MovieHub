const AuthService = require('../services/AuthService');

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    async registerUser(req, res, next) {
        try {
            const user = await this.authService.registerUser(req.body);
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user
            });
        } catch (error) {
            next(error);
        }
    }

    async loginUser(req, res, next) {
        try {
            const result = await this.authService.loginUser(req.body);
            res.status(200).json({
                success: true,
                message: 'Login successful',
                token: result.token,
                role: result.user.role,
                id: result.user.id,
                name: result.user.name,
                email: result.user.email
            });
        } catch (error) {
            next(error);
        }
    }

    async loginAdmin(req, res, next) {
        try {
            const result = await this.authService.loginAdmin(req.body);
            res.status(200).json({
                success: true,
                message: 'Admin login successful',
                token: result.token,
                role: result.user.role,
                id: result.user.id,
                name: result.user.name,
                email: result.user.email
            });
        } catch (error) {
            next(error);
        }
    }

    async changePassword(req, res, next) {
        try {
            const result = await this.authService.changePassword(req.user.id, req.body);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    async getFavoriteMovies(req, res, next) {
        try {
            const favorites = await this.authService.getFavoriteMovies(req.user.id);
            res.status(200).json(favorites);
        } catch (error) {
            next(error);
        }
    }

    async getMe(req, res, next) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const user = await this.authService.getUserProfile(req.user.id);

            res.status(200).json({
                success: true,
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image ? `${basePath}${user.image}` : null,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
            const result = await this.authService.updateUserProfile(req.user.id, req.body, imagePath);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }
}

const authController = new AuthController();

module.exports = {
    registerUser: authController.registerUser.bind(authController),
    loginUser: authController.loginUser.bind(authController),
    loginAdmin: authController.loginAdmin.bind(authController),
    changePassword: authController.changePassword.bind(authController),
    getFavoriteMovies: authController.getFavoriteMovies.bind(authController),
    getMe: authController.getMe.bind(authController),
    updateProfile: authController.updateProfile.bind(authController)
};