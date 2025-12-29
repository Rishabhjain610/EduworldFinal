import React, { useState, useEffect,useContext } from 'react';
import { Play, Trash2, Eye, Calendar, BookOpen, Users } from 'lucide-react';
import axios from 'axios';
import { AuthDataContext } from '../AuthContext.jsx';
const TeacherVideoManager = () => {
  const { serverUrl } = useContext(AuthDataContext);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });

  useEffect(() => {
    fetchMyVideos();
  }, [pagination.currentPage]);

  const fetchMyVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${serverUrl}/api/videos/teacher/my-videos?page=${pagination.currentPage}&limit=10`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setVideos(response.data.videoLectures);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching my videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    setDeleting(videoId);
    try {
      const response = await axios.delete(
        `${serverUrl}/api/videos/${videoId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        alert('Video deleted successfully');
        fetchMyVideos(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Video Lectures</h1>
        <div className="text-sm text-gray-500">
          Total: {pagination.totalCount} videos
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-300 w-32 h-20 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-300 h-3 rounded w-1/2"></div>
                  <div className="bg-gray-300 h-3 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : videos.length > 0 ? (
        <div className="space-y-4">
          {videos.map(video => (
            <div key={video._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-6">
                {/* Video Thumbnail Placeholder */}
                <div className="w-32 h-20 bg-gray-900 rounded flex items-center justify-center flex-shrink-0">
                  <Play className="text-white opacity-70" size={24} />
                </div>

                {/* Video Details */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <BookOpen size={14} className="mr-1" />
                      <span>{video.subject}</span>
                    </div>
                    <div className="flex items-center">
                      <Users size={14} className="mr-1" />
                      <span>{video.semester}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye size={14} className="mr-1" />
                      <span>{formatDuration(video.duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        video.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {video.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDelete(video._id)}
                        disabled={deleting === video._id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete video"
                      >
                        {deleting === video._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              
              <span className="px-4 py-2">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <Play size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No videos uploaded yet</h3>
          <p className="text-gray-500">Start by uploading your first video lecture</p>
        </div>
      )}
    </div>
  );
};

export default TeacherVideoManager;