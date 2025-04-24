import joi from "joi";
import { isValidId } from "../../../middlewares/validation.middleware.js";

export const sendOrCancelFriendRequest = joi
  .object({
    id: joi.string().custom(isValidId).required(),
  })
  .required();

export const approveOrDeclineFriendRequest = joi
  .object({
    id: joi.string().custom(isValidId).required(),
    action: joi.boolean().required(),
  })
  .required();

export const unFriend = joi
  .object({
    id: joi.string().custom(isValidId).required(),
  })
  .required();
