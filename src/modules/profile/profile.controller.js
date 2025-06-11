import { Router } from "express";
import { isAuthenticate } from "../../middlewares/authentication.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { fileFormats, uploadFile } from "../../utils/upload/multer.js";
import { uploadSingle } from "../../utils/upload/single.validation.js";
import { endpoint } from "./profile.endpoint.js";
import * as profileValidation from "./profile.schema.js";
import * as profileService from "./profile.service.js";

const router = Router();

router.use(asyncHandler(isAuthenticate));

// get profile
router.get(
  "/",
  isAuthorized(endpoint.getProfile),
  isValid(profileValidation.getProfile),
  asyncHandler(profileService.getProfile)
);

// get job applications for specific employee
router.get(
  "/applications",
  isAuthorized(endpoint.getEmployeeApplications),
  asyncHandler(profileService.getEmployeeApplications)
);

// search users
router.post(
  "/search",
  isValid(profileValidation.search),
  profileService.search
);

// update profile
router.put(
  "",
  isAuthorized(endpoint.updateProfile),
  asyncHandler(profileService.updateProfile)
);

// update skills
router.put(
  "/skills",
  isAuthorized(endpoint.updateSkills),
  isValid(profileValidation.updateSkills),
  asyncHandler(profileService.updateSkills)
);

// update profile picture
router.patch(
  "/profile-picture",
  isAuthorized(endpoint.updateProfilePicture),
  uploadFile(fileFormats.imageMimeTypes).single("attachment"),
  isValid(uploadSingle),
  asyncHandler(profileService.updateProfilePicture)
);

// delete profile picture
router.delete(
  "/profile-picture",
  isAuthorized(endpoint.deleteProfilePicture),
  asyncHandler(profileService.deleteProfilePicture)
);

// upload resume
router.patch(
  "/resume",
  isAuthorized(endpoint.uploadResume),
  uploadFile(fileFormats.documentMimeTypes).single("attachment"),
  isValid(uploadSingle),
  asyncHandler(profileService.uploadResume)
);

// router.post(
//   "/test",
//   isAuthorized(endpoint.updateProfilePicture),
//   uploadFile(fileFormats.docs).single("attachment"),
//   isValid(uploadSingle),
//   asyncHandler(profileService.test)
// );

export default router;
