const XLSX = require('xlsx');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const MarksModel = require('../Models/MarksModel');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-gemini-api-key');

// Rate limiting for AI calls
let aiCallCount = 0;
const AI_CALL_LIMIT = 10; // Reduced for testing
const resetTime = Date.now();

// Upload and process Excel file
const uploadMarks = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    console.log('Starting Excel processing...');

    // Parse Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log(`Found ${data.length} rows in Excel file`);

    const processedMarks = [];

    // Updated email mapping for all your students
    const emailMapping = {
      'CS001': 'vaibhav@example.com',
      'CS002': 'monishka@example.com', 
      'CS003': 'jainrishabh2610@gmail.com',
      'CS004': 'monishkayesim@gmail.com',
      'CS005': 'rishabh@example.com'
    };

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      console.log(`Processing row ${i + 1}:`, row);
      
      // Extract data from Excel row
      const rollNo = row['Roll No'] || row['RollNo'] || row['roll_no'];
      const email = emailMapping[rollNo] || 'unknown@example.com';
      
      console.log(`Roll No: ${rollNo}, Email: ${email}`);
      
      const studentData = {
        rollNo: rollNo,
        name: row['Name'] || row['Student Name'] || row['name'],
        email: email,
        subject: row['Subject'] || row['subject'],
        exam: row['Exam'] || row['exam'],
        remarks: row['Remarks'] || row['remarks'] || '', // Add remarks field
        marks: {
          obtained: parseFloat(row['Obtained'] || row['obtained'] || row['Marks Obtained'] || 0),
          total: parseFloat(row['Total'] || row['total'] || row['Total Marks'] || 100),
          percentage: 0
        }
      };

      // Calculate percentage
      studentData.marks.percentage = (studentData.marks.obtained / studentData.marks.total) * 100;

      console.log(`Student: ${studentData.name}, Subject: ${studentData.subject}, Percentage: ${studentData.marks.percentage}%`);

      // Generate AI analysis using remarks and performance data
      let aiAnalysis;
      if (aiCallCount < AI_CALL_LIMIT) {
        try {
          console.log(`Making AI call ${aiCallCount + 1}/${AI_CALL_LIMIT}`);
          aiAnalysis = await generateAIAnalysisWithRemarks(studentData);
          aiCallCount++;
          console.log('AI analysis successful');
        } catch (error) {
          console.error('AI Analysis failed:', error);
          aiAnalysis = getFallbackAnalysis(studentData);
        }
      } else {
        console.log('AI call limit reached, using fallback analysis');
        aiAnalysis = getFallbackAnalysis(studentData);
      }
      
      studentData.aiAnalysis = aiAnalysis;

      // Save to database
      try {
        const marksRecord = new MarksModel(studentData);
        await marksRecord.save();
        console.log(`Saved record for ${studentData.name} - ${studentData.subject}`);
      } catch (dbError) {
        console.error('Database save error:', dbError);
        throw dbError;
      }
      
      processedMarks.push(studentData);
    }

    console.log(`Successfully processed ${processedMarks.length} records`);

    res.json({
      success: true,
      message: `${processedMarks.length} records processed successfully`,
      data: processedMarks,
      aiCallsUsed: aiCallCount
    });

  } catch (error) {
    console.error('Error processing marks:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Enhanced AI analysis using remarks
const generateAIAnalysisWithRemarks = async function(studentData) {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
    Analyze the following Computer Science student performance data and provide insights:
    
    Student: ${studentData.name}
    Roll No: ${studentData.rollNo}
    Subject: ${studentData.subject}
    Exam: ${studentData.exam}
    Marks: ${studentData.marks.obtained}/${studentData.marks.total} (${studentData.marks.percentage.toFixed(1)}%)
    Teacher's Remarks: "${studentData.remarks || 'No specific remarks'}"
    
    Based on the subject (${studentData.subject}), performance, and teacher's remarks, provide:
    1. Performance Grade (A+/A/B+/B/C/D/F)
    2. Strengths (2-3 specific points related to ${studentData.subject})
    3. Areas for Improvement (2-3 specific suggestions for ${studentData.subject})
    4. Recommendations (2-3 actionable steps for ${studentData.subject})
    5. Overall Comment (considering both performance and remarks)
    
    Subject-specific context:
    - CN (Computer Networks): Focus on protocols, networking concepts, OSI model
    - DBMS (Database Management Systems): Focus on SQL, normalization, transactions
    - OS (Operating Systems): Focus on processes, memory management, scheduling
    
    Format the response as JSON with keys: grade, strengths, improvements, recommendations, comment
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
      
      // Enhance with subject-specific insights
      return enhanceWithSubjectContext(parsed, studentData);
    } catch {
      return getFallbackAnalysis(studentData);
    }
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return getFallbackAnalysis(studentData);
  }
}

