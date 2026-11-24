import { Link } from 'react-router-dom'
import { SparklesIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-8">
      <div className="container mx-auto px-4 max-w-7xl py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-400 mb-2">
              <SparklesIcon className="w-6 h-6" />
              NewsAI
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your AI-powered personalized news platform. Stay informed with AI summaries, trending news, and category filters.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {['general', 'technology', 'business', 'sports', 'health', 'science', 'entertainment'].map((cat) => (
                <Link key={cat} to={`/category/${cat}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 capitalize">
                  {cat}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Quick Links</h3>
            <div className="space-y-1">
              {[['/', 'Home'], ['/trending', '🔥 Trending'], ['/bookmarks', '🔖 Bookmarks'], ['/for-you', '✨ For You']].map(([to, label]) => (
                <Link key={to} to={to} className="block text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">{label}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} NewsAI · Powered by NewsAPI &amp; Google Gemini · Built with MERN Stack
        </div>
      </div>
    </footer>
  )
}
