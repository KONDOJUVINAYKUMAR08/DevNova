const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', auth, reviewController.createReview);
router.get('/product/:productId', reviewController.getProductReviews);
router.get('/stats', auth, adminOnly, reviewController.getReviewStats);
router.get('/', auth, adminOnly, reviewController.getAllReviews);
router.put('/:id', auth, reviewController.updateReview);
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;
