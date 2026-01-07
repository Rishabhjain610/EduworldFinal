import React, { useState } from 'react'
import axios from 'axios'
import { Search, Play } from 'lucide-react'

const Ytvideos = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!query.trim()) return
    if (!YOUTUBE_API_KEY) {
      setError('Missing YouTube API key. Add VITE_YOUTUBE_API_KEY to .env and restart.')
      return
    }

    setLoading(true)
    setError('')
    setResults([])

    try {
      // Search for videos
      const searchRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          type: 'video',
          maxResults: 12,
          q: query,
          key: YOUTUBE_API_KEY,
          relevanceLanguage: 'en',
        },
      })

      const videoIds = (searchRes.data.items || [])
        .map((it) => it.id?.videoId)
        .filter(Boolean)

      if (videoIds.length === 0) {
        setResults([])
        setLoading(false)
        return
      }

      // Fetch video details (duration, views)
      const videosRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet,contentDetails,statistics',
          id: videoIds.join(','),
          key: YOUTUBE_API_KEY,
        },
      })

      const items = (videosRes.data.items || []).map((v) => ({
        id: v.id,
        title: v.snippet?.title,
        channel: v.snippet?.channelTitle,
        thumbnail: v.snippet?.thumbnails?.high?.url || v.snippet?.thumbnails?.default?.url || '',
        publishedAt: v.snippet?.publishedAt,
        duration: v.contentDetails?.duration,
        views: v.statistics?.viewCount || '0',
      }))

      setResults(items)
    } catch (err) {
      console.error('YouTube API error:', err?.response?.data || err.message)
      const apiMessage = err?.response?.data?.error?.message
      const errorCode = err?.response?.data?.error?.code
      
      if (errorCode === 403) {
        setError('API key invalid or quota exceeded. Check your API key and quota.')
      } else if (errorCode === 400) {
        setError('Bad request. Ensure API key is valid and YouTube Data API v3 is enabled.')
      } else {
        setError(apiMessage || 'Failed to fetch videos. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const isoDurationToHuman = (iso) => {
    if (!iso) return ''
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!m) return iso
    const [, h, mm, s] = m
    const parts = []
    if (h) parts.push(h)
    parts.push((mm || '0').padStart(2, '0'))
    parts.push((s || '0').padStart(2, '0'))
    return parts.join(':')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Play size={24} /> Video Lessons
            </h1>
            <p className="text-orange-100 text-sm mt-1">Search and discover educational videos</p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 text-orange-300" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-orange-300 focus:border-white focus:ring-2 focus:ring-orange-200 bg-white text-gray-800"
                placeholder="Search videos: MERN Stack, React Hooks, Data Structures..."
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 disabled:opacity-50 transition"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-orange-500 mb-3">
              <Play size={32} />
            </div>
            <p className="text-orange-600 font-semibold">Loading videos...</p>
          </div>
        ) : results.length > 0 ? (
          <div>
            <p className="text-gray-600 mb-6 text-sm font-semibold">Found {results.length} videos</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((v) => (
                <div key={v.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">
                  <div className="relative group">
                    <img src={v.thumbnail} alt={v.title} className="w-full h-44 object-cover group-hover:brightness-75 transition" />
                    {v.duration && (
                      <div className="absolute right-2 bottom-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {isoDurationToHuman(v.duration)}
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Play size={48} className="text-white" fill="white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2">{v.title}</h3>
                    <p className="text-xs text-orange-600 font-medium mb-2">{v.channel}</p>
                    <p className="text-xs text-gray-500 mb-4">{Number(v.views).toLocaleString()} views</p>
                    <div className="flex gap-2">
                      <a 
                        href={`https://www.youtube.com/watch?v=${v.id}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition"
                      >
                        <Play size={14} /> Watch
                      </a>
                      <button 
                        onClick={() => navigator.clipboard?.writeText(`https://www.youtube.com/watch?v=${v.id}`)} 
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
                        title="Copy video link"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <Play size={64} className="text-orange-400 mx-auto mb-4" />
            <p className="text-gray-700 text-lg font-semibold">Search videos to get started</p>
            <p className="text-gray-500 mt-2">Try searching for topics like "MERN Stack", "React Hooks", "JavaScript", or any educational topic</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Ytvideos