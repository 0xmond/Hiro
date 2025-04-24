import { Router } from "express";
import { asyncHandler } from "../../../utils/error/async-handler.js";
import { isAuthenticate } from "../../../middlewares/authentication.middleware.js";
import { isAuthorized } from "../../../middlewares/authorization.middleware.js";
import { Roles } from "../../../utils/enum/index.js";
import * as feedService from "./feed.service.js";

const router = Router();

router.use(
  asyncHandler(isAuthenticate),
  isAuthorized([...Object.values(Roles)])
);

// get feed posts
router.get("/", asyncHandler(feedService.getPosts));

export default router;
