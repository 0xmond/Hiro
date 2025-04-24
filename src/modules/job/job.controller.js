import { Router } from "express";
import {
  isAuthenticate,
  isAuthorized,
  isValid,
} from "../../middlewares/index.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { endpoint } from "./job.endpoint.js";
import {
  archiveJobPost,
  createJobPost,
  deleteJobPost,
  getJobPost,
  search,
  updateJobPost,
} from "./job.schema.js";
import * as jobPostService from "./job.service.js";
import jobApplicationRouter from "../application/application.controller.js";

const router = Router();

router.use(asyncHandler(isAuthenticate));

// job application router
router.use("/:postId/application", jobApplicationRouter);

// create job post
router.post(
  "/",
  isAuthorized(endpoint.createJobPost),
  isValid(createJobPost),
  asyncHandler(jobPostService.createJobPost)
);

// delete job post
router.delete(
  "/:id",
  isAuthorized(endpoint.deleteJobPost),
  isValid(deleteJobPost),
  asyncHandler(jobPostService.deleteJobPost)
);

// update job post
router.put(
  "/:id",
  isAuthorized(endpoint.updateJobPost),
  isValid(updateJobPost),
  asyncHandler(jobPostService.updateJobPost)
);

// search
router.get(
  "/search",
  isAuthorized(endpoint.search),
  isValid(search),
  asyncHandler(jobPostService.search)
);

// get archived job post
router.get(
  "/archived",
  isAuthorized(endpoint.getArchivedJobPosts),
  asyncHandler(jobPostService.getArchivedJobPosts)
);

// get job post
router.get(
  "/:id?",
  isAuthorized(endpoint.getJobPost),
  isValid(getJobPost),
  asyncHandler(jobPostService.getJobPost)
);

// archive job post
router.patch(
  "/:id",
  isAuthorized(endpoint.archiveJobPost),
  isValid(archiveJobPost),
  asyncHandler(jobPostService.archiveJobPost)
);

export default router;
