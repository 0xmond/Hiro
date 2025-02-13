import { Router } from "express";
import * as profileService from "./profile.service.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { isAuthenticate } from "../../middlewares/authentication.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { endpoint } from "./profile.endpoint.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { getProfile } from "./profile.schema.js";

const router = Router();

// get profile
router.get(
  "",
  asyncHandler(isAuthenticate),
  isAuthorized(endpoint.getProfile),
  isValid(getProfile),
  asyncHandler(profileService.getProfile)
);

// update profile
router.put(
  "",
  asyncHandler(isAuthenticate),
  isAuthorized(endpoint.updateProfile),
  asyncHandler(profileService.updateProfile)
);

export default router;
