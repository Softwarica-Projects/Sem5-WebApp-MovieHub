const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Roles = require('../enums/roles.enum');

const JWT_SECRET = 'MY_JWT_SCRET';

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

// User Login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.role !== Roles.USER) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token, role: user.role, id: user._id, name: user.name, });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Admin Login
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

        res.status(200).json({ message: 'Admin login successful', token, role: admin.role, id: admin._id, name: admin.name, });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

