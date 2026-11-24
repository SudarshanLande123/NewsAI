import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import NewsGrid from '../components/news/NewsGrid'
import api from '../services/api'

const categoryEmojis = {
  general: '🌐', business: '💼', technology: '💻',
  entertainment: '🎬', health: '❤️', science: '🔬', sports: '⚽'
}

export default function CategoryPage() {
  const { category } = useParams()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setPage(1)
    setArticles([])
  }, [category])

  useEffect(() => {
    fetchArticles()
  }, [category, page])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/news/headlines?category=${category}&page=${page}&pageSize=12`)
      setArticles(data.articles || [])
      setTotal(data.totalResults || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-4xl">{categoryEmojis[category] || '📰'}</span>
        <div>
          <h1 className="text-2xl font-bold capitalize">{category} News</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {total > 0 ? `${total.toLocaleString()} articles found` : 'Loading articles...'}
          </p>
        </div>
      </div>

      <NewsGrid articles={articles} category={category} loading={loading} />

      {!loading && total > 12 && (
        <div className="flex justify-center gap-3 mt-6">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary disabled:opacity-40">
            ← Previous
          </button>
          <span className="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-400">Page {page}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={articles.length < 12} className="btn-secondary disabled:opacity-40">
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
