import { Router } from "express";
import * as postService from "./post.service.js";
import * as postValidation from "./post.schema.js";
import { asyncHandler } from "../../../utils/error/async-handler.js";
import {
  isAuthenticate,
  isAuthorized,
  isValid,
} from "../../../middlewares/index.js";
import { Roles } from "../../../utils/enum/index.js";
import { fileFormats, uploadFile } from "../../../utils/upload/multer.js";
import commentRouter from "../comment/comment.controller.js";

const router = Router();

// comment router
router.use("/:postId/comment", commentRouter);

router.use(
  asyncHandler(isAuthenticate),
  isAuthorized([Roles.COMPANY, Roles.EMPLOYEE])
);

// share
router.post(
  "/share",
  isValid(postValidation.share),
  asyncHandler(postService.share)
);

// create post
router.post(
  "/",
  uploadFile([
    ...fileFormats.imageMimeTypes,
    ...fileFormats.documentMimeTypes,
    ...fileFormats.videoMimeTypes,
  ]).array("attachment", 5),
  isValid(postValidation.createPost),
  asyncHandler(postService.createPost)
);

// get archived posts
router.get("/archived", asyncHandler(postService.getArchivedPosts));

// get post or all posts of specific user
router.get(
  "/:userId?",
  isValid(postValidation.getPost),
  asyncHandler(postService.getPost)
);

// delete post
router.delete(
  "/:id",
  isValid(postValidation.deletePost),
  asyncHandler(postService.deletePost)
);

// archive post
router.patch(
  "/:id",
  isValid(postValidation.archivePost),
  asyncHandler(postService.archivePost)
);

// update post
router.put(
  "/:id",
  isValid(postValidation.updatePost),
  asyncHandler(postService.updatePost)
);

// like or dislike post
router.post(
  "/:id",
  isValid(postValidation.likeOrDislike),
  asyncHandler(postService.likeOrDislike)
);

// get likes of specific post
router.get(
  "/:id/reacts",
  isValid(postValidation.getAllLikes),
  asyncHandler(postService.getAllLikes)
);

export default router;
