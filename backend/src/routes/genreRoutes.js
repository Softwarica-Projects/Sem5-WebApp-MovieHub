const express = require('express');
const GenreController = require('../controllers/genreController');
const Genre = require('../models/genreModel');
const authenticateToken = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();
const genreController = new GenreController(Genre);

/**
 * @swagger
 * /genres:
 *   get:
 *     summary: Get all genres
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: List of genres
 */
router.get('/', genreController.getGenres.bind(genreController));

/**
 * @swagger
 * /genres/{id}:
 *   get:
 *     summary: Get a genre by ID
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The genre ID
 *     responses:
 *       200:
 *         description: Genre details
 *       404:
 *         description: Genre not found
 */
router.get('/:id', genreController.getGenreById.bind(genreController));

/**
 * @swagger
 * /genres:
 *   post:
 *     summary: Create a new genre
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Genre created successfully
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, roleMiddleware('admin'), upload.single('image'), genreController.createGenre.bind(genreController));

/**
 * @swagger
 * /genres/{id}:
 *   put:
 *     summary: Update a genre
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The genre ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Genre updated successfully
 *       404:
 *         description: Genre not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticateToken, roleMiddleware('admin'), upload.single('image'), genreController.updateGenre.bind(genreController));

/**
 * @swagger
 * /genres/{id}:
 *   delete:
 *     summary: Delete a genre
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The genre ID
 *     responses:
 *       200:
 *         description: Genre deleted successfully
 *       404:
 *         description: Genre not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateToken, roleMiddleware('admin'), genreController.deleteGenre.bind(genreController));

module.exports = router;