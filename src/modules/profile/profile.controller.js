import { Router } from "express";
import * as profileService from "./profile.service.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { isAuthenticate } from "../../middlewares/authentication.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { endpoint } from "./profile.endpoint.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { getProfile, uploadSingle } from "./profile.schema.js";
import { fileFormats, uploadFile } from "../../utils/upload/multer.js";

const router = Router();

router.use(asyncHandler(isAuthenticate));

// get profile
router.get(
  "",
  isAuthorized(endpoint.getProfile),
  isValid(getProfile),
  asyncHandler(profileService.getProfile)
);

// update profile
router.put(
  "",
  isAuthorized(endpoint.updateProfile),
  asyncHandler(profileService.updateProfile)
);

// update profile picture
router.patch(
  "/profile-picture",
  isAuthorized(endpoint.updateProfilePicture),
  uploadFile(fileFormats.images).single("attachment"),
  isValid(uploadSingle),
  asyncHandler(profileService.updateProfilePicture)
);

// delete profile picture
router.delete(
  "/profile-picture",
  isAuthorized(endpoint.deleteProfilePicture),
  asyncHandler(profileService.deleteProfilePicture)
);

// update profile picture
router.patch(
  "/resume",
  isAuthorized(endpoint.uploadResume),
  uploadFile(fileFormats.docs).single("attachment"),
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
