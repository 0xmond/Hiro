import { Router } from "express";
import * as jobApplicationService from "./application.service.js";
import { endpoint } from "./application.endpoint.js";
import { fileFormats, uploadFile } from "../../utils/upload/multer.js";
import {
  checkApplicationStatus,
  createJobApplication,
  getJobApplications,
  updateApplicationStatus,
} from "./application.schema.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { isAuthenticate } from "../../middlewares/authentication.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { checkJobPost } from "../job/job.middleware.js";

export const router = Router({ mergeParams: true });

router.use(asyncHandler(isAuthenticate));

router.use(checkJobPost);

router.post(
  "/",
  isAuthorized(endpoint.createJobApplication),
  uploadFile(fileFormats.documentMimeTypes).single("attachment"),
  isValid(createJobApplication),
  asyncHandler(jobApplicationService.createJobApplication)
);

router.get(
  "/:id",
  isAuthorized(endpoint.checkApplicationStatus),
  isValid(checkApplicationStatus),
  asyncHandler(jobApplicationService.checkApplicationStatus)
);

router.post(
  "/:id",
  isAuthorized(endpoint.updateApplicationStatus),
  isValid(updateApplicationStatus),
  asyncHandler(jobApplicationService.updateApplicationStatus)
);

router.get(
  "/",
  isAuthorized(endpoint.getJobApplications),
  isValid(getJobApplications),
  asyncHandler(jobApplicationService.getJobApplications)
);

export default router;
