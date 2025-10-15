
// const cloudinary = require("cloudinary").v2;
// const { Pdf } = require("../Models/pdfModel");
// const SummaryModel = require("../Models/SummaryModel");
// const pdfParse = require("pdf-parse-new");
// const { GoogleGenAI } = require("@google/genai");

// // Initialize Gemini client
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Extract text from PDF using pdf-parse-new
// const extractTextDirect = async (pdfBuffer) => {
//   try {
//     const data = await pdfParse(pdfBuffer);
//     console.log("EXTRACTED TEXT:", data.text);
//     return data.text.trim();
//   } catch (error) {
//     console.error("pdf-parse-new text extraction failed:", error);
//     throw new Error("Failed to extract text from PDF");
//   }
// };

// // Upload PDF and extract text before uploading
// const uploadPdf = async (req, res) => {
//   try {
//     console.log("UPLOAD: Starting uploadPdf...");
//     if (!req.file) return res.status(400).send("No file uploaded.");

//     const originalName = req.body.fileName || req.file.originalname;
//     const baseName = originalName.replace(/\.[^/.]+$/, "");
//     const pdfBuffer = req.file.buffer;

//     // Extract text before uploading
//     console.log("UPLOAD: Extracting text from PDF...");
//     const extractedText = await extractTextDirect(pdfBuffer);
//     console.log("EXTRACTED TEXT (UPLOAD):", extractedText);

//     // Upload to Cloudinary
//     console.log("UPLOAD: Uploading PDF to Cloudinary...");
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: "raw",
//         folder: "MPRpdfs",
//         public_id: baseName,
//         format: "pdf",
//         use_filename: true,
//         unique_filename: false,
//         overwrite: true,
//       },
//       async (error, result) => {
//         if (error) {
//           console.error("UPLOAD: Cloudinary error:", error);
//           return res.status(500).send("Error uploading file.");
//         }

//         // Save PDF info and extracted text to DB
//         console.log("UPLOAD: Saving PDF info to DB...");
//         const newPdf = new Pdf({
//           pdf: result.secure_url,
//           fileName: originalName,
//           subject: req.body.subject,
//           year: req.body.year,
//           branch: req.body.branch,
//           uploadedBy: req.body.uploadedBy,
//           extractedText: extractedText
//         });

//         try {
//           await newPdf.save();
//           console.log("UPLOAD: PDF saved successfully.");
//           res.send({
//             url: result.secure_url,
//             message: "File uploaded and saved successfully",
//           });
//         } catch (dbError) {
//           console.error("UPLOAD: DB save error:", dbError);
//           res.status(500).send("File uploaded but saving failed");
//         }
//       }
//     );
//     uploadStream.end(pdfBuffer);
//   } catch (error) {
//     console.error("UPLOAD: Error in uploadPdf:", error);
//     res.status(500).send("Error uploading and extracting PDF");
//   }
// };

// const showPdfs = async (req, res) => {
//   const { year, branch, subject } = req.query;
//   const filter = {};
//   if (year) filter.year = year;
//   if (branch) filter.branch = branch;
//   if (subject) filter.subject = subject;

//   try {
//     console.log("SHOWPDFS: Fetching PDFs...");
//     const allPdfs = await Pdf.find(filter);
//     res.json(allPdfs);
//   } catch (error) {
//     console.error("SHOWPDFS: Error fetching PDFs:", error);
//     res.status(500).send("Error retrieving PDFs");
//   }
// };

// // Gemini summary using extracted text from DB
// const generatePdfSummary = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const studentId = req.user?.id || 'anonymous';
//     console.log(`SUMMARY: Generating summary for PDF ID: ${id}, Student ID: ${studentId}`);

//     // Check for cached summary
//     const existingSummary = await SummaryModel.findOne({ pdfId: id, studentId });
//     if (existingSummary) {
//       console.log('SUMMARY: Found cached summary');
//       return res.json({ success: true, summary: existingSummary.summary, extractedText: existingSummary.extractedText, cached: true });
//     }

