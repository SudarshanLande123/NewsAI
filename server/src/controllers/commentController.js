const Comment = require('../models/Comment');
const ArticleStats = require('../models/ArticleStats');

// @desc    Get comments for article
// @route   GET /api/comments?url=...
exports.getComments = async (req, res) => {
  try {
    const { url, page = 1, limit = 20 } = req.query;
    if (!url) return res.status(400).json({ success: false, message: 'Article URL required' });

    const comments = await Comment.find({ articleUrl: url })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Comment.countDocuments({ articleUrl: url });

    res.json({ success: true, comments, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Add comment
// @route   POST /api/comments
exports.addComment = async (req, res) => {
  try {
    const { articleUrl, text } = req.body;
    if (!articleUrl || !text) {
      return res.status(400).json({ success: false, message: 'URL and text required' });
    }

    const comment = await Comment.create({ articleUrl, text, user: req.user.id });
    await comment.populate('user', 'name avatar');

    // Update comment count in stats
    await ArticleStats.findOneAndUpdate(
      { articleUrl },
      { $inc: { commentsCount: 1 } },
      { upsert: true }
    );

    res.status(201).json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
