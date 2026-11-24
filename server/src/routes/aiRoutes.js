const express = require('express');
const router = express.Router();
const { summarizeArticle, askAboutArticle, generateTags } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/summarize', protect, summarizeArticle);
router.post('/ask', protect, askAboutArticle);
router.post('/tags', protect, generateTags);

module.exports = router;
