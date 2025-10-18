import React, { useState } from 'react';
import { Upload, Users, Camera, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function AttendanceSystem() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a photo first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('photo', selectedFile);
    formData.append('language', 'auto');

    try {
      const response = await fetch('http://127.0.0.1:5000', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setAttendanceData(data);
    } catch (err) {
      setError(err.message || 'Failed to upload. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAttendanceData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-md border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Camera className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-800">Attendance System</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
            <div className="flex items-center gap-2 mb-6">
              <Upload className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-800">Upload Photo</h2>
            </div>

            {/* File Input */}
            <div className="mb-6">
              <label className="block w-full cursor-pointer">
                <div className="border-3 border-dashed border-orange-300 rounded-xl p-8 hover:border-orange-500 transition-all hover:bg-orange-50">
                  <div className="flex flex-col items-center gap-3">
                    <Camera className="w-16 h-16 text-orange-400" />
                    <p className="text-lg font-semibold text-gray-700">Click to select photo</p>
                    <p className="text-sm text-gray-500">Supports JPG, PNG, WEBP</p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="mb-6">
                <div className="relative rounded-xl overflow-hidden border-2 border-orange-200">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Ready
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || loading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload & Analyze
                  </>
                )}
              </button>
              {(previewUrl || attendanceData) && (
                <button
                  onClick={handleReset}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-800">Attendance Results</h2>
            </div>

            {!attendanceData ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Users className="w-24 h-24 mb-4" />
                <p className="text-lg font-medium">Upload a photo to see results</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Present</span>
                    </div>
                    <p className="text-3xl font-bold text-green-600">
                      {attendanceData.present?.length || 0}
                    </p>
                  </div>
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-red-800">Absent</span>
                    </div>
                    <p className="text-3xl font-bold text-red-600">
                      {attendanceData.absent?.length || 0}
                    </p>
                  </div>
                </div>

                {/* Timestamp */}
                {attendanceData.timestamp && (
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-3">
                    <p className="text-sm text-orange-800">
                      <span className="font-semibold">Time:</span> {attendanceData.timestamp}
                    </p>
                  </div>
                )}

                {/* Student Lists */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {/* Present Students */}
                  {attendanceData.present?.length > 0 && (
                    <div>
                      <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Present Students
                      </h3>
                      <div className="space-y-2">
                        {attendanceData.present.map((student, idx) => (
                          <div
                            key={idx}
                            className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-gray-800">{student}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Absent Students */}
                  {attendanceData.absent?.length > 0 && (
                    <div>
                      <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                        <XCircle className="w-5 h-5" />
                        Absent Students
                      </h3>
                      <div className="space-y-2">
                        {attendanceData.absent.map((student, idx) => (
                          <div
                            key={idx}
                            className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-3"
                          >
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="font-medium text-gray-800">{student}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}