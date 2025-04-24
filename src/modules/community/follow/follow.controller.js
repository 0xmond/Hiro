import { Router } from "express";
import { isAuthenticate } from "../../../middlewares/authentication.middleware.js";
import { asyncHandler } from "../../../utils/error/async-handler.js";
import { isAuthorized } from "../../../middlewares/authorization.middleware.js";
import { Roles } from "../../../utils/enum/index.js";
import { isValid } from "../../../middlewares/validation.middleware.js";
import * as followSchema from "./follow.schema.js";
import * as followService from "./follow.service.js";

const router = Router();

router.use(
  asyncHandler(isAuthenticate),
  isAuthorized([Roles.EMPLOYEE, Roles.COMPANY])
);

// follow or unfollow user
router.post(
  "/:id",
  isValid(followSchema.followOrUnfollowUser),
  asyncHandler(followService.followOrUnfollowUser)
);

// get all followers
router.get("/", asyncHandler(followService.getAllFollowers));

// get all following
router.get("/following", asyncHandler(followService.getAllFollowing));

export default router;
