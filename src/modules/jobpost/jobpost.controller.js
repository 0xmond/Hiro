import { Router } from "express";
import {
  isAuthenticate,
  isAuthorized,
  isValid,
} from "../../middlewares/index.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { endpoint } from "./jobpost.endpoint.js";
import {
  createJobPost,
  deleteJobPost,
  getJobPost,
  search,
  updateJobPost,
} from "./jobpost.schema.js";
import * as jobPostService from "./jobpost.service.js";

const router = Router();

// create job post
router.post(
  "/",
  asyncHandler(isAuthenticate),
  isAuthorized(endpoint.createJobPost),
  isValid(createJobPost),
  asyncHandler(jobPostService.createJobPost)
);

// delete job post
router.delete(
  "/:id",
  asyncHandler(isAuthenticate),
  isAuthorized(endpoint.deleteJobPost),
  isValid(deleteJobPost),
  asyncHandler(jobPostService.deleteJobPost)
);

// update job post
router.put(
  "/:id",
  asyncHandler(isAuthenticate),
  isAuthorized(endpoint.updateJobPost),
  isValid(updateJobPost),
  asyncHandler(jobPostService.updateJobPost)
);

// get job post
router.get(
  "/:id",
  asyncHandler(isAuthenticate),
  isAuthorized(endpoint.getJobPost),
  isValid(getJobPost),
  asyncHandler(jobPostService.getJobPost)
);

// search
router.get(
  "/search",
  asyncHandler(isAuthenticate),
  isAuthorized(endpoint.search),
  isValid(search),
  asyncHandler(jobPostService.search)
);

export default router;
