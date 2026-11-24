import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '../../context/AuthContext'
import {
  HeartIcon,
  BookmarkIcon,
  ShareIcon,
  SparklesIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid, BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid'
import AISummaryModal from './AISummaryModal'
import api from '../../services/api'

const categoryColors = {
  general: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  business: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  technology: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  entertainment: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
  health: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  science: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400',
  sports: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
}

export default function NewsCard({ article, category }) {
  const { user, isLiked, isBookmarked, toggleLike, toggleBookmark } = useAuth()
  const [showAI, setShowAI] = useState(false)
  const [localLikes, setLocalLikes] = useState(article.likesCount || 0)

  const articleUrl = article.url || article.articleUrl
  const liked = isLiked(articleUrl)
  const bookmarked = isBookmarked(articleUrl)

  const handleLike = async () => {
    const wasLiked = liked
    await toggleLike({ ...article, url: articleUrl, category })
    setLocalLikes((prev) => wasLiked ? prev - 1 : prev + 1)
  }

  const handleOpen = () => {
    api.post('/user/view', {
      articleUrl,
      title: article.title,
      description: article.description,
      urlToImage: article.urlToImage,
      source: article.source?.name || article.source,
      publishedAt: article.publishedAt,
      category,
    }).catch(() => {})
    window.open(articleUrl, '_blank', 'noopener,noreferrer')
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: article.title, url: articleUrl })
    } else {
      await navigator.clipboard.writeText(articleUrl)
      import('react-hot-toast').then(({ default: toast }) => toast.success('Link copied!'))
    }
  }

  const timeAgo = article.publishedAt
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
    : ''

  const sourceName = article.source?.name || article.source || 'Unknown'
  const catColor = categoryColors[category] || categoryColors.general

  return (
    <>
      <article className="card flex flex-col h-full animate-fade-in">
        {/* Image */}
        <div className="relative overflow-hidden h-48 bg-gray-100 dark:bg-gray-800 shrink-0">
          {article.urlToImage ? (
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${encodeURIComponent(article.title?.slice(0, 10))}/400/200` }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-gray-900">
              📰
            </div>
          )}
          {category && (
            <span className={`absolute top-2 left-2 badge ${catColor} capitalize text-xs font-semibold`}>
              {category}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5 flex items-center gap-1.5">
            <span className="font-medium text-gray-500 dark:text-gray-400">{sourceName}</span>
            {timeAgo && <><span>·</span><span>{timeAgo}</span></>}
          </p>

          <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug mb-2 line-clamp-3 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
            onClick={handleOpen}>
            {article.title}
          </h2>

          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 flex-1">
            {article.description || 'Click to read the full article.'}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1">
              {/* Like */}
              <button onClick={handleLike}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${liked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}>
                {liked ? <HeartSolid className="w-4 h-4" /> : <HeartIcon className="w-4 h-4" />}
                {localLikes > 0 && <span>{localLikes}</span>}
              </button>

              {/* Bookmark */}
              <button onClick={() => toggleBookmark({ ...article, url: articleUrl, category })}
                className={`p-1.5 rounded-lg text-xs transition-all ${bookmarked ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}>
                {bookmarked ? <BookmarkSolid className="w-4 h-4" /> : <BookmarkIcon className="w-4 h-4" />}
              </button>

              {/* Share */}
              <button onClick={handleShare} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                <ShareIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              {/* AI Summary */}
              <button onClick={() => setShowAI(true)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all">
                <SparklesIcon className="w-3.5 h-3.5" />
                AI
              </button>

              {/* Read */}
              <button onClick={handleOpen}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all">
                <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                Read
              </button>
            </div>
          </div>
        </div>
      </article>

      {showAI && (
        <AISummaryModal article={{ ...article, url: articleUrl }} onClose={() => setShowAI(false)} />
      )}
    </>
  )
}
