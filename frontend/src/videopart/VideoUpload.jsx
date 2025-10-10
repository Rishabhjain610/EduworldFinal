import React, { useState, useEffect } from 'react';
import { Upload, Video, BookOpen, Users, AlertCircle } from 'lucide-react';
import axios from 'axios';

const VideoUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    semester: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [semesterSubjects, setSemesterSubjects] = useState({});
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [error, setError] = useState('');

  const semesters = ["1st Sem", "2nd Sem", "3rd Sem", "4th Sem", "5th Sem", "6th Sem", "7th Sem", "8th Sem"];

  // Fetch semester-subject mapping on component mount
  useEffect(() => {
    fetchSemesterSubjects();
  }, []);

  // Update available subjects when semester changes
  useEffect(() => {
    if (formData.semester && semesterSubjects[formData.semester]) {
      setAvailableSubjects(semesterSubjects[formData.semester]);
      // Reset subject if it's not valid for the new semester
      if (formData.subject && !semesterSubjects[formData.semester].includes(formData.subject)) {
        setFormData(prev => ({ ...prev, subject: '' }));
      }
    } else {
      setAvailableSubjects([]);
    }
  }, [formData.semester, semesterSubjects]);

  const fetchSemesterSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/videos/semester-subjects');
      
      if (response.data.success) {
        setSemesterSubjects(response.data.semesterSubjects);
      }
    } catch (error) {
      console.error('Error fetching semester subjects:', error);
      setError('Failed to load subjects. Please refresh the page.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        setError('File size should be less than 100MB');
        return;
      }
      
      // Check file type
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mkv', 'video/mov', 'video/wmv'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only video files (mp4, avi, mkv, mov, wmv) are allowed');
        return;
      }
      
      setVideoFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    if (!formData.title || !formData.description || !formData.subject || !formData.semester) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate subject belongs to semester
    if (!semesterSubjects[formData.semester]?.includes(formData.subject)) {
      setError(`Subject "${formData.subject}" is not valid for ${formData.semester}`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('video', videoFile);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('semester', formData.semester);

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
            // Reset form
            setFormData({
              title: '',
              description: '',
              subject: '',
              semester: ''
            });
            setVideoFile(null);
            setUploadProgress(0);
            setError('');
          } else {
            setError('Upload failed: ' + response.message);
          }
        } else {
          setError('Upload failed. Please try again.');
        }
        setUploading(false);
      });

      xhr.addEventListener('error', () => {
        setError('Upload failed. Please check your connection.');
        setUploading(false);
      });

      xhr.open('POST', 'http://localhost:8080/api/videos/upload');
      xhr.withCredentials = true;
      xhr.send(formDataToSend);

    } catch (error) {
      console.error('Upload error:', error);
      setError('Upload failed: ' + error.message);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <Upload className="mr-3 text-orange-400" />
          Upload Video Lecture
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
              value={formData.title}
              onChange={handleInputChange}
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
              value={formData.description}
              onChange={handleInputChange}
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
                value={formData.semester}
                onChange={handleInputChange}
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
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                required
                disabled={!formData.semester || uploading}
              >
                <option value="">
                  {formData.semester ? 'Select Subject' : 'First select semester'}
                </option>
                {availableSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              {formData.semester && availableSubjects.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {availableSubjects.length} subjects available for {formData.semester}
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
            disabled={uploading || !videoFile || !formData.semester || !formData.subject}
            className="w-full bg-orange-400 text-white py-3 rounded-lg hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Uploading...
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
    </div>
  );
};

export default VideoUpload;