import mongoose from 'mongoose';
import ResumesCollection from '../models/resumes_collection.model.js';
import ResumeAnalysis from '../models/resume_analysis.model.js';
// import JobDescription from '../models/jobDescription.model.js';
import User from '../models/user.model.js';
import PdfParese from '../utils/PdfParse.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import cloudinary from '../utils/cloudinary.js';
import pdfAnalyzer from '../analyzer/pdf_analyzer.js';

const uploadResume = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, 'Invalid user ID');
  }
  const file = req.file;
  if (!file) {
    throw new ApiError(400, 'No file uploaded');
  }

  const pdfParser = new PdfParese();
  const pdfText = await pdfParser.getText(file.path);
  const formatResume = await pdfParser.getAllPagesRawContent(file.path);

  const resUpload = await cloudinary.fileUpload(file);

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

  const PdfAnalysis = new pdfAnalyzer();
  const analysisResult = await PdfAnalysis.analyzePdf(resumeDoc.parsed_data);

  if (!analysisResult) {
    throw new ApiError(500, 'Failed to analyze resume');
  }

  const savedAnalysis = await ResumeAnalysis.findOneAndUpdate(
    { user_id: userId, resume_id: resumeDoc._id },
    { ...analysisResult, user_id: userId, resume_id: resumeDoc._id },
    { upsert: true, returnDocument: 'after', runValidators: true }
  );
  if (!savedAnalysis) {
    throw new ApiError(500, 'Failed to save resume analysis');
  }
  res
    .status(201)
    .json(new ApiResponse(true, 'Resume uploaded successfully', { resume: resumeDoc }));
});

const reUploadResume = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, 'Invalid user ID');
  }
  const file = req.file;
  if (!file) {
    throw new ApiError(400, 'No file uploaded');
  }
  //Delete old resume from DB and Cloudinary
  const resumeExit = await ResumesCollection.findOne({ user_id: userId });
  if (resumeExit) {
    await ResumesCollection.findByIdAndDelete(resumeExit._id);
    await ResumeAnalysis.findOneAndDelete({ user_id: userId, resume_id: resumeExit._id });
  }

  const pdfParser = new PdfParese();
  const pdfText = await pdfParser.getText(file.path);
  const formatResume = await pdfParser.getAllPagesRawContent(file.path);

  const resUpload = await cloudinary.fileUpload(file);

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

  const PdfAnalysis = new pdfAnalyzer();
  const analysisResult = await PdfAnalysis.analyzePdf(resumeDoc.parsed_data);

  if (!analysisResult) {
    throw new ApiError(500, 'Failed to analyze resume');
  }

  const savedAnalysis = await ResumeAnalysis.findOneAndUpdate(
    { user_id: userId, resume_id: resumeDoc._id },
    { ...analysisResult, user_id: userId, resume_id: resumeDoc._id },
    { upsert: true, returnDocument: 'after', runValidators: true }
  );
  if (!savedAnalysis) {
    throw new ApiError(500, 'Failed to save resume analysis');
  }
  res
    .status(201)
    .json(new ApiResponse(true, 'Resume Reuploaded successfully', { resume: resumeDoc }));
});

// // curl.exe -X POST http://localhost:5000/api/v1/resumes/reupload -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YWMzN2EzNzY3ODMwZDAyZTRkNjIxMyIsImVtYWlsIjoidGVzdHVzZXJnbWFpbEBnbWFpbC5jb20iLCJpYXQiOjE3NzI5MzQwNTAsImV4cCI6MTgwNDQ5MTY1MH0.a-2Si_J5UeJUehnxYnvhnVr2VOSrX9iUNG71EjNmFl0" -F "resume=@C:\Users\tusha\Downloads\TusharSaini_SDE_Resume.pdf"
export { uploadResume, reUploadResume };
