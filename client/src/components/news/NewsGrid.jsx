import NewsCard from './NewsCard'

export default function NewsGrid({ articles, category, loading, emptyMessage = 'No articles found.' }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="card">
            <div className="skeleton h-48 w-full rounded-none" />
            <div className="p-4 space-y-2">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-5/6" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-4/6" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {articles.map((article, i) => (
        <NewsCard key={article.url || article.articleUrl || i} article={article} category={category || article.category} />
      ))}
    </div>
  )
}
