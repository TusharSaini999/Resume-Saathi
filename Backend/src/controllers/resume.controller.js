import mongoose from 'mongoose';
import ResumesCollection from '../models/resumes_collection.model.js';
// import ResumesAnalytics from '../models/resume_analysis.model.js';
// import LayoutAnalysis from '../models/layout_analysis.model.js';
// import JobDescription from '../models/jobDescription.model.js';
import User from '../models/user.model.js';
import PdfParese from '../utils/PdfParse.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import cloudinary from '../utils/cloudinary.js';

const uploadResume = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, 'Invalid user ID');
  }
  const file = req.file;
  if (!file) {
    throw new ApiError(400, 'No file uploaded');
  }

  const resUpload = await cloudinary.fileUpload(file);

  console.log('Cloudinary upload result:', resUpload);
  const pdf = new PdfParese();
  const pdfText = await pdf.pdfParseText(file.path);
  const formatResume = await pdf.getAllPagesRawContent(file.path);

  console.log('PDF Text:', pdfText);
  console.log('Formatted Resume:', formatResume);

  const resumeDoc = await ResumesCollection.create({
    user_id: userId,
    resume_url: resUpload.secure_url,
    parsed_data: pdfText,
    raw_pdf_response: JSON.stringify(formatResume),
  });

  if (!resumeDoc) {
    throw new ApiError(500, 'Failed to save resume data');
  }
  const userRes = await User.findByIdAndUpdate(
    userId,
    { resume_id: resumeDoc._id },
    { returnDocument: 'after' }
  );
  if (!userRes) {
    throw new ApiError(500, 'Failed to update user with resume ID');
  }

  res
    .status(201)
    .json(new ApiResponse(true, 'Resume uploaded successfully', { resume: resumeDoc }));
});

export { uploadResume };