//     // Get PDF and extracted text
//     const pdfDocument = await Pdf.findById(id);
//     if (!pdfDocument) {
//       console.error("SUMMARY: PDF not found");
//       return res.status(404).json({ success: false, error: "PDF not found" });
//     }

//     const extractedText = pdfDocument.extractedText;
//     console.log("EXTRACTED TEXT (SUMMARY):", extractedText);
//     if (!extractedText || extractedText.trim().length === 0) {
//       console.error("SUMMARY: No extracted text found in DB");
//       return res.status(400).json({ success: false, error: "No extracted text found for this PDF." });
//     }

//     const cleanText = extractedText.replace(/\s+/g, ' ').trim();
//     const textToSummarize = cleanText.substring(0, 25000);

//     // Prepare Gemini prompt
//     const prompt = `
// You are an expert teacher assistant.
// Summarize the following document in 2 concise paragraphs.

// Document:
// ${textToSummarize}
//     `;

//     // Call Gemini API using the @google/genai SDK
//     const result = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: [prompt],
//     });

//     const summary = result.text;

//     console.log('SUMMARY: AI summary generated successfully');

//     // Store summary and extractedText in SummaryModel
//     const newSummary = new SummaryModel({
//       pdfId: id,
//       studentId,
//       summary,
//       extractedText
//     });

//     await newSummary.save();
//     console.log('SUMMARY: Summary saved to database');

//     res.json({ success: true, summary, extractedText, cached: false });

//   } catch (error) {
//     console.error("SUMMARY: Error generating summary:", error);
//     let errorMessage = "Failed to generate summary";
//     if (error.message.includes('timeout')) {
//       errorMessage = "Request timeout - PDF processing takes longer for large files";
//     } else if (error.message.includes('ENOTFOUND')) {
//       errorMessage = "Network error - could not reach PDF or AI service";
//     } else if (error.message.includes('API key')) {
//       errorMessage = "AI service configuration error - check GEMINI_API_KEY";
//     } else if (error.message.includes('SAFETY')) {
//       errorMessage = "Content filtered by AI safety - try a different PDF";
//     }
//     res.status(500).json({ success: false, error: errorMessage, details: error.message });
//   }
// };
// const askQuestionFromPdf = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { question, history } = req.body; // Get question and chat history

//     if (!question) {
//       return res.status(400).json({ success: false, error: "Question is required." });
//     }

//     // Get the PDF document to access its extracted text
//     const pdfDocument = await Pdf.findById(id);
//     if (!pdfDocument || !pdfDocument.extractedText) {
//       return res.status(404).json({ success: false, error: "Document text not found." });
//     }

//     // Use the conversational chat model
//     const chat = ai.getGenerativeModel({ model: "gemini-1.5-flash" }).startChat({
//       history: [
//         {
//           role: "user",
//           parts: [{ text: `You are a helpful assistant. Your task is to answer questions based ONLY on the following document. If the answer is not found in the document, you must clearly state "I cannot find the answer in this document." Do not use any external knowledge. Here is the document:\n\n${pdfDocument.extractedText}` }],
//         },
//         {
//           role: "model",
//           parts: [{ text: "Understood. I will answer questions based only on the provided document." }],
//         },
//         // Include previous turns from the ongoing conversation
//         ...(history || []),
//       ],
//     });

//     const result = await chat.sendMessage(question);
//     const answer = result.response.text();

//     res.json({ success: true, answer });

//   } catch (error) {
//     console.error("Error in askQuestionFromPdf:", error);
//     res.status(500).json({ success: false, error: "Failed to get an answer from the AI." });
//   }
// };
// module.exports = {
//   uploadPdf,
//   showPdfs,
//   generatePdfSummary,
//   askQuestionFromPdf
// };
const cloudinary = require("cloudinary").v2;
const { Pdf } = require("../Models/pdfModel");
const SummaryModel = require("../Models/SummaryModel");
const pdfParse = require("pdf-parse-new");
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Correct import name

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Correct initialization

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Extract text from PDF using pdf-parse-new
const extractTextDirect = async (pdfBuffer) => {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text.trim();
  } catch (error) {
    console.error("pdf-parse-new text extraction failed:", error);
    throw new Error("Failed to extract text from PDF");
  }
};

