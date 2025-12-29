import React, { useState, useEffect,useContext } from 'react';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
import { 
  TrendingUp, 
  Award, 
  BookOpen, 
  Brain, 
  Target, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Sparkles,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import { AuthDataContext } from './AuthContext.jsx';  
// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

export default function StudentAnalytics({ username, userEmail }) {
  const [marksData, setMarksData] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { serverUrl } = useContext(AuthDataContext);
  // Get email from props or derive from username
  const getStudentEmail = () => {
    if (userEmail) return userEmail;
    
    // Updated mapping with all your students - make sure these match exactly
    const emailMapping = {
      'Vaibhav': 'vaibhav@example.com',
      'Monishka': 'monishka@example.com',
      'rishabh jain': 'jainrishabh2610@gmail.com',
      'Monishka Jethani': 'monishkayesim@gmail.com',
      'Rishabh': 'rishabh@example.com',
      // Add more variations to handle case sensitivity
      'RISHABH JAIN': 'jainrishabh2610@gmail.com',
      'MONISHKA JETHANI': 'monishkayesim@gmail.com',
      'vaibhav': 'vaibhav@example.com',
      'monishka': 'monishka@example.com',
      'rishabh': 'rishabh@example.com'
    };
    
    // Try exact match first, then case-insensitive
    let email = emailMapping[username];
    if (!email) {
      const lowerUsername = username?.toLowerCase();
      const matchingKey = Object.keys(emailMapping).find(key => 
        key.toLowerCase() === lowerUsername
      );
      email = matchingKey ? emailMapping[matchingKey] : null;
    }
    
    return email || 'unknown@example.com';
  };

  useEffect(() => {
    fetchStudentMarks();
  }, [username]);

  const fetchStudentMarks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const studentEmail = getStudentEmail();
      console.log(`Fetching marks for ${username} with email: ${studentEmail}`);
      
      // Use axios with credentials for authentication
      const response = await axios.get(
        `${serverUrl}/api/marks/student/email/${encodeURIComponent(studentEmail)}`,
        { withCredentials: true }
      );
      
      if (response.data.success && response.data.data.length > 0) {
        setMarksData(response.data.data);
        generateAnalytics(response.data.data);
      } else {
        setError('No marks data found for your account.');
      }
    } catch (error) {
      console.error('Error fetching marks:', error);
      if (error.response?.status === 404) {
        setError('No marks found for this student.');
      } else if (error.response?.status === 401) {
        setError('Authentication required. Please log in again.');
      } else {
        setError('Failed to fetch marks data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateAnalytics = (marks) => {
    // Group by subject and exam
    const subjectPerformance = {};
    const examPerformance = {};
    const overallStats = {
      totalMarks: 0,
      totalObtained: 0,
      subjects: new Set(),
      exams: new Set(),
      strengths: [],
      improvements: [],
      recommendations: []
    };

    marks.forEach(mark => {
      // Subject-wise performance
      if (!subjectPerformance[mark.subject]) {
        subjectPerformance[mark.subject] = {
          totalMarks: 0,
          totalObtained: 0,
          count: 0,
          grades: []
        };
      }
      subjectPerformance[mark.subject].totalMarks += mark.marks.total;
      subjectPerformance[mark.subject].totalObtained += mark.marks.obtained;
      subjectPerformance[mark.subject].count += 1;
      subjectPerformance[mark.subject].grades.push(mark.aiAnalysis?.grade || 'N/A');

      // Exam-wise performance
      if (!examPerformance[mark.exam]) {
        examPerformance[mark.exam] = {
          totalMarks: 0,
          totalObtained: 0,
          count: 0
        };
      }
      examPerformance[mark.exam].totalMarks += mark.marks.total;
      examPerformance[mark.exam].totalObtained += mark.marks.obtained;
      examPerformance[mark.exam].count += 1;

      // Overall stats
      overallStats.totalMarks += mark.marks.total;
      overallStats.totalObtained += mark.marks.obtained;
      overallStats.subjects.add(mark.subject);
      overallStats.exams.add(mark.exam);

      // Collect AI insights
      if (mark.aiAnalysis) {
        overallStats.strengths.push(...(mark.aiAnalysis.strengths || []));
        overallStats.improvements.push(...(mark.aiAnalysis.improvements || []));
        overallStats.recommendations.push(...(mark.aiAnalysis.recommendations || []));
      }
    });

    const overallPercentage = overallStats.totalMarks > 0 ? 
      (overallStats.totalObtained / overallStats.totalMarks) * 100 : 0;

    setAiInsights({
      overallPercentage,
      subjectPerformance,
      examPerformance,
      totalSubjects: overallStats.subjects.size,
      totalExams: overallStats.exams.size,
      strengths: [...new Set(overallStats.strengths)].slice(0, 6),
      improvements: [...new Set(overallStats.improvements)].slice(0, 6),
      recommendations: [...new Set(overallStats.recommendations)].slice(0, 6),
      performanceLevel: overallPercentage >= 90 ? 'Excellent' :
                      overallPercentage >= 80 ? 'Very Good' :
                      overallPercentage >= 70 ? 'Good' :
                      overallPercentage >= 60 ? 'Average' : 'Needs Improvement',
      lowestSubject: Object.keys(subjectPerformance).reduce((lowest, subject) => {
        const lowestPerf = subjectPerformance[lowest];
        const currPerf = subjectPerformance[subject];
        const lowestPercent = (lowestPerf.totalObtained / lowestPerf.totalMarks) * 100;
        const currPercent = (currPerf.totalObtained / currPerf.totalMarks) * 100;
        return currPercent < lowestPercent ? subject : lowest;
      }, Object.keys(subjectPerformance)[0])
    });
  };

  // Chart configurations
  const getSubjectChart = () => {
    if (!aiInsights) return null;
    
    const subjects = Object.keys(aiInsights.subjectPerformance);
    const percentages = subjects.map(subject => {
      const perf = aiInsights.subjectPerformance[subject];
      return (perf.totalObtained / perf.totalMarks) * 100;
    });

    return {
      labels: subjects,
      datasets: [{
        label: 'Subject Performance (%)',
        data: percentages,
        backgroundColor: subjects.map((_, index) => {
          const colors = [
            'rgba(249, 115, 22, 0.8)',
            'rgba(234, 88, 12, 0.8)',
            'rgba(194, 65, 12, 0.8)',
            'rgba(154, 52, 18, 0.8)',
            'rgba(124, 45, 18, 0.8)',
            'rgba(99, 102, 241, 0.8)'
          ];
          return colors[index % colors.length];
        }),
        borderColor: subjects.map((_, index) => {
          const colors = [
            'rgb(249, 115, 22)',
            'rgb(234, 88, 12)',
            'rgb(194, 65, 12)',
            'rgb(154, 52, 18)',
            'rgb(124, 45, 18)',
            'rgb(99, 102, 241)'
          ];
          return colors[index % colors.length];
        }),
        borderWidth: 2
      }]
    };
  };

  const getPerformanceTrend = () => {
    if (!marksData.length) return null;

    const sortedMarks = [...marksData].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    return {
      labels: sortedMarks.map((mark, index) => `${mark.subject} - ${mark.exam}`),
      datasets: [{
        label: 'Performance Trend (%)',
        data: sortedMarks.map(mark => mark.marks.percentage),
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4,
        pointBackgroundColor: sortedMarks.map(mark => 
          mark.marks.percentage >= 80 ? 'rgb(34, 197, 94)' :
          mark.marks.percentage >= 60 ? 'rgb(249, 115, 22)' :
          'rgb(239, 68, 68)'
        ),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
      }]
    };
  };

  const getRadarChart = () => {
    if (!aiInsights || Object.keys(aiInsights.subjectPerformance).length === 0) return null;

    const subjects = Object.keys(aiInsights.subjectPerformance).slice(0, 6);
    const percentages = subjects.map(subject => {
      const perf = aiInsights.subjectPerformance[subject];
      return (perf.totalObtained / perf.totalMarks) * 100;
    });

    return {
      labels: subjects,
      datasets: [{
        label: 'Subject Analysis',
        data: percentages,
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
        borderColor: 'rgb(249, 115, 22)',
        pointBackgroundColor: 'rgb(249, 115, 22)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(249, 115, 22)'
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#9a3412',
          font: { size: 12, weight: 500 }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(249, 115, 22, 0.1)' },
        ticks: { 
          color: '#9a3412',
          callback: function(value) {
            return value + '%';
          }
        }
      },
      x: {
        grid: { color: 'rgba(249, 115, 22, 0.1)' },
        ticks: { color: '#9a3412' }
      }
    }
  };

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#9a3412',
          font: { size: 12, weight: 500 }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(249, 115, 22, 0.2)' },
        angleLines: { color: 'rgba(249, 115, 22, 0.2)' },
        pointLabels: { color: '#9a3412', font: { size: 11 } },
        ticks: { 
          color: '#9a3412', 
          backdropColor: 'transparent',
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-600">Loading your analytics...</p>
          <p className="text-sm text-orange-400 mt-2">User: {username}</p>
          <p className="text-sm text-orange-400">Email: {getStudentEmail()}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border-t-4 border-red-500 p-8 text-center">
            <Activity className="mx-auto text-red-400 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Analytics Error</h2>
            <p className="text-red-500 mb-4">{error}</p>
            <p className="text-sm text-gray-500 mb-4">
              Username: {username}<br/>
              Email: {getStudentEmail()}
            </p>
            <button 
              onClick={fetchStudentMarks}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!marksData.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border-t-4 border-orange-500 p-8 text-center">
            <Activity className="mx-auto text-orange-400 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-orange-600 mb-2">No Analytics Available</h2>
            <p className="text-orange-500 mb-4">No marks data found for your account.</p>
            <p className="text-sm text-orange-400">Ask your teacher to upload marks to see your performance analytics.</p>
            <div className="mt-4 text-sm text-gray-500">
              <p>Username: {username}</p>
              <p>Email: {getStudentEmail()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border-t-4 border-orange-500 p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-orange-600 mb-2 flex items-center">
                <Brain className="mr-3" size={32} />
                AI Performance Analytics
              </h1>
              <p className="text-orange-700">Detailed insights powered by AI for {username}</p>
              <p className="text-sm text-orange-500">Computer Science Performance Dashboard</p>
            </div>
            <div className="text-center mt-4 md:mt-0">
              <div className="text-4xl font-bold text-orange-600">
                {aiInsights?.overallPercentage.toFixed(1)}%
              </div>
              <div className={`text-lg font-medium ${
                aiInsights?.overallPercentage >= 80 ? 'text-green-600' :
                aiInsights?.overallPercentage >= 60 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {aiInsights?.performanceLevel}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg border-l-4 border-orange-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Total Subjects</p>
                <p className="text-2xl font-bold text-orange-800">{aiInsights?.totalSubjects}</p>
              </div>
              <BookOpen className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-l-4 border-orange-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Total Exams</p>
                <p className="text-2xl font-bold text-orange-800">{aiInsights?.totalExams}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-l-4 border-green-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Best Subject</p>
                <p className="text-xl font-bold text-green-800">
                  {aiInsights && Object.keys(aiInsights.subjectPerformance).length > 0
                    ? Object.keys(aiInsights.subjectPerformance).reduce((best, subject) => {
                        const bestPerf = aiInsights.subjectPerformance[best];
                        const currPerf = aiInsights.subjectPerformance[subject];
                        const bestPercent = (bestPerf.totalObtained / bestPerf.totalMarks) * 100;
                        const currPercent = (currPerf.totalObtained / currPerf.totalMarks) * 100;
                        return currPercent > bestPercent ? subject : best;
                      })
                    : 'N/A'
                  }
                </p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-l-4 border-red-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Needs Focus</p>
                <p className="text-xl font-bold text-red-800">
                  {aiInsights?.lowestSubject || 'N/A'}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Performance Trend */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-orange-600 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Performance Trend
            </h3>
            {getPerformanceTrend() && <Line data={getPerformanceTrend()} options={chartOptions} />}
          </div>

          {/* Subject Performance */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-orange-600 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Subject Performance
            </h3>
            {getSubjectChart() && <Bar data={getSubjectChart()} options={chartOptions} />}
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-orange-600 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Subject Analysis Radar
          </h3>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              {getRadarChart() && <Radar data={getRadarChart()} options={radarOptions} />}
            </div>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Strengths */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-orange-600 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              AI-Identified Strengths
            </h3>
            <ul className="space-y-3">
              {aiInsights?.strengths.length > 0 ? 
                aiInsights.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-green-700 text-sm">{strength}</span>
                  </li>
                )) :
                <li className="text-gray-500 text-sm">No specific strengths identified yet</li>
              }
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-orange-600 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Areas for Improvement
            </h3>
            <ul className="space-y-3">
              {aiInsights?.improvements.length > 0 ?
                aiInsights.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-yellow-700 text-sm">{improvement}</span>
                  </li>
                )) :
                <li className="text-gray-500 text-sm">No specific improvements suggested yet</li>
              }
            </ul>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-orange-600 mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              AI Recommendations
            </h3>
            <ul className="space-y-3">
              {aiInsights?.recommendations.length > 0 ?
                aiInsights.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-blue-700 text-sm">{recommendation}</span>
                  </li>
                )) :
                <li className="text-gray-500 text-sm">No specific recommendations available yet</li>
              }
            </ul>
          </div>
        </div>

        {/* Detailed Marks Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-orange-100">
            <h3 className="text-xl font-semibold text-orange-600 flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Detailed Performance Records
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-orange-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-600 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-600 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-600 uppercase">Exam</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-600 uppercase">Marks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-600 uppercase">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-600 uppercase">Remarks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-600 uppercase">AI Comment</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-orange-100">
                {marksData.map((mark, index) => (
                  <tr key={index} className="hover:bg-orange-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-700">
                      {new Date(mark.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-800">
                      {mark.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-700">
                      {mark.exam}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-700">
                      <div>
                        <span className="font-semibold">{mark.marks.obtained}/{mark.marks.total}</span>
                        <span className={`ml-2 ${
                          mark.marks.percentage >= 80 ? 'text-green-600' :
                          mark.marks.percentage >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          ({mark.marks.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        mark.aiAnalysis?.grade === 'A+' || mark.aiAnalysis?.grade === 'A' ? 'bg-green-100 text-green-800' :
                        mark.aiAnalysis?.grade === 'B+' || mark.aiAnalysis?.grade === 'B' ? 'bg-yellow-100 text-yellow-800' :
                        mark.aiAnalysis?.grade === 'C' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {mark.aiAnalysis?.grade || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-orange-700 max-w-xs">
                      <div className="flex items-start">
                        <MessageSquare className="mr-1 mt-0.5 flex-shrink-0" size={14} />
                        <div className="truncate" title={mark.remarks}>
                          {mark.remarks || 'No remarks'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-orange-700 max-w-xs">
                      <div className="truncate" title={mark.aiAnalysis?.comment}>
                        {mark.aiAnalysis?.comment || 'No AI analysis available'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}