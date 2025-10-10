import React, { useState, useEffect } from 'react';
import { Search, Play, BookOpen, Users, Clock, Filter } from 'lucide-react';
import axios from 'axios';

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
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
      const response = await axios.get('http://localhost:8080/api/videos/semester-subjects');
      
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
    }
  };

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page: pagination.currentPage,
        limit: 12
      });

      const response = await axios.get(`http://localhost:8080/api/videos?${queryParams}`);

      if (response.data.success) {
        setVideos(response.data.videoLectures);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
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
    fetchVideos();
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const openVideo = (videoUrl) => {
    window.open(videoUrl, '_blank');
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Video Lectures</h1>

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
            >
              Search
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Semester (Select First)</label>
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
            <label className="block text-sm font-medium mb-1 text-gray-700">Subject (Based on Semester)</label>
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
        {filters.semester !== 'all' && (
          <div className="mt-3 p-2 bg-orange-50 rounded text-sm text-orange-700">
            Showing subjects for {filters.semester}: {availableSubjects.length} available
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Showing {videos.length} of {pagination.totalCount} videos
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

                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
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
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          
          <span className="px-4 py-2">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
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