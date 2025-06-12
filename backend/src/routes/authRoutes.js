const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const authController = require('../controllers/authController');
const Roles = require('../enums/roles.enum');

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 */
router.post('/register', authController.registerUser);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 */
router.post('/login', authController.loginUser);

module.exports = router;