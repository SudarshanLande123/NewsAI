import { useState, useEffect } from 'react'
import { FireIcon } from '@heroicons/react/24/solid'
import NewsGrid from '../components/news/NewsGrid'
import api from '../services/api'

export default function TrendingPage() {
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrending()
  }, [])

  const fetchTrending = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/news/trending')
      // Map to card-compatible shape
      const articles = (data.articles || []).map((a) => ({
        url: a.articleUrl,
        title: a.title,
        description: a.description,
        urlToImage: a.urlToImage,
        source: { name: a.source },
        publishedAt: a.publishedAt,
        category: a.category,
        likesCount: a.likesCount,
      }))
      setTrending(articles)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FireIcon className="w-8 h-8 text-orange-500" />
        <div>
          <h1 className="text-2xl font-bold">Trending Now</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Most liked and viewed articles</p>
        </div>
      </div>

      <NewsGrid
        articles={trending}
        loading={loading}
        emptyMessage="No trending articles yet. Like some articles to see them here!"
      />
    </div>
  )
}
