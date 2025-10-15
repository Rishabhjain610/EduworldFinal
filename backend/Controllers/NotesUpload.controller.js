
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