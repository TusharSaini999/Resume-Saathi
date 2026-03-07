import { Router } from 'express';
import verifyJwt from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import { uploadResume } from '../controllers/resume.controller.js';
const resumeRouter = Router();

resumeRouter.post('/upload', verifyJwt, upload.single('resume'), uploadResume);

export default resumeRouter;
