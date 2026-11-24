import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { UserCircleIcon, HeartIcon, BookmarkIcon, ClockIcon } from '@heroicons/react/24/outline'
import api from '../services/api'
import toast from 'react-hot-toast'

const CATEGORIES = ['general', 'technology', 'business', 'sports', 'entertainment', 'health', 'science']

export default function ProfilePage() {
  const { user, fetchUser } = useAuth()
  const [selectedCats, setSelectedCats] = useState(user?.preferences?.categories || [])
  const [saving, setSaving] = useState(false)

  const toggleCat = (cat) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const savePreferences = async () => {
    setSaving(true)
    try {
      await api.put('/auth/preferences', { preferences: { ...user.preferences, categories: selectedCats } })
      await fetchUser()
      toast.success('Preferences saved! ✅')
    } catch {
      toast.error('Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile card */}
      <div className="card p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
            <UserCircleIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{user?.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <span className="badge bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 mt-1 capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="text-center">
            <HeartIcon className="w-5 h-5 text-red-400 mx-auto mb-1" />
            <p className="text-xl font-bold">{user?.likedArticles?.length || 0}</p>
            <p className="text-xs text-gray-400">Liked</p>
          </div>
          <div className="text-center">
            <BookmarkIcon className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <p className="text-xl font-bold">{user?.bookmarkedArticles?.length || 0}</p>
            <p className="text-xs text-gray-400">Bookmarks</p>
          </div>
          <div className="text-center">
            <ClockIcon className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <p className="text-xl font-bold">{user?.readHistory?.length || 0}</p>
            <p className="text-xs text-gray-400">Read</p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">News Preferences</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Select your favorite categories for the "For You" feed</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => toggleCat(cat)}
              className={`px-4 py-2 rounded-full text-sm capitalize transition-all border ${selectedCats.includes(cat)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-400'
              }`}>
              {cat}
            </button>
          ))}
        </div>
        <button onClick={savePreferences} disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>

      {/* Account info */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Account Info</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Member since</span>
            <span className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
