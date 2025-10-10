const express = require("express");
const multer = require("multer");
const VideoLectureRouter = express.Router();
const {
  uploadVideoLecture,
  getAllVideoLectures,
  getVideoLectureById,
  getTeacherVideoLectures,
  deleteVideoLecture,
  getVideoStatistics,
  getSubjectsBySemester,
  getSemesterSubjectMapping
} = require("../Controllers/Video.controller");
const { verifyUser } = require("../Middlewares/verifyUserMiddleware");
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads', 'videos');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config for video uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mkv', 'video/mov', 'video/wmv'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files (mp4, avi, mkv, mov, wmv) are allowed!'), false);
    }
  }
});

// Public routes
VideoLectureRouter.get("/", getAllVideoLectures);
VideoLectureRouter.get("/statistics", getVideoStatistics);
VideoLectureRouter.get("/semester-subjects", getSemesterSubjectMapping); // New route
VideoLectureRouter.get("/subjects/:semester", getSubjectsBySemester); // New route
VideoLectureRouter.get("/:id", getVideoLectureById);

// Protected routes (require authentication)
VideoLectureRouter.post("/upload", verifyUser, upload.single('video'), uploadVideoLecture);
VideoLectureRouter.get("/teacher/my-videos", verifyUser, getTeacherVideoLectures);
VideoLectureRouter.delete("/:id", verifyUser, deleteVideoLecture);

// Error handling middleware for multer
VideoLectureRouter.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 100MB.'
      });
    }
  }
  
  if (error.message.includes('Only video files')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
});

module.exports = VideoLectureRouter;