const mongoose = require('mongoose');

// Store article likes count in DB (keyed by article URL hash)
const articleStatsSchema = new mongoose.Schema(
  {
    articleUrl: {
      type: String,
      required: true,
      unique: true,
    },
    title: String,
    description: String,
    urlToImage: String,
    source: String,
    publishedAt: Date,
    category: String,
    likesCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ArticleStats', articleStatsSchema);
