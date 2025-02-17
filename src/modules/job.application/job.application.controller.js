import { Router } from "express";
import * as jobApplicationService from "./job.application.service.js";
import { endpoint } from "./job.application.endpoint.js";
import { fileFormats, uploadFile } from "../../utils/upload/multer.js";
import {
  checkApplicationStatus,
  createJobApplication,
} from "./job.application.validation.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { isAuthenticate } from "../../middlewares/authentication.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { JobPost } from "../../db/models/jobpost.model.js";
import { entityMessages } from "../../utils/messages/entity.messages.js";
import { jobPostHiddenData } from "../../utils/hidden/index.js";

const router = Router({ mergeParams: true });

router.use(asyncHandler(isAuthenticate));

router.use(async (req, res, next) => {
  // check existence of job post
  const jobPost = await JobPost.findById(
    req.params.postId,
    jobPostHiddenData
  ).populate([{ path: "jobApplications", select: "employee" }]);
  if (!jobPost)
    return next(new Error(entityMessages.jobPost.notFound, { cause: 404 }));
  req.jobPost = jobPost;
  return next();
});

router.post(
  "/",
  isAuthorized(endpoint.createJobApplication),
  uploadFile(fileFormats.docs).single("attachment"),
  isValid(createJobApplication),
  asyncHandler(jobApplicationService.createJobApplication)
);

router.get(
  "/:id",
  isAuthorized(endpoint.checkApplicationStatus),
  isValid(checkApplicationStatus),
  asyncHandler(jobApplicationService.checkApplicationStatus)
);
export default router;
