import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiDownload, FiEye, FiFilter, FiBook, FiCalendar } from "react-icons/fi";
import {
    Box,
    CircularProgress,
    Typography,
} from '@mui/material';
import {
    Download as DownloadIcon,
    PictureAsPdf as PdfIcon,
    Visibility as PreviewIcon,
} from '@mui/icons-material';

export default function GetPdfs() {
    const [pdfs, setPdfs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedYear, setSelectedYear] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [availableSubjects, setAvailableSubjects] = useState([]);


    const subjectsByYear = {
        FE: [
            "Engineering Physics - I",
            "Engineering Physics - II",
            "Engineering Chemistry-I",
            "Engineering Chemistry-II",
            "Engineeing Mechanics",
            "Basic Electrical Engineering",
            "Engineering Mathematics I",
            "Engineering Mathematics II",
            "Engineering Graphics",
            "Professional Communication-I",
        ],
        SE: [
            "Engineering Mathematics-III",
            "DSGT",
            "DS",
            "DLCA",
            "Computer Graphics",
            "Engineering Mathematics-IV",
            "AOA",
            "MP",
            "OS",
            "DBMS",
        ],
        TE: [
            "Software Engineering",
            "Web Development",
            "Machine Learning",
            "Computer Graphics",
            "Artificial Intelligence",
        ],
        BE: [
            "Cloud Computing",
            "Big Data Analytics",
            "Cyber Security",
            "IoT",
            "Mobile Computing",
        ],
    };


    const fetchPdfs = async (year = "", subject = "") => {
        console.log(year, subject);
        try {
            setLoading(true);

            const response = await axios.get('http://localhost:8080/show-pdfs', {
                withCredentials: true,
                params: {
                    year,
                    subject,
                },
            });
            setPdfs(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching PDFs:', err);
            setError('Failed to load PDFs. Please try again later.');
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchPdfs();
    }, []);


    useEffect(() => {
        if (selectedYear && subjectsByYear[selectedYear]) {
            setAvailableSubjects(subjectsByYear[selectedYear]);

            setSelectedSubject("");
        } else {
            setAvailableSubjects([]);
        }
    }, [selectedYear]);


    useEffect(() => {
        fetchPdfs(selectedYear, selectedSubject);
    }, [selectedYear, selectedSubject]);

    const handleDownload = async (fileUrl, fileName) => {

        const downloadUrl = fileUrl.replace('/upload/', '/upload/fl_attachment/');
        console.log(downloadUrl);
        try {
            const response = await axios.get(downloadUrl, {
                responseType: 'blob',
                headers: {
                    Accept: 'application/pdf',
                }
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            const fileNameWithExtension = fileName + ".pdf";
            link.href = url;
            link.download = fileNameWithExtension;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error downloading PDF:', err);
        }
    };

    const handlePreview = (fileUrl) => {
        console.log(fileUrl);
        window.open(fileUrl, '_blank');
    };

    if (loading) {
        return (
            <Box className="flex items-center justify-center min-h-screen">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="flex items-center justify-center min-h-screen">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="flex items-center">
                            <FiFilter className="mr-2 text-neutral-500" />
                            <span className="text-gray-700 font-medium">Filters:</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <div className="relative flex-1">
                                <div className="flex items-center bg-gray-100 rounded-md px-3 py-2">
                                    <FiCalendar className="text-gray-500 mr-2" />
                                    <select
                                        className="bg-transparent w-full focus:outline-none text-gray-700"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                    >
                                        <option value="">All Years</option>
                                        <option value="FE">First Year (FE)</option>
                                        <option value="SE">Second Year (SE)</option>
                                        <option value="TE">Third Year (TE)</option>
                                        <option value="BE">Final Year (BE)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="relative flex-1">
                                <div className="flex items-center bg-gray-100 rounded-md px-3 py-2">
                                    <FiBook className="text-gray-500 mr-2" />
                                    <select
                                        className="bg-transparent w-full focus:outline-none text-gray-700"
                                        value={selectedSubject}
                                        onChange={(e) => setSelectedSubject(e.target.value)}
                                        disabled={!selectedYear}
                                    >
                                        <option value="">All Subjects</option>
                                        {availableSubjects.map((subject) => (
                                            <option key={subject} value={subject}>
                                                {subject}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pdfs.length > 0 ? (
                        pdfs.map((note) => (
                            <div
                                key={note.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="p-5">
                                    <div className="flex items-start">
                                        <div className="bg-neutral-100 p-3 rounded-lg mr-4">
                                            <PdfIcon sx={{ fontSize: 40, color: "orange" }} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                                    {note.subject}
                                                </span>
                                                <span className="inline-block bg-neutral-100 text-black text-xs px-2 py-1 rounded">
                                                    {note.year}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-sm mt-1">
                                                Branch: {note.branch}
                                            </p>
                                            <p className="text-gray-500 text-sm mt-1">
                                                Uploaded by: {note.uploadedBy}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex border-t border-gray-200">
                                    <button
                                        onClick={() => handleDownload(note.pdf, note.fileName)}
                                        className="flex-1 py-3 px-4 font-medium flex items-center justify-center hover:bg-neutral-50 transition-colors text-black"
                                    >
                                        <FiDownload className="mr-2 text-black" />
                                        DOWNLOAD
                                    </button>
                                    <div className="w-px bg-gray-200"></div>
                                    <button
                                        onClick={() => handlePreview(note.pdf)}
                                        className="flex-1 py-3 px-4 font-medium flex items-center justify-center hover:bg-neutral-50 transition-colors text-black"
                                    >
                                        <FiEye className="mr-2 text-black" />
                                        PREVIEW
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                            <svg
                                className="w-16 h-16 text-gray-300 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                ></path>
                            </svg>
                            <h3 className="text-lg font-medium text-gray-700">No notes found</h3>
                            <p className="text-gray-500 mt-2">Try changing your filter settings</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}