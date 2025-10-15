const express = require("express");
const pdfRouter = express.Router();
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
});
const { verifyUser } = require("../Middlewares/verifyUserMiddleware");
const {
  uploadPdf,
  showPdfs,
  generatePdfSummary,
  askQuestionFromPdf,
} = require("../Controllers/NotesUpload.controller");

pdfRouter.post("/upload-files", verifyUser, upload.single("file"), uploadPdf);
pdfRouter.get("/show-pdfs", verifyUser, showPdfs);
pdfRouter.post("/summary/:id", verifyUser, generatePdfSummary);
pdfRouter.post("/ask-question/:id", verifyUser, askQuestionFromPdf);
module.exports = pdfRouter;