// Upload PDF and extract text before uploading
const uploadPdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded.");

    const originalName = req.body.fileName || req.file.originalname;
    const pdfBuffer = req.file.buffer;
    const extractedText = await extractTextDirect(pdfBuffer);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "MPRpdfs",
        public_id: originalName.replace(/\.[^/.]+$/, ""),
        format: "pdf",
        overwrite: true,
      },
      async (error, result) => {
        if (error) {
          console.error("UPLOAD: Cloudinary error:", error);
          return res.status(500).send("Error uploading file.");
        }

        const newPdf = new Pdf({
          pdf: result.secure_url,
          fileName: originalName,
          subject: req.body.subject,
          year: req.body.year,
          branch: req.body.branch,
          uploadedBy: req.body.uploadedBy,
          extractedText: extractedText
        });

        await newPdf.save();
        res.send({
          url: result.secure_url,
          message: "File uploaded and saved successfully",
        });
      }
    );
    uploadStream.end(pdfBuffer);
  } catch (error) {
    console.error("UPLOAD: Error in uploadPdf:", error);
    res.status(500).send("Error uploading and extracting PDF");
  }
};

const showPdfs = async (req, res) => {
  const { year, branch, subject } = req.query;
  const filter = {};
  if (year) filter.year = year;
  if (branch) filter.branch = branch;
  if (subject) filter.subject = subject;

  try {
    const allPdfs = await Pdf.find(filter);
    res.json(allPdfs);
  } catch (error) {
    console.error("SHOWPDFS: Error fetching PDFs:", error);
    res.status(500).send("Error retrieving PDFs");
  }
};

// Gemini summary using extracted text from DB
const generatePdfSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user?.id || 'anonymous';

    const existingSummary = await SummaryModel.findOne({ pdfId: id, studentId });
    if (existingSummary) {
      return res.json({ success: true, summary: existingSummary.summary, cached: true });
    }

    const pdfDocument = await Pdf.findById(id);
    if (!pdfDocument || !pdfDocument.extractedText) {
      return res.status(404).json({ success: false, error: "Document text not found." });
    }

    const textToSummarize = pdfDocument.extractedText.replace(/\s+/g, ' ').trim().substring(0, 30000);
    const prompt = `You are an expert teacher assistant. Summarize the following document in 2 concise paragraphs.\n\nDocument:\n${textToSummarize}`;
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    const newSummary = new SummaryModel({ pdfId: id, studentId, summary, extractedText: pdfDocument.extractedText });
    await newSummary.save();

    res.json({ success: true, summary, cached: false });

  } catch (error) {
    console.error("SUMMARY: Error generating summary:", error);
    res.status(500).json({ success: false, error: "Failed to generate summary." });
  }
};

// Function to handle Q&A from the PDF
const askQuestionFromPdf = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, history } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, error: "Question is required." });
    }

    const pdfDocument = await Pdf.findById(id);
    if (!pdfDocument || !pdfDocument.extractedText) {
      return res.status(404).json({ success: false, error: "Document text not found." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `You are a helpful assistant. Your task is to answer questions based ONLY on the following document. If the answer is not found in the document you are free to answer but dont go off topic. Here is the document:\n\n${pdfDocument.extractedText}` }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I will answer questions based only on the provided document." }],
        },
        ...(history || []),
      ],
    });

    const result = await chat.sendMessage(question);
    const answer = result.response.text();

    res.json({ success: true, answer });

  } catch (error) {
    console.error("Error in askQuestionFromPdf:", error);
    res.status(500).json({ success: false, error: "Failed to get an answer from the AI." });
  }
};

module.exports = {
  uploadPdf,
  showPdfs,
  generatePdfSummary,
  askQuestionFromPdf
};