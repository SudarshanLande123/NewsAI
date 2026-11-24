import { useState, useEffect } from 'react'
import { SparklesIcon } from '@heroicons/react/24/outline'
import NewsGrid from '../components/news/NewsGrid'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function ForYouPage() {
  const { user } = useAuth()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchForYou()
  }, [])

  const fetchForYou = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/news/for-you')
      setArticles(data.articles || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SparklesIcon className="w-8 h-8 text-purple-500" />
        <div>
          <h1 className="text-2xl font-bold">For You</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Personalized for {user?.name} · Based on your interests: {user?.preferences?.categories?.join(', ')}
          </p>
        </div>
      </div>

      <NewsGrid articles={articles} loading={loading} emptyMessage="Update your preferences to see personalized news!" />
    </div>
  )
}
