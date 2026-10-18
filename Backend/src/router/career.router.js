import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
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

// Public Health Check
careerRouter.get("/health", getHealth);

// Authenticated Endpoints: Requires Valid User Authentication
careerRouter.use(verifyJwt);

// Discovery & Verification Endpoints
careerRouter.get("/companies", getCompanies);
careerRouter.get("/companies/:slug", getCompanyProfile);
careerRouter.get("/verify-online", verifyJobOnline);
careerRouter.post("/verify-online", verifyJobOnline);
careerRouter.post("/check-job", verifyJobOnline);
careerRouter.get("/scan-portal", scanCompanyPortal);
careerRouter.post("/scan-portal", scanCompanyPortal);
careerRouter.get("/jobs", getCareerJobs);
careerRouter.post("/jobs/full-description", getFullJobDescription);
careerRouter.get("/jobs/full-description", getFullJobDescription);
careerRouter.post("/clear-cache", purgeCache);
careerRouter.post("/post-job", postJobProfile);

// Candidate Application Tracking Endpoints
careerRouter.post("/track", trackJob);
careerRouter.get("/tracked", getTrackedJobs);
careerRouter.patch("/tracked/:id", updateTrackedStatus);
careerRouter.delete("/tracked/:id", deleteTrackedJob);

export default careerRouter;

