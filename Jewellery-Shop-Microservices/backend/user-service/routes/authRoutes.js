const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { auth, adminOnly } = require('../middleware/auth');

// Public routes
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'customer']).withMessage('Role must be admin or customer')
], authController.register);

router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], authController.login);

// Protected routes
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);

// Admin routes
router.get('/', auth, adminOnly, authController.getAllUsers);
router.put('/:id/status', auth, adminOnly, authController.toggleUserStatus);
router.delete('/:id', auth, adminOnly, authController.deleteUser);

module.exports = router;
