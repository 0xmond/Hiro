import { Router } from "express";
import { Roles } from "../../../utils/enum/index.js";
import { isAuthenticate } from "../../../middlewares/authentication.middleware.js";
import { asyncHandler } from "../../../utils/error/async-handler.js";
import * as commentService from "./comment.service.js";
import * as commentValidation from "./comment.schema.js";
import { fileFormats, uploadFile } from "../../../utils/upload/multer.js";
import { isAuthorized } from "../../../middlewares/authorization.middleware.js";
import { isValid } from "../../../middlewares/validation.middleware.js";
import { checkPost } from "../post/post.middleware.js";

const router = Router({ mergeParams: true });

router.use(
  asyncHandler(isAuthenticate),
  isAuthorized([Roles.COMPANY, Roles.EMPLOYEE]),
  asyncHandler(checkPost)
);

// create comment
router.post(
  "/",
  uploadFile(fileFormats.imageMimeTypes).single("attachment"),
  isValid(commentValidation.createComment),
  asyncHandler(commentService.createComment)
);

// get comments of post
router.get(
  "/",
  isValid(commentValidation.getAllComments),
  asyncHandler(commentService.getAllComments)
);

// delete comment
router.delete(
  "/:commentId",
  isValid(commentValidation.deleteComment),
  asyncHandler(commentService.deleteComment)
);

// update comment
router.put(
  "/:commentId",
  isValid(commentValidation.updateComment),
  asyncHandler(commentService.updateComment)
);

// like or dislike post
router.post(
  "/:commentId",
  isValid(commentValidation.likeOrDislike),
  asyncHandler(commentService.likeOrDislike)
);

// get likes of specific post
router.get(
  "/:commentId/reacts",
  isValid(commentValidation.getAllLikes),
  asyncHandler(commentService.getAllLikes)
);

export default router;
