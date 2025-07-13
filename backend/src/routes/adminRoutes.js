const express = require('express');
const AdminController = require('../controllers/adminController');
const User = require('../models/userModel');
const { authenticateToken } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const Roles = require('../enums/roles.enum');

const router = express.Router();
const adminController = new AdminController(User);

/**
 * @swagger
 * /admin/list:
 *   get:
 *     summary: Get a list of all admins
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 admins:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.get('/list', authenticateToken, roleMiddleware('admin'), adminController.getAdmins.bind(adminController));

/**
 * @swagger
 * /admin/{adminId}:
 *   delete:
 *     summary: Delete an admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adminId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the admin to delete
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.delete('/:adminId', authenticateToken, roleMiddleware('admin'), adminController.deleteAdmin.bind(adminController));

/**
 * @swagger
 * /admin/{adminId}:
 *   patch:
 *     summary: Update an admin's details (name or email)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adminId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the admin to update
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
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       404:
 *         description: Admin not found
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.patch('/:adminId', authenticateToken, roleMiddleware('admin'), adminController.updateAdmin.bind(adminController));
/**
 * @swagger
 * /admin/all-users:
 *   get:
 *     summary: Get a list of all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.get('/all-users', adminController.getAllUsers.bind(adminController));


/**
 * @swagger
 * /auth/add-admin:
 *   post:
 *     summary: Add a new admin
 *     tags: [Auth]
 */
router.post('/add-admin', authenticateToken, roleMiddleware(Roles.ADMIN), adminController.addAdmin.bind(adminController));
module.exports = router;