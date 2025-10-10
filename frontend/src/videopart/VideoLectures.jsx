import React, { useState, useEffect, useContext } from 'react';
import { 
  Upload, 
  Video, 
  BookOpen, 
  Users, 
  Search, 
  Play, 
  Clock, 
  Trash2, 
  AlertCircle,
  Calendar,
  Eye,
  Filter,
  Download
} from 'lucide-react';
import axios from 'axios';

const VideoLectures = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [userRole, setUserRole] = useState(null);
  
  // Upload states
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    subject: '',
    semester: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  // Browse states
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // Manage states
  const [myVideos, setMyVideos] = useState([]);
  const [managePagination, setManagePagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });
  const [deleting, setDeleting] = useState(null);

  // Common states
  const [semesterSubjects, setSemesterSubjects] = useState({});
  const [availableSubjects, setAvailableSubjects] = useState([]);

  const semesters = ["1st Sem", "2nd Sem", "3rd Sem", "4th Sem", "5th Sem", "6th Sem", "7th Sem", "8th Sem"];

  // Get user role on component mount
  useEffect(() => {
    fetchUserRole();
    fetchSemesterSubjects();
  }, []);

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === 'browse') {
      fetchVideos();
    } else if (activeTab === 'manage') {
      fetchMyVideos();
    }
  }, [activeTab, filters, pagination.currentPage, managePagination.currentPage]);

  // Update available subjects when semester changes
  useEffect(() => {
    updateAvailableSubjects();
  }, [uploadForm.semester, filters.semester, semesterSubjects]);

  const fetchUserRole = async () => {
    try {
      const response = await axios.get('http://localhost:8080/auth/verify-cookie', {
        withCredentials: true
      });
      if (response.data.status) {
        setUserRole(response.data.role);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

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

  const updateAvailableSubjects = () => {
    const semester = activeTab === 'upload' ? uploadForm.semester : filters.semester;
    
    if (semester && semester !== 'all' && semesterSubjects[semester]) {
      setAvailableSubjects(semesterSubjects[semester]);
    } else {
      const allSubjects = new Set();
      Object.values(semesterSubjects).forEach(subjects => {
        subjects.forEach(subject => allSubjects.add(subject));
      });
      setAvailableSubjects(Array.from(allSubjects).sort());
    }
  };

  // Upload functions
  const handleUploadInputChange = (e) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({
      ...prev,
      [name]: value
    }));
    setUploadError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setUploadError('File size should be less than 100MB');
        return;
      }
      
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mkv', 'video/mov', 'video/wmv'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Only video files (mp4, avi, mkv, mov, wmv) are allowed');
        return;
      }
      
      setVideoFile(file);
      setUploadError('');
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    
    if (!videoFile) {
      setUploadError('Please select a video file');
      return;
    }

    if (!uploadForm.title || !uploadForm.description || !uploadForm.subject || !uploadForm.semester) {
      setUploadError('Please fill in all required fields');
      return;
    }

    if (!semesterSubjects[uploadForm.semester]?.includes(uploadForm.subject)) {
      setUploadError(`Subject "${uploadForm.subject}" is not valid for ${uploadForm.semester}`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('video', videoFile);
      formDataToSend.append('title', uploadForm.title);
      formDataToSend.append('description', uploadForm.description);
      formDataToSend.append('subject', uploadForm.subject);
      formDataToSend.append('semester', uploadForm.semester);

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            alert('Video uploaded successfully!');
            setUploadForm({
              title: '',
              description: '',
              subject: '',
              semester: ''
            });
            setVideoFile(null);
            setUploadProgress(0);
            setUploadError('');
            // Switch to manage tab to show the uploaded video
            setActiveTab('manage');
          } else {
            setUploadError('Upload failed: ' + response.message);
          }
        } else {
          setUploadError('Upload failed. Please try again.');
        }
        setUploading(false);
      });

      xhr.addEventListener('error', () => {
        setUploadError('Upload failed. Please check your connection.');
        setUploading(false);
      });

      xhr.open('POST', 'http://localhost:8080/api/videos/upload');
      xhr.withCredentials = true;
      xhr.send(formDataToSend);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Upload failed: ' + error.message);
      setUploading(false);
    }
  };

  // Browse functions
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

  // Manage functions
  const fetchMyVideos = async () => {
    if (userRole !== 'teacher') return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/videos/teacher/my-videos?page=${managePagination.currentPage}&limit=10`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setMyVideos(response.data.videoLectures);
        setManagePagination(response.data.pagination);
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
        `http://localhost:8080/api/videos/${videoId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        alert('Video deleted successfully');
        fetchMyVideos();
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  // Utility functions
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const openVideo = (videoUrl) => {
    window.open(videoUrl, '_blank');
  };

  const handlePageChange = (newPage, isManage = false) => {
    if (isManage) {
      setManagePagination(prev => ({ ...prev, currentPage: newPage }));
    } else {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Video Lectures</h1>

      {/* Tab Navigation - Hide upload and manage tabs for students */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'browse'
              ? 'border-orange-400 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Play className="inline mr-2" size={16} />
          Browse Videos
        </button>
        
        {userRole === 'teacher' && (
          <>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'upload'
                  ? 'border-orange-400 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Upload className="inline mr-2" size={16} />
              Upload Video
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'manage'
                  ? 'border-orange-400 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen className="inline mr-2" size={16} />
              My Videos
            </button>
          </>
        )}
      </div>

      {/* Upload Tab - Only for teachers */}
      {activeTab === 'upload' && userRole === 'teacher' && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Upload className="mr-3 text-orange-400" />
            Upload New Video Lecture
          </h2>

          {uploadError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{uploadError}</span>
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-6">
            {/* Video File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
              <Video size={48} className="mx-auto mb-4 text-gray-400" />
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                id="video-upload"
                disabled={uploading}
              />
              <label
                htmlFor="video-upload"
                className={`cursor-pointer bg-orange-400 text-white px-6 py-3 rounded-lg hover:bg-orange-500 inline-block transition-colors ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {videoFile ? 'Change Video' : 'Select Video File'}
              </label>
              {videoFile && (
                <div className="mt-4 text-sm text-gray-600">
                  <p>Selected: {videoFile.name}</p>
                  <p>Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: MP4, AVI, MKV, MOV, WMV (Max: 100MB)
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <BookOpen className="inline mr-2" size={16} />
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={uploadForm.title}
                onChange={handleUploadInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                placeholder="Enter video title"
                required
                disabled={uploading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={uploadForm.description}
                onChange={handleUploadInputChange}
                rows="4"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                placeholder="Describe what students will learn from this video"
                required
                disabled={uploading}
              />
            </div>

            {/* Semester and Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Users className="inline mr-2" size={16} />
                  Semester * (Select First)
                </label>
                <select
                  name="semester"
                  value={uploadForm.semester}
                  onChange={handleUploadInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  required
                  disabled={uploading}
                >
                  <option value="">Select Semester</option>
                  {semesters.map(semester => (
                    <option key={semester} value={semester}>{semester}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <BookOpen className="inline mr-2" size={16} />
                  Subject * (Based on Semester)
                </label>
                <select
                  name="subject"
                  value={uploadForm.subject}
                  onChange={handleUploadInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  required
                  disabled={!uploadForm.semester || uploading}
                >
                  <option value="">
                    {uploadForm.semester ? 'Select Subject' : 'First select semester'}
                  </option>
                  {uploadForm.semester && semesterSubjects[uploadForm.semester]?.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                {uploadForm.semester && semesterSubjects[uploadForm.semester] && (
                  <p className="text-xs text-gray-500 mt-1">
                    {semesterSubjects[uploadForm.semester].length} subjects available for {uploadForm.semester}
                  </p>
                )}
              </div>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Uploading...</span>
                  <span className="text-sm">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || !videoFile || !uploadForm.semester || !uploadForm.subject}
              className="w-full bg-orange-400 text-white py-3 rounded-lg hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Uploading... {uploadProgress}%
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={16} />
                  Upload Video Lecture
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <div>
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
      )}

      {/* Manage Tab - Only for teachers */}
      {activeTab === 'manage' && userRole === 'teacher' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Video Lectures</h2>
            <div className="text-sm text-gray-500">
              Total: {managePagination.totalCount} videos
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
          ) : myVideos.length > 0 ? (
            <div className="space-y-4">
              {myVideos.map(video => (
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
              {managePagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    onClick={() => handlePageChange(managePagination.currentPage - 1, true)}
                    disabled={managePagination.currentPage === 1}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-2">
                    Page {managePagination.currentPage} of {managePagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(managePagination.currentPage + 1, true)}
                    disabled={managePagination.currentPage === managePagination.totalPages}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Upload size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No videos uploaded yet</h3>
              <p className="text-gray-500 mb-4">Start by uploading your first video lecture</p>
              <button
                onClick={() => setActiveTab('upload')}
                className="bg-orange-400 text-white px-6 py-2 rounded-lg hover:bg-orange-500 transition-colors"
              >
                Upload Video
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoLectures;