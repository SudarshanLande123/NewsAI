import { useState, useEffect, useRef } from 'react'
import { XMarkIcon, SparklesIcon, SpeakerWaveIcon, StopIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const sentimentColors = {
  Positive: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  Negative: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  Neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

export default function AISummaryModal({ article, onClose }) {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [speaking, setSpeaking] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [askLoading, setAskLoading] = useState(false)
  const utteranceRef = useRef(null)

  useEffect(() => {
    if (user) {
      fetchSummary()
    }
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const fetchSummary = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/ai/summarize', {
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
      })
      setSummary(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate summary')
    } finally {
      setLoading(false)
    }
  }

  const handleSpeak = () => {
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    if (!summary?.summary) return

    const text = `Article summary. ${summary.summary}. Key points: ${summary.keyPoints?.join('. ')}`
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.onend = () => setSpeaking(false)
    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setSpeaking(true)
  }

  const handleAsk = async (e) => {
    e.preventDefault()
    if (!question.trim()) return
    setAskLoading(true)
    setAnswer('')
    try {
      const { data } = await api.post('/ai/ask', {
        title: article.title,
        description: article.description,
        question,
      })
      setAnswer(data.answer)
    } catch (err) {
      toast.error('Failed to get answer')
    } finally {
      setAskLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <SparklesIcon className="w-5 h-5" />
            <span className="font-semibold">AI Summary</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Article title */}
        <div className="px-4 pt-3 pb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 line-clamp-2">{article.title}</h3>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!user && (
            <div className="text-center py-6">
              <SparklesIcon className="w-12 h-12 text-purple-300 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">Please <strong>login</strong> to use AI features</p>
            </div>
          )}

          {user && loading && (
            <div className="space-y-3">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-5/6" />
              <div className="skeleton h-4 w-4/6" />
              <div className="skeleton h-20 w-full mt-2" />
            </div>
          )}

          {user && error && (
            <div className="text-center py-6 space-y-3">
              <div className="text-4xl">⚠️</div>
              {error.includes('403') || error.includes('billing') || error.includes('free tier') ? (
                <div className="text-left bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm">
                  <p className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Gemini API Key Issue</p>
                  <p className="text-amber-600 dark:text-amber-300 mb-3">
                    Your API key needs to be from <strong>AI Studio</strong>, not Google Cloud Console.
                  </p>
                  <ol className="text-amber-600 dark:text-amber-300 space-y-1 list-decimal list-inside">
                    <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline font-medium">aistudio.google.com/app/apikey</a></li>
                    <li>Click <strong>"Create API Key in new project"</strong></li>
                    <li>Paste it in <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">server/.env</code> as <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">GEMINI_API_KEY</code></li>
                    <li>Restart the server</li>
                  </ol>
                </div>
              ) : (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <button onClick={fetchSummary} className="btn-primary text-sm">Try Again</button>
            </div>
          )}

          {user && summary && (
            <>
              {/* Summary */}
              <div className="bg-purple-50 dark:bg-purple-950/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">Summary</h4>
                  <div className="flex items-center gap-2">
                    {summary.sentiment && (
                      <span className={`badge text-xs ${sentimentColors[summary.sentiment]}`}>{summary.sentiment}</span>
                    )}
                    <button onClick={handleSpeak} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all ${speaking ? 'bg-purple-200 dark:bg-purple-800 text-purple-700' : 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 hover:bg-purple-200'}`}>
                      {speaking ? <StopIcon className="w-3.5 h-3.5" /> : <SpeakerWaveIcon className="w-3.5 h-3.5" />}
                      {speaking ? 'Stop' : 'Read'}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{summary.summary}</p>
              </div>

              {/* Key Points */}
              {summary.keyPoints?.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Key Points</h4>
                  <ul className="space-y-1.5">
                    {summary.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-purple-500 mt-0.5">•</span> {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {summary.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {summary.tags.map((tag) => (
                    <span key={tag} className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs">#{tag}</span>
                  ))}
                </div>
              )}

              {/* Ask AI */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <ChatBubbleLeftIcon className="w-3.5 h-3.5" /> Ask AI about this article
                </h4>
                <form onSubmit={handleAsk} className="flex gap-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What do you want to know?"
                    className="input-field text-sm flex-1 h-9"
                  />
                  <button type="submit" disabled={askLoading} className="btn-primary text-sm py-1.5 px-3 shrink-0">
                    {askLoading ? '...' : 'Ask'}
                  </button>
                </form>
                {answer && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong className="text-blue-600 dark:text-blue-400">Answer:</strong> {answer}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
