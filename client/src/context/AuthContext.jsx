import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [likedArticles, setLikedArticles] = useState([])
  const [bookmarkedArticles, setBookmarkedArticles] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/auth/me')
      setUser(data.user)
      setLikedArticles(data.user.likedArticles || [])
      setBookmarkedArticles(data.user.bookmarkedArticles || [])
    } catch {
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    setUser(data.user)
    setLikedArticles(data.user.likedArticles || [])
    setBookmarkedArticles(data.user.bookmarkedArticles || [])
    return data
  }

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setLikedArticles([])
    setBookmarkedArticles([])
    toast.success('Logged out successfully')
  }

  const toggleLike = async (article) => {
    if (!user) {
      toast.error('Please login to like articles')
      return
    }
    try {
      const { data } = await api.post('/user/like', {
        articleUrl: article.url,
        title: article.title,
        description: article.description,
        urlToImage: article.urlToImage,
        source: article.source?.name || article.source,
        publishedAt: article.publishedAt,
        category: article.category,
      })
      setLikedArticles(data.likedArticles)
      toast.success(data.liked ? '❤️ Article liked!' : '💔 Like removed')
    } catch {
      toast.error('Failed to update like')
    }
  }

  const toggleBookmark = async (article) => {
    if (!user) {
      toast.error('Please login to bookmark articles')
      return
    }
    try {
      const { data } = await api.post('/user/bookmark', {
        articleUrl: article.url,
        title: article.title,
        description: article.description,
        urlToImage: article.urlToImage,
        source: article.source?.name || article.source,
        publishedAt: article.publishedAt,
        category: article.category,
      })
      setBookmarkedArticles(data.bookmarkedArticles)
      toast.success(data.bookmarked ? '🔖 Bookmarked!' : '🗑️ Bookmark removed')
    } catch {
      toast.error('Failed to update bookmark')
    }
  }

  const isLiked = (url) => likedArticles.includes(url)
  const isBookmarked = (url) => bookmarkedArticles.some((a) => a.url === url)

  return (
    <AuthContext.Provider value={{
      user, loading, likedArticles, bookmarkedArticles,
      login, register, logout, toggleLike, toggleBookmark,
      isLiked, isBookmarked, fetchUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
