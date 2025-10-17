const express = require("express");
const multer = require("multer");
const MarksRouter = express.Router();

const { uploadMarks, getStudentMarks, getAllMarks, getStudentMarksByEmail } = require("../Controllers/Marks.controller");

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed!'));
    }
  }
});

MarksRouter.post("/upload", upload.single("marksFile"), uploadMarks);
MarksRouter.get("/student/:rollNo", getStudentMarks);
MarksRouter.get("/student/email/:email", getStudentMarksByEmail); // Add this line
MarksRouter.get("/all", getAllMarks);

module.exports = MarksRouter;