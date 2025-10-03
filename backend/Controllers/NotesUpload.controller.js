const cloudinary = require("cloudinary").v2;
const { Pdf } = require("../Models/pdfModel");
const uploadPdf = (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");

  const originalName = req.body.fileName || req.file.originalname;
  const baseName = originalName.replace(/\.[^/.]+$/, "");

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      resource_type: "raw",
      folder: "MPRpdfs",
      public_id: baseName,
      format: "pdf",
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    },
    (error, result) => {
      if (error) return res.status(500).send("Error uploading file.");

      const newPdf = new Pdf({
        pdf: result.secure_url,
        fileName: req.body.fileName || req.file.originalname,
        subject: req.body.subject,
        year: req.body.year,
        branch: req.body.branch,
        uploadedBy: req.body.uploadedBy,
      });

      newPdf
        .save()
        .then(() =>
          res.send({
            url: result.secure_url,
            message: "File uploaded and saved successfully",
          })
        )
        .catch(() => res.status(500).send("File uploaded but saving failed"));
    }
  );
  uploadStream.end(req.file.buffer);
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
  } catch {
    res.status(500).send("Error retrieving PDFs");
  }
};
module.exports = { uploadPdf, showPdfs };
