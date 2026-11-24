const express = require('express');
const router = express.Router();
const { getHeadlines, searchNews, getTrending, getCategories, getForYou } = require('../controllers/newsController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/categories', getCategories);
router.get('/headlines', getHeadlines);
router.get('/search', searchNews);
router.get('/trending', getTrending);
router.get('/for-you', protect, getForYou);

module.exports = router;
