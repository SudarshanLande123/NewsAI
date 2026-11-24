import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FireIcon, SparklesIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import NewsGrid from '../components/news/NewsGrid'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const FEATURED_CATEGORIES = ['technology', 'business', 'sports']

export default function HomePage() {
  const { user } = useAuth()
  const [headlines, setHeadlines] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('general')

  useEffect(() => {
    fetchHeadlines()
  }, [page, selectedCategory])

  const fetchHeadlines = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/news/headlines?category=${selectedCategory}&page=${page}&pageSize=12`)
      setHeadlines(data.articles || [])
      setTotal(data.totalResults || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat)
    setPage(1)
  }

  const categories = ['general', 'technology', 'business', 'sports', 'entertainment', 'health', 'science']

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 rounded-2xl p-6 md:p-8 text-white">
        <div className="flex items-center gap-2 text-blue-200 text-sm mb-2">
          <SparklesIcon className="w-4 h-4" />
          AI-Powered News Platform
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Stay Informed, Effortlessly</h1>
        <p className="text-blue-100 text-sm md:text-base mb-4">Get personalized news, AI summaries, and trending stories all in one place.</p>
        <div className="flex flex-wrap gap-2">
          <Link to="/trending" className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
            <FireIcon className="w-4 h-4" /> Trending Now
          </Link>
          {user ? (
            <Link to="/for-you" className="flex items-center gap-1.5 bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all">
              <SparklesIcon className="w-4 h-4" /> For You
            </Link>
          ) : (
            <Link to="/register" className="flex items-center gap-1.5 bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all">
              Get Started Free
            </Link>
          )}
        </div>
      </section>

      {/* Category tabs */}
      <section>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* News grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold capitalize">{selectedCategory} News</h2>
          <span className="text-sm text-gray-400">{total > 0 ? `${total.toLocaleString()} articles` : ''}</span>
        </div>
        <NewsGrid articles={headlines} category={selectedCategory} loading={loading} />

        {/* Pagination */}
        {!loading && total > 12 && (
          <div className="flex justify-center gap-3 mt-8">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary disabled:opacity-40">
              ← Previous
            </button>
            <span className="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-400">Page {page}</span>
            <button onClick={() => setPage((p) => p + 1)} disabled={headlines.length < 12} className="btn-secondary disabled:opacity-40">
              Next →
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
