import { Router } from "express";
import { isAuthenticate } from "../../../middlewares/authentication.middleware.js";
import { asyncHandler } from "../../../utils/error/async-handler.js";
import { isAuthorized } from "../../../middlewares/authorization.middleware.js";
import { Roles } from "../../../utils/enum/index.js";
import { isValid } from "../../../middlewares/validation.middleware.js";
import * as friendValidation from "./friend.schema.js";
import * as friendService from "./friend.service.js";

const router = Router();

router.use(asyncHandler(isAuthenticate), isAuthorized(Roles.EMPLOYEE));

// send or cancel friend request
router.post(
  "/:id/request",
  isValid(friendValidation.sendOrCancelFriendRequest),
  asyncHandler(friendService.sendOrCancelFriendRequest)
);

// approve or decline friend request
router.patch(
  "/:id/request",
  isValid(friendValidation.approveOrDeclineFriendRequest),
  asyncHandler(friendService.approveOrDeclineFriendRequest)
);

// get all friends
router.get("/", asyncHandler(friendService.getAllFriends));

// get all friend requests
router.get("/requests", asyncHandler(friendService.getAllFriendRequests));

// remove a friend
router.post(
  "/:id",
  isValid(friendValidation.unFriend),
  asyncHandler(friendService.unFriend)
);

// get suggestions
router.get("/suggestions", asyncHandler(friendService.getSuggestions));

export default router;
