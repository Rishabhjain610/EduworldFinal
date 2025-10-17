const { VideoLecture, SEMESTER_SUBJECTS } = require("../Models/Video.model");
const { User } = require("../Models/UserModel");
const cloudinary = require("../Util/Cloudinary");
const fs = require('fs');

// Get subjects by semester
const getSubjectsBySemester = async (req, res) => {
  try {
    const { semester } = req.params;
    
    if (!semester) {
      return res.status(400).json({
        success: false,
        message: "Semester parameter is required"
      });
    }

    const subjects = SEMESTER_SUBJECTS[semester];
    
    if (!subjects) {
      return res.status(404).json({
        success: false,
        message: "Invalid semester"
      });
    }

    res.json({
      success: true,
      semester,
      subjects
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching subjects",
      error: error.message
    });
  }
};

// Get all semesters and subjects mapping
const getSemesterSubjectMapping = async (req, res) => {
  try {
    res.json({
      success: true,
      semesterSubjects: SEMESTER_SUBJECTS,
      availableSemesters: Object.keys(SEMESTER_SUBJECTS)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching semester-subject mapping",
      error: error.message
    });
  }
};

// Upload video lecture (Teacher only) - Updated validation
const uploadVideoLecture = async (req, res) => {
  try {
    const { title, description, subject, semester } = req.body;
    const teacher = req.user;

    if (teacher.role !== "teacher") {
      return res.status(403).json({ 
        success: false, 
        message: "Only teachers can upload video lectures" 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "Please upload a video file" 
      });
    }

    // Validate required fields
    if (!title || !description || !subject || !semester) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false, 
        message: "Title, description, subject, and semester are required" 
      });
    }

    // Validate subject belongs to semester
    const semesterSubjects = SEMESTER_SUBJECTS[semester];
    if (!semesterSubjects || !semesterSubjects.includes(subject)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: `Subject "${subject}" is not valid for ${semester}. Available subjects: ${semesterSubjects?.join(', ')}`
      });
    }

    console.log("Uploading video to Cloudinary...");
    
    // Upload video to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "video_lectures",
      transformation: [
        { quality: "auto" },
        { format: "mp4" }
      ]
    });

    // Delete local file
    fs.unlinkSync(req.file.path);

    // Create video lecture record
    const videoLecture = new VideoLecture({
      title,
      description,
      subject,
      semester,
      videoUrl: result.secure_url,
      duration: result.duration || 0,
      fileSize: result.bytes || 0,
      cloudinaryId: result.public_id,
      uploadedBy: teacher.id,
      isActive: true

    });

    await videoLecture.save();

    res.json({
      success: true,
      message: "Video lecture uploaded successfully",
      videoLecture: {
        id: videoLecture._id,
        title: videoLecture.title,
        subject: videoLecture.subject,
        semester: videoLecture.semester,
        videoUrl: videoLecture.videoUrl,
        duration: videoLecture.duration
      }
    });

  } catch (error) {
    // Clean up uploaded file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    console.error("Error uploading video:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading video lecture",
      error: error.message
    });
  }
};

// ... (keep all other existing functions)
const getAllVideoLectures = async (req, res) => {
  try {
    const { 
      subject, 
      semester, 
      search, 
      sortBy = "createdAt", 
      sortOrder = "desc", 
      page = 1, 
      limit = 12
    } = req.query;

    // Build filter object
    let filter = { isActive: true };
    
    if (subject && subject !== 'all') {
      filter.subject = subject;
    }
    
    if (semester && semester !== 'all') {
      filter.semester = semester;
    }
    
    // Add search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    let sortObj = {};
    if (sortBy === 'title') {
      sortObj.title = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortObj.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get videos with teacher info
    const videoLectures = await VideoLecture.find(filter)
      .populate('uploadedBy', 'username')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .select('title description subject semester videoUrl duration createdAt uploadedBy');

    // Get total count for pagination
    const totalCount = await VideoLecture.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      videoLectures: videoLectures.map(video => ({
        _id: video._id,
        title: video.title,
        description: video.description,
        subject: video.subject,
        semester: video.semester,
        videoUrl: video.videoUrl,
        duration: video.duration,
        createdAt: video.createdAt,
        teacher: video.uploadedBy.username
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      },
      filters: {
        subject,
        semester,
        search,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error("Error fetching video lectures:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching video lectures",
      error: error.message
    });
  }
};

const getVideoLectureById = async (req, res) => {
  try {
    const { id } = req.params;

    const videoLecture = await VideoLecture.findById(id)
      .populate('uploadedBy', 'username email');

    if (!videoLecture) {
      return res.status(404).json({
        success: false,
        message: "Video lecture not found"
      });
    }

    res.json({
      success: true,
      videoLecture
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching video lecture",
      error: error.message
    });
  }
};

const getTeacherVideoLectures = async (req, res) => {
  try {
    const teacher = req.user;
    const { page = 1, limit = 10 } = req.query;

    if (teacher.role !== "teacher") {
      return res.status(403).json({ 
        success: false, 
        message: "Only teachers can view their uploaded videos" 
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const videoLectures = await VideoLecture.find({ 
      uploadedBy: teacher.id 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .select('title subject semester createdAt isActive duration');

    const totalCount = await VideoLecture.countDocuments({ uploadedBy: teacher.id });

    res.json({
      success: true,
      videoLectures,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching teacher's video lectures",
      error: error.message
    });
  }
};

const deleteVideoLecture = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = req.user;

    if (teacher.role !== "teacher") {
      return res.status(403).json({ 
        success: false, 
        message: "Only teachers can delete video lectures" 
      });
    }

    const videoLecture = await VideoLecture.findById(id);
    if (!videoLecture) {
      return res.status(404).json({
        success: false,
        message: "Video lecture not found"
      });
    }

    // Check if teacher owns this video
    if (videoLecture.uploadedBy.toString() !== teacher.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own video lectures"
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(videoLecture.cloudinaryId, { resource_type: "video" });

    // Delete from database
    await VideoLecture.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Video lecture deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting video lecture",
      error: error.message
    });
  }
};

const getVideoStatistics = async (req, res) => {
  try {
    const stats = await VideoLecture.aggregate([
      {
        $group: {
          _id: null,
          totalVideos: { $sum: 1 }
        }
      }
    ]);

    const subjectCounts = await VideoLecture.aggregate([
      { $group: { _id: "$subject", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const semesterCounts = await VideoLecture.aggregate([
      { $group: { _id: "$semester", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      statistics: {
        totalVideos: stats[0]?.totalVideos || 0,
        subjectDistribution: subjectCounts,
        semesterDistribution: semesterCounts
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message
    });
  }
};

module.exports = {
  uploadVideoLecture,
  getAllVideoLectures,
  getVideoLectureById,
  getTeacherVideoLectures,
  deleteVideoLecture,
  getVideoStatistics,
  getSubjectsBySemester,
  getSemesterSubjectMapping
};