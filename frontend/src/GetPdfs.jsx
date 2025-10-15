import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FiDownload,
  FiEye,
  FiFilter,
  FiBook,
  FiCalendar,
} from "react-icons/fi";
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton,
  TextField,
  Paper
} from "@mui/material";
import {
  PictureAsPdf as PdfIcon,
  AutoAwesome as AiIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Person as UserIcon,
} from "@mui/icons-material";

export default function GetPdfs() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [availableSubjects, setAvailableSubjects] = useState([]);
  
  // AI states
  const [summaryLoading, setSummaryLoading] = useState({});
  const [summaryDialog, setSummaryDialog] = useState(false);
  const [currentPdfId, setCurrentPdfId] = useState(null);
  const [currentPdfTitle, setCurrentPdfTitle] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [userQuestion, setUserQuestion] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const chatEndRef = useRef(null);

  const subjectsByYear = {
    FE: ["Engineering Physics - I", "Engineering Physics - II", "Engineering Chemistry-I", "Engineering Chemistry-II", "Engineeing Mechanics", "Basic Electrical Engineering", "Engineering Mathematics I", "Engineering Mathematics II", "Engineering Graphics", "Professional Communication-I"],
    SE: ["Engineering Mathematics-III", "DSGT", "DS", "DLCA", "Computer Graphics", "Engineering Mathematics-IV", "AOA", "MP", "OS", "DBMS"],
    TE: ["Software Engineering", "Web Development", "Machine Learning", "Computer Graphics", "Artificial Intelligence"],
    BE: ["Cloud Computing", "Big Data Analytics", "Cyber Security", "IoT", "Mobile Computing"],
  };

  const fetchPdfs = async (year = "", subject = "") => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/pdf/show-pdfs", {
        withCredentials: true,
        params: { year, subject },
      });
      setPdfs(response.data);
    } catch (err) {
      setError("Failed to load PDFs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPdfs(); }, []);
  useEffect(() => {
    if (selectedYear && subjectsByYear[selectedYear]) {
      setAvailableSubjects(subjectsByYear[selectedYear]);
      setSelectedSubject("");
    } else {
      setAvailableSubjects([]);
    }
  }, [selectedYear]);
  useEffect(() => { fetchPdfs(selectedYear, selectedSubject); }, [selectedYear, selectedSubject]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory]);

  const handleDownload = async (fileUrl, fileName) => {
    const downloadUrl = fileUrl.replace("/upload/", "/upload/fl_attachment/");
    try {
      const response = await axios.get(downloadUrl, { responseType: "blob" });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
    }
  };

  const handlePreview = (fileUrl) => window.open(fileUrl, "_blank");

  const handleAISummary = async (pdfId, title) => {
    setSummaryLoading(prev => ({ ...prev, [pdfId]: true }));
    try {
      const response = await axios.post(`http://localhost:8080/api/pdf/summary/${pdfId}`, {}, { withCredentials: true });
      if (response.data.success) {
        setChatHistory([{ role: "model", parts: [{ text: response.data.summary }] }]);
        setCurrentPdfId(pdfId);
        setCurrentPdfTitle(title);
        setSummaryDialog(true);
      } else {
        alert(response.data.error || 'Failed to generate summary');
      }
    } catch (error) {
      alert('Failed to generate summary. Please try again.');
    } finally {
      setSummaryLoading(prev => ({ ...prev, [pdfId]: false }));
    }
  };

  // const handleAskQuestion = async () => {
  //   if (!userQuestion.trim() || isReplying) return;

  //   const newQuestion = { role: "user", parts: [{ text: userQuestion }] };
  //   const currentChat = [...chatHistory, newQuestion];
  //   setChatHistory(currentChat);
  //   setUserQuestion("");
  //   setIsReplying(true);

  //   try {
  //     const response = await axios.post(
  //       `http://localhost:8080/api/pdf/ask-question/${currentPdfId}`,
  //       { question: userQuestion, history: chatHistory },
  //       { withCredentials: true }
  //     );
  //     if (response.data.success) {
  //       const newAnswer = { role: "model", parts: [{ text: response.data.answer }] };
  //       setChatHistory([...currentChat, newAnswer]);
  //     } else {
  //       alert(response.data.error || "Failed to get an answer.");
  //     }
  //   } catch (error) {
  //     alert("An error occurred while asking the question.");
  //   } finally {
  //     setIsReplying(false);
  //   }
  // };
const handleAskQuestion = async () => {
    if (!userQuestion.trim() || isReplying) return;

    const newQuestion = { role: "user", parts: [{ text: userQuestion }] };
    // This is the full history BEFORE the new question is sent
    const historyForBackend = [...chatHistory]; 
    
    // Update UI immediately with the new question
    setChatHistory(prev => [...prev, newQuestion]);
    setUserQuestion("");
    setIsReplying(true);

    try {
      const response = await axios.post(
        `http://localhost:8080/api/pdf/ask-question/${currentPdfId}`,
        // Send the history that existed BEFORE the user asked the new question
        { question: userQuestion, history: historyForBackend },
        { withCredentials: true }
      );

      if (response.data.success) {
        const newAnswer = { role: "model", parts: [{ text: response.data.answer }] };
        // Add the new answer to the history
        setChatHistory(prev => [...prev, newAnswer]);
      } else {
        alert(response.data.error || "Failed to get an answer.");
        // Optional: remove the user's question if the API call fails
        setChatHistory(historyForBackend);
      }
    } catch (error) {
      alert("An error occurred while asking the question.");
      // Optional: remove the user's question if the API call fails
      setChatHistory(historyForBackend);
    } finally {
      setIsReplying(false);
    }
  };
  const closeSummaryDialog = () => {
    setSummaryDialog(false);
    setChatHistory([]);
    setCurrentPdfId(null);
    setCurrentPdfTitle("");
  };

  if (loading) return <Box className="flex items-center justify-center min-h-screen"><CircularProgress sx={{ color: '#FB923C' }} /></Box>;
  if (error) return <Box className="flex items-center justify-center min-h-screen"><Typography color="error">{error}</Typography></Box>;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Study <span className="text-orange-500">Notes</span></h1>
          <p className="text-xl text-gray-600">Access course materials and get AI-powered summaries</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex items-center"><FiFilter className="mr-2 text-orange-500" /><span className="text-gray-700 font-medium">Filters:</span></div>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="relative flex-1"><div className="flex items-center bg-gray-100 rounded-md px-3 py-2"><FiCalendar className="text-orange-500 mr-2" /><select className="bg-transparent w-full focus:outline-none text-gray-700" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}><option value="">All Years</option><option value="FE">First Year</option><option value="SE">Second Year</option><option value="TE">Third Year</option><option value="BE">Final Year</option></select></div></div>
              <div className="relative flex-1"><div className="flex items-center bg-gray-100 rounded-md px-3 py-2"><FiBook className="text-orange-500 mr-2" /><select className="bg-transparent w-full focus:outline-none text-gray-700" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} disabled={!selectedYear}><option value="">All Subjects</option>{availableSubjects.map((s) => (<option key={s} value={s}>{s}</option>))}</select></div></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pdfs.length > 0 ? (
            pdfs.map((note) => (
              <div key={note._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <div className="p-5"><div className="flex items-start"><div className="bg-orange-100 p-3 rounded-lg mr-4"><PdfIcon sx={{ fontSize: 40, color: "#F97316" }} /></div><div className="flex-1"><h3 className="text-lg font-semibold text-gray-800 mb-2">{note.fileName}</h3><div className="flex flex-wrap gap-2 mt-2"><span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">{note.subject}</span><span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">{note.year}</span></div><p className="text-gray-500 text-sm mt-2">Branch: {note.branch}</p><p className="text-gray-500 text-sm mt-1">Uploaded by: {note.uploadedBy}</p></div></div></div>
                <div className="grid grid-cols-3 border-t border-gray-200">
                  <button onClick={() => handleDownload(note.pdf, note.fileName)} className="py-3 px-2 font-medium flex items-center justify-center hover:bg-orange-50 transition-colors text-orange-600 text-sm"><FiDownload className="mr-1" />DOWNLOAD</button>
                  <div className="w-px bg-gray-200"></div>
                  <button onClick={() => handlePreview(note.pdf)} className="py-3 px-2 font-medium flex items-center justify-center hover:bg-orange-50 transition-colors text-orange-600 text-sm"><FiEye className="mr-1" />PREVIEW</button>
                  <div className="w-px bg-gray-200"></div>
                  <button onClick={() => handleAISummary(note._id, note.fileName)} disabled={summaryLoading[note._id]} className="py-3 px-2 font-medium flex items-center justify-center bg-orange-500 hover:bg-orange-600 transition-colors text-white text-sm disabled:opacity-50">{summaryLoading[note._id] ? <CircularProgress size={16} color="inherit" className="mr-1" /> : <AiIcon className="mr-1" sx={{ fontSize: 16 }} />}{summaryLoading[note._id] ? 'AI...' : 'SUMMARY'}</button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center"><svg className="w-16 h-16 text-orange-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><h3 className="text-lg font-medium text-gray-700">No notes found</h3><p className="text-gray-500 mt-2">Try changing your filter settings</p></div>
          )}
        </div>
      </div>

      <Dialog open={summaryDialog} onClose={closeSummaryDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2, height: '90vh' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FB923C', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}><AiIcon sx={{ mr: 1 }} />AI Assistant - {currentPdfTitle}</Box>
          <IconButton onClick={closeSummaryDialog} sx={{ color: 'white' }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, backgroundColor: '#FFF7ED', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
            {chatHistory.map((msg, index) => (
              <Box key={index} sx={{ mb: 2, display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                <Paper elevation={1} sx={{ p: 1.5, maxWidth: '80%', backgroundColor: msg.role === 'user' ? '#FFEFE0' : 'white' }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{msg.parts[0].text}</Typography>
                </Paper>
              </Box>
            ))}
            {isReplying && <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}><CircularProgress size={24} sx={{ color: '#FB923C' }} /></Box>}
            <div ref={chatEndRef} />
          </Box>
          <Box sx={{ p: 2, backgroundColor: 'white', borderTop: '1px solid #E0E0E0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField fullWidth variant="outlined" size="small" placeholder="Ask a follow-up question..." value={userQuestion} onChange={(e) => setUserQuestion(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()} />
              <IconButton onClick={handleAskQuestion} disabled={isReplying} sx={{ ml: 1, backgroundColor: '#FB923C', color: 'white', '&:hover': { backgroundColor: '#F97316' } }}><SendIcon /></IconButton>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}