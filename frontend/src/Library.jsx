import React, { useState } from 'react'
import axios from 'axios'
import { Search, BookOpen, Loader } from 'lucide-react'

const Library = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const GOOGLE_BOOKS_API_KEY=import.meta.env.VITE_GOOGLE_BOOKS_API

  const searchBooks = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    setError('')
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=12`
      )
      
      setBooks(response.data.items || [])
    } catch (err) {
      setError('Failed to fetch books. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
     
      

      
      <div className="bg-white border-b-4 border-orange-400 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <form onSubmit={searchBooks}>
            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3.5 text-orange-500" size={20} />
                <input
                  type="text"
                  placeholder="Search by title, author, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition transform hover:scale-105 active:scale-95"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mx-4 my-4 rounded">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-orange-500 mr-3" size={28} />
          <span className="text-orange-600 text-lg font-semibold">Loading books...</span>
        </div>
      )}

      {/* Books Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] border border-orange-100"
              >
                {/* Book Cover */}
                <div className="h-64 bg-gradient-to-br from-orange-100 to-orange-50 overflow-hidden flex items-center justify-center">
                  {book.volumeInfo.imageLinks?.thumbnail ? (
                    <img
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt={book.volumeInfo.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <BookOpen className="text-orange-400" size={40} />
                      <span className="text-orange-400 text-sm font-semibold">No Image</span>
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-4 flex flex-col h-64">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-2">
                    {book.volumeInfo.title}
                  </h3>
                  <p className="text-orange-600 font-semibold text-sm mb-2">
                    {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                    {book.volumeInfo.description || 'No description available'}
                  </p>
                  
                  {/* Publisher & Year */}
                  <div className="text-xs text-gray-500 mb-3">
                    {book.volumeInfo.publisher && (
                      <div>📖 {book.volumeInfo.publisher}</div>
                    )}
                    {book.volumeInfo.publishedDate && (
                      <div>📅 {book.volumeInfo.publishedDate.split('-')[0]}</div>
                    )}
                  </div>

                  <a
                    href={book.volumeInfo.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg text-center transition transform hover:scale-105 active:scale-95"
                  >
                    View Book
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-16">
              <BookOpen className="mx-auto text-orange-300 mb-4" size={64} />
              <p className="text-gray-600 text-xl font-semibold">Search for books to get started</p>
              <p className="text-gray-500 mt-2">Try searching for titles, authors, or topics you're interested in</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default Library