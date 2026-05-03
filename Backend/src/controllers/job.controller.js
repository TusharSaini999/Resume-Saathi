import mongoose from 'mongoose';
import ResumesCollection from '../models/resumes_collection.model.js';
import JobDescription from '../models/jobDescription.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import Analyzer from '../analyzer/analyzer.js';

const check = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const resumeId = req.user.resume_id;
  const { company_name, description } = req.body;
  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    throw new ApiError(400, 'Invalid Resume ID');
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, 'Invalid User ID');
  }

  const resume = await ResumesCollection.findById(resumeId);
  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }
  const resumeText = resume.parsed_data;
  const analiys = new Analyzer();
  const analysisResult = await analiys.analyzeJDToResume(resumeText, description);
  if (!analysisResult) {
    throw new ApiError(500, 'Failed to analyze job description');
  }

  const jobResp = await JobDescription.create({
    user_id: userId,
    resume_id: resumeId,
    company_name,
    description,
    title: analysisResult.title,
    jd_analysis: { ...analysisResult },
  });

  if (!jobResp) {
    throw new ApiError(500, 'Failed to save job description analysis');
  }
  res.status(200).json(new ApiResponse(true,200, 'Job description analyzed successfully', jobResp));
});

const search = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { query } = req.query;
  if (!query) {
    throw new ApiError(400, 'Search query is required');
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, 'Invalid User ID');
  }
  const jobs = await JobDescription.find({
    title: { $regex: query, $options: 'i' }, // 'i' = case-insensitive
  });
  res.status(200).json(new ApiResponse(true,200, 'Search results retrieved successfully', jobs));
});

const get = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, 'Invalid User ID');
  }
  const jobs = await JobDescription.find({ user_id: userId }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(true,200, 'Job descriptions retrieved successfully', jobs));
});

export { check, search, get };
