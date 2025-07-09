const express = require('express');
const MovieController = require('../controllers/movieController');
const Movie = require('../models/movieModel');
const authenticateToken = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();
const movieController = new MovieController(Movie);

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: List of movies
 */
router.get('/', movieController.getMovies.bind(movieController)); 

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: Movie details
 */
router.get('/:id/detail', movieController.getMovieById.bind(movieController));

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Add a new movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *               genre:
 *                 type: string
 *                 description: Genre ID
 *               trailerLink:
 *                 type: string
 *               movieLink:
 *                 type: string
 *               cast:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     type:
 *                       type: string
 *               coverImage:
 *                 type: string
 *                 format: binary
 *               runtime:
 *                 type: integer
 *                 description: Runtime of the movie in minutes
 *     responses:
 *       201:
 *         description: Movie added successfully
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, roleMiddleware('admin'), upload.single('coverImage'), movieController.createMovie.bind(movieController));

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update an existing movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *               genre:
 *                 type: string
 *                 description: Genre ID
 *               trailerLink:
 *                 type: string
 *               movieLink:
 *                 type: string
 *               cast:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     type:
 *                       type: string
 *               coverImage:
 *                 type: string
 *                 format: binary
 *               runtime:
 *                 type: integer
 *                 description: Runtime of the movie in minutes
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticateToken, roleMiddleware('admin'), upload.single('coverImage'), movieController.updateMovie.bind(movieController));

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete a movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The movie ID
 *     responses:
 *       204:
 *         description: Movie deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateToken, roleMiddleware('admin'), movieController.deleteMovie.bind(movieController));

/**
 * @swagger
 * /movies/{movieId}/rate:
 *   post:
 *     summary: Rate a movie with a review
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the movie to rate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               review:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rating submitted successfully
 *       400:
 *         description: Invalid rating or other validation error
 *       403:
 *         description: Access denied
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.post('/:movieId/rate', authenticateToken, movieController.rateMovie.bind(movieController));

/**
 * @swagger
 * /movies/{movieId}/view:
 *   post:
 *     summary: Record a view for a movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the movie to view
 *     responses:
 *       200:
 *         description: Movie view recorded
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.post('/:movieId/view', authenticateToken, movieController.viewMovie.bind(movieController));

/**
 * @swagger
 * /movies/featured:
 *   get:
 *     summary: Get top 5 featured movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: List of featured movies
 *       500:
 *         description: Server error
 */
router.get('/featured-movies', movieController.getFeaturedMovies.bind(movieController));

/**
 * @swagger
 * /movies/recent:
 *   get:
 *     summary: Get top 5 recently added movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: List of recently added movies
 *       500:
 *         description: Server error
 */
router.get('/recent', movieController.getRecentlyAddedMovies.bind(movieController));

/**
 * @swagger
 * /movies/top-viewed:
 *   get:
 *     summary: Get top 5 mostly viewed movies (unique views per user)
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: List of top viewed movies
 *       500:
 *         description: Server error
 */
router.get('/top-viewed', movieController.getTopViewedMovies.bind(movieController));

/**
 * @swagger
 * /movies/soon-releasing:
 *   get:
 *     summary: Get top 5 soon-to-be-released movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: List of soon-to-be-released movies
 *       500:
 *         description: Server error
 */
router.get('/soon-releasing', movieController.getSoonReleasingMovies.bind(movieController));

/**
 * @swagger
 * /movies/{movieId}/featured:
 *   patch:
 *     summary: Toggle the featured status of a movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the movie to toggle featured status
 *     responses:
 *       200:
 *         description: Movie featured status updated
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.patch('/:movieId/featured', authenticateToken, roleMiddleware('admin'), movieController.toggleFeatured.bind(movieController));

/**
 * @swagger
 * /movies/{movieId}/toggle-favorite:
 *   post:
 *     summary: Toggle a movie as a favorite for the logged-in user
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the movie to toggle as a favorite
 *     responses:
 *       200:
 *         description: Successfully toggled the favorite status of the movie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User or movie not found
 *       500:
 *         description: Server error
 */
router.post('/:movieId/toggle-favorites', authenticateToken, movieController.toggleFavorite.bind(movieController));

/**
 * @swagger
 * /movies/search:
 *   get:
 *     summary: Search movies by title and/or genre
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: false
 *         description: The movie title to search for
 *       - in: query
 *         name: genreId
 *         schema:
 *           type: string
 *         required: false
 *         description: The genre ID to filter by
 *     responses:
 *       200:
 *         description: List of movies matching the search
 */
router.get('/search', movieController.searchMovies.bind(movieController));

module.exports = router;