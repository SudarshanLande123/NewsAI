import { useState, useEffect } from 'react'
import { ClockIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'
import api from '../services/api'

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/user/history')
      .then(({ data }) => setHistory(data.history || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <ClockIcon className="w-8 h-8 text-gray-500" />
        <div>
          <h1 className="text-2xl font-bold">Read History</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your last 50 articles</p>
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-4 flex gap-3">
              <div className="skeleton h-4 w-4/5" />
              <div className="skeleton h-4 w-1/5" />
            </div>
          ))}
        </div>
      )}

      {!loading && history.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <ClockIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No reading history yet. Start reading!</p>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div className="space-y-2">
          {history.map((item, i) => (
            <div key={i} className="card p-4 flex items-center justify-between gap-3 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {item.readAt ? formatDistanceToNow(new Date(item.readAt), { addSuffix: true }) : ''}
                </p>
              </div>
              <a href={item.url} target="_blank" rel="noopener noreferrer"
                className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
