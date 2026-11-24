import { useState, useEffect } from 'react'
import { BookmarkIcon } from '@heroicons/react/24/outline'
import NewsGrid from '../components/news/NewsGrid'
import { useAuth } from '../context/AuthContext'

export default function BookmarksPage() {
  const { bookmarkedArticles } = useAuth()

  // Map to card-compatible shape
  const articles = bookmarkedArticles.map((a) => ({
    url: a.url,
    title: a.title,
    description: a.description,
    urlToImage: a.urlToImage,
    source: { name: a.source },
    publishedAt: a.publishedAt,
    category: a.category,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookmarkIcon className="w-8 h-8 text-blue-500" />
        <div>
          <h1 className="text-2xl font-bold">Bookmarks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{articles.length} saved articles</p>
        </div>
      </div>

      <NewsGrid articles={articles} loading={false} emptyMessage="No bookmarks yet! Bookmark articles to read them later." />
    </div>
  )
}
