import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import {
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  FireIcon,
  BookmarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

const CATEGORIES = ['general', 'business', 'technology', 'entertainment', 'health', 'science', 'sports']

const categoryColors = {
  general: 'bg-gray-100 dark:bg-gray-800',
  business: 'bg-green-50 dark:bg-green-950',
  technology: 'bg-blue-50 dark:bg-blue-950',
  entertainment: 'bg-purple-50 dark:bg-purple-950',
  health: 'bg-red-50 dark:bg-red-950',
  science: 'bg-cyan-50 dark:bg-cyan-950',
  sports: 'bg-orange-50 dark:bg-orange-950',
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      {/* Top bar */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-400 shrink-0">
            <SparklesIcon className="w-6 h-6" />
            NewsAI
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news..."
                className="input-field pl-10 pr-4 h-10 text-sm"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Toggle theme">
              {darkMode ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-gray-500" />}
            </button>

            <Link to="/trending" className="hidden md:flex items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-orange-500 transition-colors" title="Trending">
              <FireIcon className="w-5 h-5" />
            </Link>

            {user ? (
              <>
                <Link to="/bookmarks" className="hidden md:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-500 transition-colors" title="Bookmarks">
                  <BookmarkIcon className="w-5 h-5" />
                </Link>
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <UserCircleIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">{user.name.split(' ')[0]}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm" onClick={() => setUserMenuOpen(false)}>
                        <UserCircleIcon className="w-4 h-4" /> Profile
                      </Link>
                      <Link to="/for-you" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm" onClick={() => setUserMenuOpen(false)}>
                        <SparklesIcon className="w-4 h-4" /> For You
                      </Link>
                      <Link to="/history" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm" onClick={() => setUserMenuOpen(false)}>
                        📋 Read History
                      </Link>
                      <button onClick={() => { logout(); setUserMenuOpen(false) }} className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 text-sm">
                        <ArrowRightOnRectangleIcon className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-1.5 px-3">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-3">Sign Up</Link>
              </div>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              {menuOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Category nav */}
        <nav className="hidden md:flex gap-1 pb-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/category/${cat}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap
                ${location.pathname === `/category/${cat}`
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              {cat}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 space-y-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="input-field pl-10 h-10 text-sm" />
            </div>
          </form>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Link key={cat} to={`/category/${cat}`} onClick={() => setMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium capitalize bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                {cat}
              </Link>
            ))}
          </div>
          {!user && (
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="btn-secondary text-sm flex-1 text-center" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary text-sm flex-1 text-center" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
          {user && (
            <div className="flex gap-2 pt-2">
              <Link to="/bookmarks" className="btn-secondary text-sm flex-1 text-center" onClick={() => setMenuOpen(false)}>Bookmarks</Link>
              <button onClick={() => { logout(); setMenuOpen(false) }} className="btn-danger text-sm flex-1">Logout</button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
