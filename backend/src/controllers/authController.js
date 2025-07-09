const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Roles = require('../enums/roles.enum');
const Movie = require('../models/movieModel');

const { JWT_SECRET } = require('../config/jwtConfig');
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role: Roles.USER });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token, role: user.role, id: user._id, name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await User.findOne({ email });
        if (!admin || admin.role !== Roles.ADMIN) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: admin._id, name: admin.name, role: admin.role }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Admin login successful', token, role: admin.role, id: admin._id, name: admin.name, email: admin.email });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getFavoriteMovies = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate({
            path: 'favourites',
            select: '',
        });
        res.status(200).json(user.favourites);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const basePath = `${req.protocol}://${req.get('host')}`;
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password -__v');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image ? `${basePath}${user.image}` : null,
        });
    } catch (error) {
        console.error('Error retrieving user information:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const image = req.file ? `/uploads/${req.file.filename}` : null;
        const userId = req.user.id;
        const { name, email } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }
        if (name) user.name = name;
        if (email) user.email = email;
        if (image) user.image = image;
        await user.save();
        res.status(200).json({
            message: 'Profile updated successfully',

        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    registerUser: exports.registerUser,
    loginUser: exports.loginUser,
    loginAdmin: exports.loginAdmin,
    changePassword: exports.changePassword,
    getFavoriteMovies: exports.getFavoriteMovies,
    getMe,
    updateProfile
};