import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import NewsGrid from '../components/news/NewsGrid'
import api from '../services/api'

const SORT_OPTIONS = [
  { value: 'publishedAt', label: 'Latest' },
  { value: 'relevancy', label: 'Relevancy' },
  { value: 'popularity', label: 'Popularity' },
]

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [query, setQuery] = useState(q)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('publishedAt')

  useEffect(() => {
    if (q) {
      setQuery(q)
      searchArticles(q, 1, sortBy)
    }
  }, [q])

  const searchArticles = async (searchQ, pg = page, sort = sortBy) => {
    setLoading(true)
    try {
      const { data } = await api.get(`/news/search?q=${encodeURIComponent(searchQ)}&page=${pg}&pageSize=12&sortBy=${sort}`)
      setArticles(data.articles || [])
      setTotal(data.totalResults || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      setSearchParams({ q: query.trim() })
      setPage(1)
      searchArticles(query.trim(), 1, sortBy)
    }
  }

  const handleSort = (val) => {
    setSortBy(val)
    if (q) searchArticles(q, 1, val)
  }

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Search News</h1>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for any news topic..."
              className="input-field pl-10 h-11"
            />
          </div>
          <button type="submit" className="btn-primary px-6">Search</button>
        </form>
      </div>

      {/* Results */}
      {q && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {loading ? 'Searching...' : `${total.toLocaleString()} results for "${q}"`}
            </p>
            <div className="flex gap-2">
              {SORT_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => handleSort(opt.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${sortBy === opt.value ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-400'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <NewsGrid articles={articles} loading={loading} emptyMessage={`No results found for "${q}"`} />

          {!loading && total > 12 && (
            <div className="flex justify-center gap-3 mt-6">
              <button onClick={() => { setPage((p) => p - 1); searchArticles(q, page - 1, sortBy) }} disabled={page === 1} className="btn-secondary disabled:opacity-40">← Previous</button>
              <span className="flex items-center px-4 py-2 text-sm text-gray-500">Page {page}</span>
              <button onClick={() => { setPage((p) => p + 1); searchArticles(q, page + 1, sortBy) }} disabled={articles.length < 12} className="btn-secondary disabled:opacity-40">Next →</button>
            </div>
          )}
        </>
      )}

      {!q && (
        <div className="text-center py-16 text-gray-400">
          <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Enter a keyword to search news</p>
        </div>
      )}
    </div>
  )
}
