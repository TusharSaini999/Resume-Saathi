import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";
import ApiError from "../utils/ApiError.js";

// Upload directory
const uploadDir = process.env.VERCEL
  ? path.join(os.tmpdir(), "uploads")
  : path.resolve("uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname).toLowerCase();

    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter for PDF and DOCX validation
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const allowedExts = [".pdf", ".docx", ".doc"];
  const allowedMimes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "application/octet-stream",
    "application/x-zip-compressed",
    "application/zip"
  ];

  const hasValidExt = allowedExts.includes(ext);
  const hasValidMime = allowedMimes.includes(file.mimetype) || !file.mimetype;

  if (hasValidExt && hasValidMime) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Only PDF (.pdf) and Word (.docx) files are allowed"), false);
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export default upload;


// curl.exe -X POST http://localhost:5000/api/v1/resumes/upload -F "resume=@C:\Project\Resume-Saathi\New Microsoft Word Document.pdf"