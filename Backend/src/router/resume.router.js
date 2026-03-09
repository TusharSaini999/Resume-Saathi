import { Router } from 'express';
import verifyJwt from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import { reUploadResume, uploadResume, } from '../controllers/resume.controller.js';
const resumeRouter = Router();

resumeRouter.post('/upload', verifyJwt, upload.single('resume'), uploadResume);
resumeRouter.post('/reUpload', verifyJwt, upload.single('resume'), reUploadResume);

export default resumeRouter;
// curl.exe -X POST http://localhost:5000/api/v1/resumes/reUpload -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YWMzN2EzNzY3ODMwZDAyZTRkNjIxMyIsImVtYWlsIjoidGVzdHVzZXJnbWFpbEBnbWFpbC5jb20iLCJpYXQiOjE3NzI5MzQwNTAsImV4cCI6MTgwNDQ5MTY1MH0.a-2Si_J5UeJUehnxYnvhnVr2VOSrX9iUNG71EjNmFl0" -F "resume=@C:\Users\tusha\Downloads\TusharSaini_SDE_Resume.pdf"
