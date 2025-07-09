const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const authController = require('../controllers/authController');
const Roles = require('../enums/roles.enum');
const upload = require('../middlewares/uploadMiddleware');

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

/**
 * @swagger
 * /auth/admin/login:
 *   post:
 *     summary: Login an admin
 *     tags: [Auth]
 */
router.post('/admin/login', authController.loginAdmin);
/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change the user's password
 *     tags: [Auth]
 */
router.post('/change-password', authenticateToken, authController.changePassword);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the logged-in user's information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: Server error
 */
router.get('/me', authenticateToken, authController.getMe);

/**
 * @swagger
 * /auth/update-profile:
 *   put:
 *     summary: Update user profile information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     image:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Bad request - Email already exists
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/update-profile', authenticateToken,upload.single('image'), authController.updateProfile);

/**
 * @swagger
 * /auth/favorites:
 *   get:
 *     summary: Get the list of favorite movies for the logged-in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of favorite movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 favourites:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/favorites', authenticateToken, authController.getFavoriteMovies);

module.exports = router;