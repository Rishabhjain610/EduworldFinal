"use client";
import React, { useState, useEffect } from 'react';
import { Download, Plus, Trash2, FileText, Calculator, Award, User } from 'lucide-react';

const GradingSystem = () => {
  const SCHOOL_NAME = 'Sunrise Public School';
  const [schoolInfo, setSchoolInfo] = useState({
    academicYear: '2024-2025',
    term: 'Term 1',
    className: '',
    section: '',
    teacherName: '',
    teacherSignature: '',
    principalName: '',
    dateOfIssue: new Date().toISOString().split('T')[0]
  });

  const [students, setStudents] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('students_v1');
      if (saved) setStudents(JSON.parse(saved));
    } catch (e) {
      console.warn('Failed to load students from storage', e);
    }
  }, []);
  const [currentStudent, setCurrentStudent] = useState({
    rollNo: '',
    std: '',
    div: '',
    subjects: {
      mathematics: { theory: '', practical: '', maxTheory: 80, maxPractical: 20 },
      science: { theory: '', practical: '', maxTheory: 80, maxPractical: 20 },
      english: { theory: '', practical: '', maxTheory: 80, maxPractical: 20 },
      socialScience: { theory: '', practical: '', maxTheory: 80, maxPractical: 20 },
      hindi: { theory: '', practical: '', maxTheory: 80, maxPractical: 20 },
      computer: { theory: '', practical: '', maxTheory: 80, maxPractical: 20 }
    },
    coScholastic: {
      discipline: '',
      sports: '',
      arts: '',
      leadership: ''
    }
  });

  const calculateMarks = (subject) => {
    const theory = parseFloat(subject.theory) || 0;
    const practical = parseFloat(subject.practical) || 0;
    return theory + practical;
  };

  const calculateTotalMarks = (subjects) => {
    return Object.values(subjects).reduce((total, subject) => {
      return total + calculateMarks(subject);
    }, 0);
  };

  const calculatePercentage = (obtained, total) => {
    return total > 0 ? ((obtained / total) * 100).toFixed(2) : 0;
  };

  const getGrade = (percentage) => {
    if (percentage >= 91) return 'A1';
    if (percentage >= 81) return 'A2';
    if (percentage >= 71) return 'B1';
    if (percentage >= 61) return 'B2';
    if (percentage >= 51) return 'C1';
    if (percentage >= 41) return 'C2';
    if (percentage >= 33) return 'D';
    return 'E (Fail)';
  };

  const getGradePoint = (percentage) => {
    if (percentage >= 91) return 10;
    if (percentage >= 81) return 9;
    if (percentage >= 71) return 8;
    if (percentage >= 61) return 7;
    if (percentage >= 51) return 6;
    if (percentage >= 41) return 5;
    if (percentage >= 33) return 4;
    return 0;
  };

  const getRemarks = (percentage) => {
    if (percentage >= 91) return 'Outstanding Performance';
    if (percentage >= 81) return 'Excellent';
    if (percentage >= 71) return 'Very Good';
    if (percentage >= 61) return 'Good';
    if (percentage >= 51) return 'Above Average';
    if (percentage >= 41) return 'Average';
    if (percentage >= 33) return 'Below Average - Needs Improvement';
    return 'Failed - Extra Attention Required';
  };

  const handleSchoolInfoChange = (e) => {
    const { name, value } = e.target;
    setSchoolInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (subject, field, value) => {
    setCurrentStudent(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [subject]: {
          ...prev.subjects[subject],
          [field]: value
        }
      }
    }));
  };

  const handleCoScholasticChange = (field, value) => {
    setCurrentStudent(prev => ({
      ...prev,
      coScholastic: {
        ...prev.coScholastic,
        [field]: value
      }
    }));
  };

  const addStudent = () => {
    if (!currentStudent.rollNo || !currentStudent.std || !currentStudent.div) {
      alert('Please fill Roll No, Standard and Division');
      return;
    }

    setStudents(prev => {
      const newStudents = [...prev, { ...currentStudent, id: Date.now() }];
      try { localStorage.setItem('students_v1', JSON.stringify(newStudents)); } catch (e) { console.warn('Failed to persist students', e); }
      return newStudents;
    });
    
    // Reset form
    setCurrentStudent({
      rollNo: '',
      std: '',
      div: '',
      subjects: {
        mathematics: { theory: '', practical: '', maxTheory: 80, maxPractical: 20 },
        science: { theory: '', practical: '', maxTheory: 80, maxPractical: 20 },
        english: { theory: '', practical: '', maxTheory: 80, maxPractical: 20 },
        socialScience: { theory: '', practical: '', maxTheory: 80, maxPractical: 20 },
        hindi: { theory: '', practical: '', maxTheory: 80, maxPractical: 20 },
        computer: { theory: '', practical: '', maxTheory: 80, maxPractical: 20 }
      },
      coScholastic: {
        discipline: '',
        sports: '',
        arts: '',
        leadership: ''
      }
    });
  };

  const removeStudent = (id) => {
    setStudents(prev => {
      const newStudents = prev.filter(s => s.id !== id);
      try { localStorage.setItem('students_v1', JSON.stringify(newStudents)); } catch (e) { console.warn('Failed to persist students', e); }
      return newStudents;
    });
  };

  const exportToExcel = () => {
    let csv = 'STUDENT GRADE SHEET - COMPLETE DATA\n\n';
    
    // School Information
    csv += 'SCHOOL INFORMATION\n';
    csv += `School Name,${SCHOOL_NAME}\n`;
    csv += `Academic Year,${schoolInfo.academicYear}\n`;
    csv += `Term,${schoolInfo.term}\n`;
    csv += `Class,${schoolInfo.className}\n`;
    csv += `Section,${schoolInfo.section}\n`;
    csv += `Class Teacher,${schoolInfo.teacherName}\n`;
    csv += `Principal,${schoolInfo.principalName}\n`;
    csv += `Date of Issue,${schoolInfo.dateOfIssue}\n\n`;

    // Detailed Student Records
    csv += 'DETAILED STUDENT GRADE RECORDS\n';
    csv += 'Roll No,Std,Div,Subject,Theory (Max),Practical (Max),Total Obtained,Max Marks,Percentage,Grade,Grade Point,Status\n';
    
    students.forEach(student => {
      const subjectNames = {
        mathematics: 'Mathematics',
        science: 'Science',
        english: 'English',
        socialScience: 'Social Science',
        hindi: 'Hindi',
        computer: 'Computer'
      };

      Object.entries(student.subjects).forEach(([key, subject]) => {
        const total = calculateMarks(subject);
        const maxMarks = subject.maxTheory + subject.maxPractical;
        const percentage = calculatePercentage(total, maxMarks);
        const grade = getGrade(parseFloat(percentage));
        const gradePoint = getGradePoint(parseFloat(percentage));
        const status = parseFloat(percentage) >= 33 ? 'Pass' : 'Fail';

        csv += `${student.rollNo},${student.std || 'N/A'},${student.div || 'N/A'},${subjectNames[key]},${subject.theory} (${subject.maxTheory}),${subject.practical} (${subject.maxPractical}),${total},${maxMarks},${percentage}%,${grade},${gradePoint},${status}\n`;
      });
    });

    // Summary Statistics
    csv += '\n\nSTUDENT SUMMARY - OVERALL PERFORMANCE\n';
    csv += 'Roll No,Std,Div,Total Marks Obtained,Total Maximum Marks,Overall Percentage,Overall Grade,CGPA,Result,Attendance,Remarks\n';
    
    students.forEach(student => {
      const totalObtained = calculateTotalMarks(student.subjects);
      const totalMax = Object.values(student.subjects).reduce((sum, s) => sum + s.maxTheory + s.maxPractical, 0);
      const percentage = calculatePercentage(totalObtained, totalMax);
      const grade = getGrade(parseFloat(percentage));
      const cgpa = (getGradePoint(parseFloat(percentage)) / 10 * 10).toFixed(2);
      const result = parseFloat(percentage) >= 33 ? 'PASS' : 'FAIL';
      const attendance = student.attendance && student.totalDays ? `${student.attendance}/${student.totalDays}` : 'N/A';
      const remarks = getRemarks(parseFloat(percentage));

      csv += `${student.rollNo},${student.std || 'N/A'},${student.div || 'N/A'},${totalObtained},${totalMax},${percentage}%,${grade},${cgpa},${result},${attendance},"${remarks}"\n`;
    });

    // Co-Scholastic Activities
    csv += '\n\nCO-SCHOLASTIC ACTIVITIES ASSESSMENT\n';
    csv += 'Roll No,Std,Div,Discipline,Sports & Physical Education,Art & Creativity,Leadership & Initiative\n';
    
    students.forEach(student => {
      csv += `${student.rollNo},${student.std || 'N/A'},${student.div || 'N/A'},${student.coScholastic.discipline || 'N/A'},${student.coScholastic.sports || 'N/A'},${student.coScholastic.arts || 'N/A'},${student.coScholastic.leadership || 'N/A'}\n`;
    });

    // Class Statistics
    csv += '\n\nCLASS STATISTICS\n';
    csv += `Total Students,${students.length}\n`;
    
    const passed = students.filter(s => {
      const percentage = parseFloat(calculatePercentage(calculateTotalMarks(s.subjects), 
        Object.values(s.subjects).reduce((sum, sub) => sum + sub.maxTheory + sub.maxPractical, 0)));
      return percentage >= 33;
    }).length;
    
    csv += `Students Passed,${passed}\n`;
    csv += `Students Failed,${students.length - passed}\n`;
    csv += `Pass Percentage,${students.length > 0 ? ((passed / students.length) * 100).toFixed(2) : 0}%\n`;

    if (students.length > 0) {
      const allPercentages = students.map(s => {
        const totalObtained = calculateTotalMarks(s.subjects);
        const totalMax = Object.values(s.subjects).reduce((sum, sub) => sum + sub.maxTheory + sub.maxPractical, 0);
        return parseFloat(calculatePercentage(totalObtained, totalMax));
      });

      const highest = Math.max(...allPercentages).toFixed(2);
      const lowest = Math.min(...allPercentages).toFixed(2);
      const average = (allPercentages.reduce((a, b) => a + b, 0) / allPercentages.length).toFixed(2);

      csv += `Highest Percentage,${highest}%\n`;
      csv += `Lowest Percentage,${lowest}%\n`;
      csv += `Class Average,${average}%\n`;
    }

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Grade_Sheet_${schoolInfo.className}_${schoolInfo.term}_${schoolInfo.dateOfIssue}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const buildReport = (student) => {
    const totalObtained = calculateTotalMarks(student.subjects);
    const totalMax = Object.values(student.subjects).reduce((sum, s) => sum + s.maxTheory + s.maxPractical, 0);
    const percentage = parseFloat(calculatePercentage(totalObtained, totalMax));
    const grade = getGrade(percentage);
    const cgpa = (getGradePoint(percentage) / 10 * 10).toFixed(2);

    let report = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `                    STUDENT REPORT CARD\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    report += `School: ${SCHOOL_NAME}\n`;
    report += `Academic Year: ${schoolInfo.academicYear} | ${schoolInfo.term}\n`;
    report += `Class: ${schoolInfo.className} - ${schoolInfo.section}\n`;
    report += `Date of Issue: ${schoolInfo.dateOfIssue}\n\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `STUDENT INFORMATION\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    report += `Roll Number    : ${student.rollNo}\n`;
    report += `Standard/Division: ${student.std || 'N/A'} / ${student.div || 'N/A'}\n\n`;
    
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `SCHOLASTIC PERFORMANCE\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    report += `Subject              Theory  Practical  Total   Max    %      Grade  GP\n`;
    report += `─────────────────────────────────────────────────────────────────────\n`;

    const subjectNames = {
      mathematics: 'Mathematics',
      science: 'Science',
      english: 'English',
      socialScience: 'Social Science',
      hindi: 'Hindi',
      computer: 'Computer'
    };

    Object.entries(student.subjects).forEach(([key, subject]) => {
      const total = calculateMarks(subject);
      const maxMarks = subject.maxTheory + subject.maxPractical;
      const subPercent = calculatePercentage(total, maxMarks);
      const subGrade = getGrade(parseFloat(subPercent));
      const gp = getGradePoint(parseFloat(subPercent));
      
      report += `${subjectNames[key].padEnd(20)} ${(subject.theory || '0').toString().padStart(5)}   ${(subject.practical || '0').toString().padStart(5)}     ${total.toString().padStart(5)}   ${maxMarks.toString().padStart(3)}   ${parseFloat(subPercent).toFixed(1).padStart(5)}%  ${subGrade.padEnd(6)} ${gp.toString().padStart(2)}\n`;
    });

    report += `─────────────────────────────────────────────────────────────────────\n`;
    report += `TOTAL                                     ${totalObtained.toString().padStart(5)}   ${totalMax.toString().padStart(3)}   ${percentage.toFixed(1).padStart(5)}%  ${grade.padEnd(6)} ${cgpa}\n\n`;

    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `CO-SCHOLASTIC ACTIVITIES\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    report += `Discipline & Behavior   : ${student.coScholastic.discipline || 'Not Assessed'}\n`;
    report += `Sports & Physical Ed.   : ${student.coScholastic.sports || 'Not Assessed'}\n`;
    report += `Art & Creativity        : ${student.coScholastic.arts || 'Not Assessed'}\n`;
    report += `Leadership & Initiative : ${student.coScholastic.leadership || 'Not Assessed'}\n\n`;

    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `RESULT SUMMARY\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    report += `Overall Percentage : ${percentage.toFixed(2)}%\n`;
    report += `Overall Grade      : ${grade}\n`;
    report += `CGPA               : ${cgpa}\n`;
    report += `Result             : ${percentage >= 33 ? '✓ PASS' : '✗ FAIL'}\n`;
    report += `Remarks            : ${getRemarks(percentage)}\n\n`;

    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `GRADING SYSTEM\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    report += `A1: 91-100% (GP 10) | A2: 81-90% (GP 9)  | B1: 71-80% (GP 8)\n`;
    report += `B2: 61-70% (GP 7)   | C1: 51-60% (GP 6)  | C2: 41-50% (GP 5)\n`;
    report += `D: 33-40% (GP 4)    | E: Below 33% (FAIL)\n\n`;

    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `SIGNATURES\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    report += `Class Teacher: ${schoolInfo.teacherName}          Principal: ${schoolInfo.principalName}\n\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

    return report;
  };

  const generateReportCard = (student) => {
    const report = buildReport(student);
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Report_Card_${student.rollNo}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadClassTxt = () => {
    if (students.length === 0) return;
    const combined = students.map(s => buildReport(s)).join('\n\n');
    try { localStorage.setItem('class_report_txt', combined); } catch (e) { console.warn('Failed to save class report', e); }
    const blob = new Blob([combined], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Class_Results_${schoolInfo.className || 'Class'}_${schoolInfo.section || 'Section'}_${schoolInfo.dateOfIssue}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center border-b-4 border-blue-600 pb-6 mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
              <Award className="mr-3 text-yellow-500" size={40} />
              Automated Grading & Report Card System
            </h1>
            <p className="text-gray-600">Complete Student Performance Management</p>
          </div>

          {/* School Information */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <FileText className="mr-2 text-blue-600" />
              School Details — {SCHOOL_NAME}
            </h2>

          {/* Student Entry Form */}
          <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <User className="mr-2 text-purple-600" />
              Add Student Details
            </h2>

            {/* Basic Info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number *</label>
                  <input
                    type="text"
                    name="rollNo"
                    value={currentStudent.rollNo}
                    onChange={handleStudentChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Standard *</label>
                  <input
                    type="text"
                    name="std"
                    value={currentStudent.std}
                    onChange={handleStudentChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Division *</label>
                  <input
                    type="text"
                    name="div"
                    value={currentStudent.div}
                    onChange={handleStudentChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="A"
                  />
                </div>
              </div>
            </div>

            {/* Subject Marks */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <Calculator className="mr-2 text-green-600" size={20} />
                Subject-wise Marks (Theory + Practical)
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                  <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Subject</th>
                      <th className="px-4 py-3 text-center">Theory (Max 80)</th>
                      <th className="px-4 py-3 text-center">Practical (Max 20)</th>
                      <th className="px-4 py-3 text-center">Total</th>
                      <th className="px-4 py-3 text-center">Percentage</th>
                      <th className="px-4 py-3 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Object.entries(currentStudent.subjects).map(([key, subject]) => {
                      const total = calculateMarks(subject);
                      const maxMarks = subject.maxTheory + subject.maxPractical;
                      const percentage = calculatePercentage(total, maxMarks);
                      const grade = total > 0 ? getGrade(parseFloat(percentage)) : '-';
                      
                      const subjectNames = {
                        mathematics: 'Mathematics',
                        science: 'Science',
                        english: 'English',
                        socialScience: 'Social Science',
                        hindi: 'Hindi',
                        computer: 'Computer Science'
                      };

                      return (
                        <tr key={key} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-700">{subjectNames[key]}</td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={subject.theory}
                              onChange={(e) => handleSubjectChange(key, 'theory', e.target.value)}
                              max={subject.maxTheory}
                              className="w-24 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={subject.practical}
                              onChange={(e) => handleSubjectChange(key, 'practical', e.target.value)}
                              max={subject.maxPractical}
                              className="w-24 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-4 py-3 text-center font-semibold">{total}/{maxMarks}</td>
                          <td className="px-4 py-3 text-center">{percentage}%</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                              grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                              grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                              grade === 'D' ? 'bg-orange-100 text-orange-800' :
                              grade.startsWith('E') ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Co-Scholastic Activities */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Co-Scholastic Activities (A/B/C/D/E)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discipline & Behavior</label>
                  <select
                    value={currentStudent.coScholastic.discipline}
                    onChange={(e) => handleCoScholasticChange('discipline', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select</option>
                    <option value="A">A - Excellent</option>
                    <option value="B">B - Very Good</option>
                    <option value="C">C - Good</option>
                    <option value="D">D - Satisfactory</option>
                    <option value="E">E - Needs Improvement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sports & Physical Ed.</label>
                  <select
                    value={currentStudent.coScholastic.sports}
                    onChange={(e) => handleCoScholasticChange('sports', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select</option>
                    <option value="A">A - Excellent</option>
                    <option value="B">B - Very Good</option>
                    <option value="C">C - Good</option>
                    <option value="D">D - Satisfactory</option>
                    <option value="E">E - Needs Improvement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Art & Creativity</label>
                  <select
                    value={currentStudent.coScholastic.arts}
                    onChange={(e) => handleCoScholasticChange('arts', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select</option>
                    <option value="A">A - Excellent</option>
                    <option value="B">B - Very Good</option>
                    <option value="C">C - Good</option>
                    <option value="D">D - Satisfactory</option>
                    <option value="E">E - Needs Improvement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leadership & Initiative</label>
                  <select
                    value={currentStudent.coScholastic.leadership}
                    onChange={(e) => handleCoScholasticChange('leadership', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select</option>
                    <option value="A">A - Excellent</option>
                    <option value="B">B - Very Good</option>
                    <option value="C">C - Good</option>
                    <option value="D">D - Satisfactory</option>
                    <option value="E">E - Needs Improvement</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={addStudent}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-medium flex items-center transition-all shadow-lg"
            >
              <Plus className="mr-2" size={20} />
              Add Student to List
            </button>
          </div>

          {/* Students List */}
          {students.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Enrolled Students ({students.length})
              </h2>
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">Roll</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">Std/Div</th>
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase">Total Marks</th>
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase">Percentage</th>
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase">Grade</th>
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase">CGPA</th>
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase">Result</th>
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => {
                      const totalObtained = calculateTotalMarks(student.subjects);
                      const totalMax = Object.values(student.subjects).reduce((sum, s) => sum + s.maxTheory + s.maxPractical, 0);
                      const percentage = parseFloat(calculatePercentage(totalObtained, totalMax));
                      const grade = getGrade(percentage);
                      const cgpa = (getGradePoint(percentage) / 10 * 10).toFixed(2);
                      const result = percentage >= 33 ? 'PASS' : 'FAIL';

                      return (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.rollNo}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{student.std}/{student.div}</td>
                          <td className="px-4 py-3 text-sm text-center font-semibold">{totalObtained}/{totalMax}</td>
                          <td className="px-4 py-3 text-sm text-center font-semibold">{percentage.toFixed(2)}%</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                              grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                              grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                              grade === 'D' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {grade}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-center font-semibold">{cgpa}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              result === 'PASS' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}>
                              {result}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => generateReportCard(student)}
                                className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                                title="Generate Report Card"
                              >
                                <FileText size={18} />
                              </button>
                              <button
                                onClick={() => removeStudent(student.id)}
                                className="text-red-600 hover:text-red-800 transition-colors p-1"
                                title="Remove"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Class Statistics */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-lg">
                  <p className="text-sm opacity-90">Total Students</p>
                  <p className="text-3xl font-bold">{students.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4 shadow-lg">
                  <p className="text-sm opacity-90">Passed</p>
                  <p className="text-3xl font-bold">
                    {students.filter(s => {
                      const percentage = parseFloat(calculatePercentage(calculateTotalMarks(s.subjects), 
                        Object.values(s.subjects).reduce((sum, sub) => sum + sub.maxTheory + sub.maxPractical, 0)));
                      return percentage >= 33;
                    }).length}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-4 shadow-lg">
                  <p className="text-sm opacity-90">Failed</p>
                  <p className="text-3xl font-bold">
                    {students.filter(s => {
                      const percentage = parseFloat(calculatePercentage(calculateTotalMarks(s.subjects), 
                        Object.values(s.subjects).reduce((sum, sub) => sum + sub.maxTheory + sub.maxPractical, 0)));
                      return percentage < 33;
                    }).length}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-4 shadow-lg">
                  <p className="text-sm opacity-90">Pass %</p>
                  <p className="text-3xl font-bold">
                    {students.length > 0 ? (
                      (students.filter(s => {
                        const percentage = parseFloat(calculatePercentage(calculateTotalMarks(s.subjects), 
                          Object.values(s.subjects).reduce((sum, sub) => sum + sub.maxTheory + sub.maxPractical, 0)));
                        return percentage >= 33;
                      }).length / students.length * 100).toFixed(1)
                    ) : 0}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg p-4 shadow-lg">
                  <p className="text-sm opacity-90">Class Average</p>
                  <p className="text-3xl font-bold">
                    {students.length > 0 ? (
                      students.reduce((sum, s) => {
                        const percentage = parseFloat(calculatePercentage(calculateTotalMarks(s.subjects), 
                          Object.values(s.subjects).reduce((total, sub) => total + sub.maxTheory + sub.maxPractical, 0)));
                        return sum + percentage;
                      }, 0) / students.length
                    ).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Export Button */}
          <div className="flex justify-end gap-4">
            <button
              onClick={exportToExcel}
              disabled={students.length === 0}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center transition-all shadow-lg transform hover:scale-105"
            >
              <Download className="mr-3" size={24} />
              Export Complete Grade Sheet to Excel
            </button>

            <button
              onClick={downloadClassTxt}
              disabled={students.length === 0}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg font-bold text-lg flex items-center transition-all shadow-lg"
            >
              <FileText className="mr-3" size={20} />
              Download Class Results
            </button>
          </div>

          {/* Information Footer */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-3 text-lg">📊 System Features:</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>✓ <strong>Automatic Calculations:</strong> Total marks, percentage, grade, and CGPA computed automatically</li>
              <li>✓ <strong>Grading System:</strong> A1 (91-100%), A2 (81-90%), B1 (71-80%), B2 (61-70%), C1 (51-60%), C2 (41-50%), D (33-40%), E (Below 33% - Fail)</li>
              <li>✓ <strong>Excel Export:</strong> Complete grade sheet with all student data, subject-wise marks, and class statistics</li>
              <li>✓ <strong>Individual Report Cards:</strong> Click the document icon next to each student to generate their personalized report card</li>
              <li>✓ <strong>Co-Scholastic Assessment:</strong> Track performance in discipline, sports, arts, and leadership</li>
              <li>✓ <strong>Real-time Statistics:</strong> Class performance metrics updated automatically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradingSystem;