import { Router } from "express";
import verifyJwt, { optionalVerifyJwt } from "../middlewares/auth.middleware.js";
import {
  getCompanies,
  getCompanyProfile,
  verifyJobOnline,
  scanCompanyPortal,
  getCareerJobs,
  getHealth,
  purgeCache,
  postJobProfile,
  trackJob,
  getTrackedJobs,
  updateTrackedStatus,
  deleteTrackedJob,
  getFullJobDescription,
} from "../controllers/career.controller.js";

const careerRouter = Router();

// Public / Personalized Discovery Endpoints
careerRouter.get("/health", getHealth);
careerRouter.get("/companies", optionalVerifyJwt, getCompanies);
careerRouter.get("/companies/:slug", optionalVerifyJwt, getCompanyProfile);
careerRouter.get("/verify-online", optionalVerifyJwt, verifyJobOnline);
careerRouter.post("/verify-online", optionalVerifyJwt, verifyJobOnline);
careerRouter.post("/check-job", optionalVerifyJwt, verifyJobOnline);
careerRouter.get("/scan-portal", optionalVerifyJwt, scanCompanyPortal);
careerRouter.post("/scan-portal", optionalVerifyJwt, scanCompanyPortal);
careerRouter.get("/jobs", optionalVerifyJwt, getCareerJobs);
careerRouter.post("/jobs/full-description", optionalVerifyJwt, getFullJobDescription);
careerRouter.get("/jobs/full-description", optionalVerifyJwt, getFullJobDescription);
careerRouter.post("/clear-cache", optionalVerifyJwt, purgeCache);
careerRouter.post("/post-job", optionalVerifyJwt, postJobProfile);

// Authenticated Candidate Application Tracking
careerRouter.post("/track", verifyJwt, trackJob);
careerRouter.get("/tracked", verifyJwt, getTrackedJobs);
careerRouter.patch("/tracked/:id", verifyJwt, updateTrackedStatus);
careerRouter.delete("/tracked/:id", verifyJwt, deleteTrackedJob);

export default careerRouter;
