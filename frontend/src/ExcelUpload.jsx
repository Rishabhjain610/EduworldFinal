import React, { useState,useContext } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Bot, Download } from 'lucide-react';
import { AuthDataContext } from "./AuthContext.jsx";
export default function ExcelUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const { serverUrl } = useContext(AuthDataContext);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('marksFile', file);

      const response = await fetch(`${serverUrl}/api/marks/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadResult(result);
        setFile(null);
        // Reset file input
        document.getElementById('file-input').value = '';
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      ['Roll No', 'Name', 'Subject', 'Exam', 'Obtained', 'Total', 'Remarks'],
      ['CS003', 'rishabh jain', 'CN', 'Midterm', '45', '100', 'Weak understanding of TCP/IP protocols. Needs more practice on network layers.'],
      ['CS003', 'rishabh jain', 'DBMS', 'Midterm', '78', '100', 'Good SQL query writing but needs improvement in normalization concepts.'],
      ['CS003', 'rishabh jain', 'OS', 'Final', '52', '100', 'Struggling with process scheduling algorithms. Poor understanding of memory management.'],
      ['CS004', 'Monishka Jethani', 'CN', 'Midterm', '82', '100', 'Excellent grasp of OSI model. Strong in routing protocols.'],
      ['CS004', 'Monishka Jethani', 'DBMS', 'Midterm', '41', '100', 'Difficulty with complex joins and transactions. Basic SQL knowledge only.'],
      ['CS004', 'Monishka Jethani', 'OS', 'Final', '88', '100', 'Outstanding understanding of threading and synchronization concepts.'],
    ];
    
    const csv = templateData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marks_template_with_remarks.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border-t-4 border-orange-500 p-8">
          <div className="text-center mb-8">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileSpreadsheet className="text-orange-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-orange-600 mb-2">Upload Marks Excel</h1>
            <p className="text-orange-500">Upload Excel file with student marks for AI analysis</p>
          </div>

          {/* Download Template Button */}
          <div className="text-center mb-6">
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
            >
              <Download className="mr-2" size={16} />
              Download Sample Template
            </button>
          </div>

          {/* Excel Format Guide */}
          <div className="bg-orange-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-orange-600 mb-4">Excel Format Required:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-orange-700 mb-2">Required Columns:</h4>
                <ul className="space-y-1 text-orange-600">
                  <li>• Roll No (CS001, CS002, etc.)</li>
                  <li>• Name (Student full name)</li>
                  <li>• Subject (CN, DBMS, OS)</li>
                  <li>• Exam (Midterm, Final, Quiz)</li>
                  <li>• Obtained (Marks scored)</li>
                  <li>• Total (Total marks)</li>
                  <li>• Remarks (Teacher's comments)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-orange-700 mb-2">Example with CS Subjects:</h4>
                <div className="bg-white rounded border p-2 text-xs">
                  <div className="grid grid-cols-4 gap-1 text-orange-800">
                    <div className="font-bold">Roll No</div>
                    <div className="font-bold">Subject</div>
                    <div className="font-bold">Obtained</div>
                    <div className="font-bold">Remarks</div>
                    <div>CS003</div>
                    <div>CN</div>
                    <div>45</div>
                    <div>Weak in TCP/IP</div>
                    <div>CS004</div>
                    <div>DBMS</div>
                    <div>78</div>
                    <div>Good SQL skills</div>
                    <div>CS003</div>
                    <div>OS</div>
                    <div>52</div>
                    <div>Poor scheduling concepts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Information */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">Computer Science Subjects:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded p-3">
                <h4 className="font-medium text-blue-700 mb-2">CN - Computer Networks</h4>
                <p className="text-blue-600 text-xs">TCP/IP, OSI Model, Routing, Network Security</p>
              </div>
              <div className="bg-white rounded p-3">
                <h4 className="font-medium text-blue-700 mb-2">DBMS - Database Management</h4>
                <p className="text-blue-600 text-xs">SQL, Normalization, Transactions, Indexing</p>
              </div>
              <div className="bg-white rounded p-3">
                <h4 className="font-medium text-blue-700 mb-2">OS - Operating Systems</h4>
                <p className="text-blue-600 text-xs">Processes, Memory, Scheduling, Deadlocks</p>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-orange-600 mb-2">
                Select Excel File (.xlsx or .csv)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  id="file-input"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="flex-1 px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className={`px-6 py-3 rounded-lg font-medium text-white transition-colors flex items-center ${
                    uploading 
                      ? 'bg-orange-400 cursor-not-allowed' 
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  {uploading ? (
                    <>
                      <Bot className="animate-spin mr-2" size={20} />
                      Processing with AI...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2" size={20} />
                      Upload & Analyze
                    </>
                  )}
                </button>
              </div>
              {file && (
                <p className="text-sm text-orange-600 mt-2">
                  Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="text-red-500 mr-3" size={20} />
                <div>
                  <h4 className="font-medium text-red-800">Upload Error</h4>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Success Display */}
            {uploadResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="text-green-500 mr-3" size={24} />
                  <div>
                    <h4 className="font-semibold text-green-800">Upload Successful!</h4>
                    <p className="text-green-600">{uploadResult.message}</p>
                    {uploadResult.aiCallsUsed && (
                      <p className="text-green-500 text-sm">AI Analysis calls used: {uploadResult.aiCallsUsed}</p>
                    )}
                  </div>
                </div>
                
                {uploadResult.data && uploadResult.data.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-green-700 mb-2">Sample AI Analysis Results:</h5>
                    <div className="space-y-4">
                      {uploadResult.data.slice(0, 2).map((item, index) => (
                        <div key={index} className="bg-white rounded border p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p><strong>Student:</strong> {item.name}</p>
                              <p><strong>Roll No:</strong> {item.rollNo}</p>
                              <p><strong>Subject:</strong> {item.subject}</p>
                              <p><strong>Grade:</strong> <span className={`font-bold ${
                                item.aiAnalysis?.grade === 'A+' || item.aiAnalysis?.grade === 'A' ? 'text-green-600' :
                                item.aiAnalysis?.grade === 'B+' || item.aiAnalysis?.grade === 'B' ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>{item.aiAnalysis?.grade}</span></p>
                            </div>
                            <div>
                              <p><strong>Score:</strong> {item.marks.obtained}/{item.marks.total}</p>
                              <p><strong>Percentage:</strong> {item.marks.percentage.toFixed(1)}%</p>
                              <p><strong>Remarks:</strong> <span className="text-orange-600">{item.remarks || 'No remarks'}</span></p>
                            </div>
                          </div>
                          {item.aiAnalysis && (
                            <div className="mt-3 p-3 bg-orange-50 rounded">
                              <p className="text-orange-800 text-sm flex items-start">
                                <Bot className="mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <strong>AI Analysis:</strong> {item.aiAnalysis.comment}
                              </p>
                              {item.aiAnalysis.strengths && item.aiAnalysis.strengths.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-green-700 text-xs"><strong>Strengths:</strong> {item.aiAnalysis.strengths.join(', ')}</p>
                                </div>
                              )}
                              {item.aiAnalysis.improvements && item.aiAnalysis.improvements.length > 0 && (
                                <div className="mt-1">
                                  <p className="text-yellow-700 text-xs"><strong>Improvements:</strong> {item.aiAnalysis.improvements.join(', ')}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {uploadResult.data.length > 2 && (
                      <p className="text-green-600 text-sm mt-2">
                        + {uploadResult.data.length - 2} more records processed successfully
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Instructions:</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li>1. Download the sample template above to see the exact format required</li>
              <li>2. Use CS subjects: CN (Computer Networks), DBMS (Database Management), OS (Operating Systems)</li>
              <li>3. Include teacher remarks for better AI analysis and personalized feedback</li>
              <li>4. Ensure all required columns are present with correct headers</li>
              <li>5. Roll numbers should match your student database (CS003, CS004, etc.)</li>
              <li>6. AI will analyze performance, generate grades, and provide subject-specific recommendations</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}