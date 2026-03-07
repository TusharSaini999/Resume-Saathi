import multer from 'multer';
import path from 'path';
import ApiError from '../utils/ApiError.js';
import fs from 'fs';
const uploadDir = path.resolve('uploads');

// create folder if it does not exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMime = 'application/pdf';
  const allowedExt = '.pdf';
  if (
    file.mimetype === allowedMime ||
    path.extname(file.originalname).toLowerCase() === allowedExt
  ) {
    cb(null, true);
  } else {
    cb(new ApiError(404, 'Only upload pdf file!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