// Enhanced fallback with subject-specific context
const getFallbackAnalysis = (studentData) => {
  const subject = studentData.subject.toLowerCase();
  const percentage = studentData.marks.percentage;
  const remarks = studentData.remarks;
  
  let subjectSpecific = {
    strengths: [],
    improvements: [],
    recommendations: []
  };
  
  // Subject-specific insights
  if (subject.includes('cn') || subject.includes('network')) {
    subjectSpecific = {
      strengths: percentage >= 70 ? 
        ["Good understanding of networking protocols", "Shows grasp of OSI model concepts"] :
        ["Basic understanding of network fundamentals", "Familiar with basic protocols"],
      improvements: percentage < 70 ? 
        ["Need to focus on TCP/IP stack", "Practice more on routing algorithms", "Study network security concepts"] :
        ["Deepen understanding of advanced protocols", "Explore network optimization"],
      recommendations: ["Practice network simulation tools", "Study real-world network scenarios", "Focus on hands-on lab work"]
    };
  } else if (subject.includes('dbms') || subject.includes('database')) {
    subjectSpecific = {
      strengths: percentage >= 70 ? 
        ["Good SQL query writing skills", "Understanding of database design principles"] :
        ["Basic knowledge of database concepts", "Familiar with simple queries"],
      improvements: percentage < 70 ? 
        ["Practice complex SQL queries", "Study normalization thoroughly", "Focus on transaction management"] :
        ["Learn advanced database optimization", "Study distributed databases"],
      recommendations: ["Practice on real database systems", "Work on database design projects", "Study performance tuning"]
    };
  } else if (subject.includes('os') || subject.includes('operating')) {
    subjectSpecific = {
      strengths: percentage >= 70 ? 
        ["Good understanding of process management", "Grasps memory management concepts"] :
        ["Basic OS concepts understanding", "Familiar with process basics"],
      improvements: percentage < 70 ? 
        ["Study scheduling algorithms deeply", "Focus on memory management", "Practice deadlock scenarios"] :
        ["Learn advanced OS concepts", "Study distributed systems"],
      recommendations: ["Practice OS programming", "Use Linux command line extensively", "Study kernel programming"]
    };
  }
  
  // Include remarks in analysis
  let remarksAnalysis = "";
  if (remarks) {
    remarksAnalysis = ` Teacher noted: "${remarks}".`;
  }
  
  return {
    grade: percentage >= 90 ? 'A+' : 
           percentage >= 80 ? 'A' : 
           percentage >= 70 ? 'B+' : 
           percentage >= 60 ? 'B' : 
           percentage >= 50 ? 'C' : 
           percentage >= 40 ? 'D' : 'F',
    strengths: subjectSpecific.strengths,
    improvements: subjectSpecific.improvements,
    recommendations: subjectSpecific.recommendations,
    comment: `Student scored ${percentage.toFixed(1)}% in ${studentData.subject}.${remarksAnalysis} ${percentage < 60 ? 'Needs significant improvement.' : percentage < 80 ? 'Good progress, can improve further.' : 'Excellent performance!'}`
  };
};

// Enhanced analysis with subject context
const enhanceWithSubjectContext = (analysis, studentData) => {
  const subject = studentData.subject;
  const remarks = studentData.remarks;
  
  // Add subject context to comment if remarks exist
  if (remarks && analysis.comment) {
    analysis.comment += ` Teacher's observation: "${remarks}"`;
  }
  
  return analysis;
};

// Keep existing functions unchanged
const getStudentMarks = async (req, res) => {
  try {
    const { rollNo } = req.params;
    const marks = await MarksModel.find({ rollNo }).sort({ createdAt: -1 });
    
    if (!marks.length) {
      return res.status(404).json({ success: false, message: "No marks found for this student" });
    }

    res.json({ success: true, data: marks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStudentMarksByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    console.log(`Searching for marks with email: ${email}`);
    
    const marks = await MarksModel.find({ email }).sort({ createdAt: -1 });
    
    console.log(`Found ${marks.length} marks for email: ${email}`);
    
    if (!marks.length) {
      return res.status(404).json({ 
        success: false, 
        message: "No marks found for this student",
        email: email 
      });
    }

    res.json({ success: true, data: marks });
  } catch (error) {
    console.error('Error in getStudentMarksByEmail:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllMarks = async (req, res) => {
  try {
    const marks = await MarksModel.find().sort({ createdAt: -1 });
    res.json({ success: true, data: marks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadMarks, getStudentMarks, getAllMarks, getStudentMarksByEmail, generateAIAnalysisWithRemarks };