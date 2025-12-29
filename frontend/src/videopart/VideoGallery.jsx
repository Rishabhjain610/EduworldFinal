import React, { useState, useEffect,useContext } from 'react';
import { Search, Play, BookOpen, Users, Clock, Filter, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';
import { AuthDataContext } from '../AuthContext.jsx';
const VideoGallery = () => {
  const { serverUrl } = useContext(AuthDataContext);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    subject: 'all',
    semester: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });
  const [semesterSubjects, setSemesterSubjects] = useState({});
  const [availableSubjects, setAvailableSubjects] = useState([]);

  const semesters = ["1st Sem", "2nd Sem", "3rd Sem", "4th Sem", "5th Sem", "6th Sem", "7th Sem", "8th Sem"];

  useEffect(() => {
    fetchSemesterSubjects();
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [filters, pagination.currentPage]);

  // Update available subjects when semester filter changes
  useEffect(() => {
    if (filters.semester && filters.semester !== 'all' && semesterSubjects[filters.semester]) {
      setAvailableSubjects(semesterSubjects[filters.semester]);
      // Reset subject filter if it's not valid for the new semester
      if (filters.subject !== 'all' && !semesterSubjects[filters.semester].includes(filters.subject)) {
        setFilters(prev => ({ ...prev, subject: 'all' }));
      }
    } else {
      // Show all subjects when no semester is selected
      const allSubjects = new Set();
      Object.values(semesterSubjects).forEach(subjects => {
        subjects.forEach(subject => allSubjects.add(subject));
      });
      setAvailableSubjects(Array.from(allSubjects).sort());
    }
  }, [filters.semester, semesterSubjects]);

  const fetchSemesterSubjects = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/videos/semester-subjects`);
      
      if (response.data.success) {
        setSemesterSubjects(response.data.semesterSubjects);
        
        // Set initial available subjects (all subjects)
        const allSubjects = new Set();
        Object.values(response.data.semesterSubjects).forEach(subjects => {
          subjects.forEach(subject => allSubjects.add(subject));
        });
        setAvailableSubjects(Array.from(allSubjects).sort());
      }
    } catch (error) {
      console.error('Error fetching semester subjects:', error);
      setError('Failed to load subjects. Please refresh the page.');
    }
  };

  const fetchVideos = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Build query parameters - remove empty/all values
      const queryParams = new URLSearchParams();
      
      // Only add non-default filter values
      if (filters.subject && filters.subject !== 'all') {
        queryParams.append('subject', filters.subject);
      }
      if (filters.semester && filters.semester !== 'all') {
        queryParams.append('semester', filters.semester);
      }
      if (filters.search && filters.search.trim()) {
        queryParams.append('search', filters.search.trim());
      }
      
      // Always include sorting and pagination
      queryParams.append('sortBy', filters.sortBy);
      queryParams.append('sortOrder', filters.sortOrder);
      queryParams.append('page', pagination.currentPage.toString());
      queryParams.append('limit', '12');

      console.log('Fetching videos with params:', queryParams.toString());

      const response = await axios.get(`${serverUrl}/api/videos?${queryParams}`);

      console.log('API Response:', response.data);

      if (response.data.success) {
        setVideos(response.data.videoLectures || []);
        setPagination(response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0
        });
      } else {
        setError('Failed to fetch videos: ' + (response.data.message || 'Unknown error'));
        setVideos([]);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Error fetching videos: ' + (error.response?.data?.message || error.message));
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchVideos();
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const openVideo = (videoUrl) => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    } else {
      alert('Video URL not available');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  // Debug button to test API
  const handleDebugAPI = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/videos/statistics`);
      console.log('Statistics response:', response.data);
      
      const allVideosResponse = await axios.get(`${serverUrl}/api/videos`);
      console.log('All videos response:', allVideosResponse.data);
      
      alert(`Statistics: ${JSON.stringify(response.data, null, 2)}\n\nAll Videos: ${JSON.stringify(allVideosResponse.data, null, 2)}`);
    } catch (error) {
      console.error('Debug API error:', error);
      alert('API Error: ' + error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Video Lectures Gallery</h1>
        {/* Debug button - remove in production */}
        <button
          onClick={handleDebugAPI}
          className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
        >
          Debug API
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
          <button
            onClick={fetchVideos}
            className="ml-auto bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search videos by title or description..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-orange-400 text-white px-6 py-2 rounded-lg hover:bg-orange-500 transition-colors"
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin" size={20} /> : 'Search'}
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Semester</label>
            <select
              value={filters.semester}
              onChange={(e) => handleFilterChange('semester', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            >
              <option value="all">All Semesters</option>
              {semesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Subject</label>
            <select
              value={filters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            >
              <option value="all">All Subjects</option>
              {availableSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            >
              <option value="createdAt">Latest</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Order</label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Filter Info */}
        {filters.semester !== 'all' && availableSubjects.length > 0 && (
          <div className="mt-3 p-2 bg-orange-50 rounded text-sm text-orange-700">
            Showing subjects for {filters.semester}: {availableSubjects.length} available
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          {loading ? 'Loading...' : `Showing ${videos.length} of ${pagination.totalCount} videos`}
        </p>
        <div className="text-sm text-gray-500">
          Page {pagination.currentPage} of {pagination.totalPages}
        </div>
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 aspect-video rounded-lg mb-3"></div>
              <div className="bg-gray-300 h-4 rounded mb-2"></div>
              <div className="bg-gray-300 h-3 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map(video => (
            <div key={video._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Video Thumbnail */}
              <div 
                className="relative aspect-video bg-gray-900 flex items-center justify-center group cursor-pointer"
                onClick={() => openVideo(video.videoUrl)}
              >
                <Play className="text-white opacity-70 group-hover:opacity-100 transition-opacity" size={48} />
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(video.duration)}
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 
                  className="font-semibold text-lg mb-2 line-clamp-2 hover:text-orange-600 cursor-pointer"
                  onClick={() => openVideo(video.videoUrl)}
                  title={video.title}
                >
                  {video.title}
                </h3>
                
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <BookOpen size={14} className="mr-1" />
                  <span>{video.subject}</span>
                  <span className="mx-2">•</span>
                  <Users size={14} className="mr-1" />
                  <span>{video.semester}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Users size={14} className="mr-1" />
                  <span>{video.teacher}</span>
                  <span className="mx-2">•</span>
                  <Clock size={14} className="mr-1" />
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>

                <p className="text-sm text-gray-700 mb-3 line-clamp-2" title={video.description}>
                  {video.description}
                </p>

                <button
                  onClick={() => openVideo(video.videoUrl)}
                  className="w-full bg-orange-400 text-white py-2 rounded-lg hover:bg-orange-500 flex items-center justify-center transition-colors"
                >
                  <Play size={16} className="mr-2" />
                  Watch Video
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Play size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No videos found</h3>
          <p className="text-gray-500 mb-4">
            {filters.search || filters.subject !== 'all' || filters.semester !== 'all' 
              ? 'Try adjusting your search criteria or filters' 
              : 'No videos have been uploaded yet'}
          </p>
          <button
            onClick={fetchVideos}
            className="bg-orange-400 text-white px-6 py-2 rounded-lg hover:bg-orange-500 transition-colors"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          
          {/* Page numbers */}
          {[...Array(pagination.totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            if (
              pageNumber === 1 ||
              pageNumber === pagination.totalPages ||
              (pageNumber >= pagination.currentPage - 1 && pageNumber <= pagination.currentPage + 1)
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-2 border rounded-lg transition-colors ${
                    pageNumber === pagination.currentPage
                      ? 'bg-orange-400 text-white border-orange-400'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            } else if (
              pageNumber === pagination.currentPage - 2 ||
              pageNumber === pagination.currentPage + 2
            ) {
              return <span key={pageNumber} className="px-2">...</span>;
            }
            return null;
          })}
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;