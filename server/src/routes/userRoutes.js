const express = require('express');
const router = express.Router();
const { toggleLike, toggleBookmark, getBookmarks, trackView, getHistory, getArticleStats } = require('../controllers/userController');
const { protect, optionalAuth } = require('../middleware/auth');

router.post('/like', protect, toggleLike);
router.post('/bookmark', protect, toggleBookmark);
router.get('/bookmarks', protect, getBookmarks);
router.post('/view', optionalAuth, trackView);
router.get('/history', protect, getHistory);
router.get('/stats', optionalAuth, getArticleStats);

module.exports = router;
