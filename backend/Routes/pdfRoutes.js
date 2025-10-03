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
} = require("../Controllers/NotesUpload.controller");

pdfRouter.post("/upload-files", verifyUser, upload.single("file"), uploadPdf);
pdfRouter.get("/show-pdfs", verifyUser, showPdfs);

module.exports = pdfRouter;
