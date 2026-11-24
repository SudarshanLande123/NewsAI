const User = require('../models/User');
const ArticleStats = require('../models/ArticleStats');

// @desc    Like / Unlike article
// @route   POST /api/user/like
exports.toggleLike = async (req, res) => {
  try {
    const { articleUrl, title, description, urlToImage, source, publishedAt, category } = req.body;

    if (!articleUrl) {
      return res.status(400).json({ success: false, message: 'Article URL required' });
    }

    const user = await User.findById(req.user.id);
    const isLiked = user.likedArticles.includes(articleUrl);

    if (isLiked) {
      user.likedArticles = user.likedArticles.filter((url) => url !== articleUrl);
    } else {
      user.likedArticles.push(articleUrl);
    }
    await user.save();

    // Update article stats
    await ArticleStats.findOneAndUpdate(
      { articleUrl },
      {
        $set: { title, description, urlToImage, source, publishedAt, category },
        $inc: { likesCount: isLiked ? -1 : 1 },
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, liked: !isLiked, likedArticles: user.likedArticles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Bookmark / Unbookmark article
// @route   POST /api/user/bookmark
exports.toggleBookmark = async (req, res) => {
  try {
    const { articleUrl, title, description, urlToImage, source, publishedAt, category } = req.body;

    const user = await User.findById(req.user.id);
    const isBookmarked = user.bookmarkedArticles.some((a) => a.url === articleUrl);

    if (isBookmarked) {
      user.bookmarkedArticles = user.bookmarkedArticles.filter((a) => a.url !== articleUrl);
    } else {
      user.bookmarkedArticles.push({ url: articleUrl, title, description, urlToImage, source, publishedAt, category });
    }
    await user.save();

    res.json({ success: true, bookmarked: !isBookmarked, bookmarkedArticles: user.bookmarkedArticles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get user bookmarks
// @route   GET /api/user/bookmarks
exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, bookmarks: user.bookmarkedArticles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Track article view + add to history
// @route   POST /api/user/view
exports.trackView = async (req, res) => {
  try {
    const { articleUrl, title, description, urlToImage, source, publishedAt, category } = req.body;

    // Update article stats
    await ArticleStats.findOneAndUpdate(
      { articleUrl },
      {
        $set: { title, description, urlToImage, source, publishedAt, category },
        $inc: { viewsCount: 1 },
      },
      { upsert: true, new: true }
    );

    // Add to read history (keep last 50)
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          readHistory: {
            $each: [{ url: articleUrl, title }],
            $slice: -50,
          },
        },
      });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get read history
// @route   GET /api/user/history
exports.getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, history: user.readHistory.reverse() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get article stats (likes/views)
// @route   GET /api/user/stats?url=...
exports.getArticleStats = async (req, res) => {
  try {
    const { url } = req.query;
    const stats = await ArticleStats.findOne({ articleUrl: url });
    const user = req.user ? await User.findById(req.user.id) : null;

    res.json({
      success: true,
      likesCount: stats?.likesCount || 0,
      viewsCount: stats?.viewsCount || 0,
      isLiked: user ? user.likedArticles.includes(url) : false,
      isBookmarked: user ? user.bookmarkedArticles.some((a) => a.url === url) : false,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
