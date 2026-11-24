const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 600 }); // 10 min cache

const NEWS_API_BASE = 'https://newsapi.org/v2';
const CATEGORIES = ['general', 'business', 'technology', 'entertainment', 'health', 'science', 'sports'];

const fetchNews = async (params) => {
  const cacheKey = JSON.stringify(params);
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const response = await axios.get(`${NEWS_API_BASE}/${params.endpoint}`, {
    params: {
      apiKey: process.env.NEWS_API_KEY,
      ...params.query,
    },
  });

  cache.set(cacheKey, response.data);
  return response.data;
};

// @desc    Get top headlines by category
// @route   GET /api/news/headlines?category=technology&page=1
exports.getHeadlines = async (req, res) => {
  try {
    const { category = 'general', page = 1, pageSize = 12, country = 'us' } = req.query;

    const data = await fetchNews({
      endpoint: 'top-headlines',
      query: { category, page, pageSize, country },
    });

    res.json({ success: true, ...data, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Search news
// @route   GET /api/news/search?q=keyword&page=1
exports.searchNews = async (req, res) => {
  try {
    const { q, page = 1, pageSize = 12, sortBy = 'publishedAt', from, to } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query required' });
    }

    const data = await fetchNews({
      endpoint: 'everything',
      query: { q, page, pageSize, sortBy, from, to, language: 'en' },
    });

    res.json({ success: true, ...data, query: q });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get trending news (most liked from ArticleStats)
// @route   GET /api/news/trending
exports.getTrending = async (req, res) => {
  try {
    const ArticleStats = require('../models/ArticleStats');
    const trending = await ArticleStats.find()
      .sort({ likesCount: -1, viewsCount: -1 })
      .limit(10)
      .lean();

    res.json({ success: true, articles: trending });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all categories
// @route   GET /api/news/categories
exports.getCategories = async (req, res) => {
  res.json({ success: true, categories: CATEGORIES });
};

// @desc    Get news for user preferences
// @route   GET /api/news/for-you  (protected)
exports.getForYou = async (req, res) => {
  try {
    const categories = req.user?.preferences?.categories || ['general', 'technology'];
    const promises = categories.slice(0, 3).map((cat) =>
      fetchNews({
        endpoint: 'top-headlines',
        query: { category: cat, pageSize: 5, country: 'us' },
      })
    );

    const results = await Promise.all(promises);
    const articles = results.flatMap((r) => r.articles || []);

    res.json({ success: true, articles, totalResults: articles.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
