import joi from "joi";
import { attachmentType } from "../../../utils/upload/single.validation.js";
import { isValidId } from "../../../middlewares/validation.middleware.js";
import { Reactions } from "../../../utils/enum/index.js";

export const createComment = joi
  .object({
    postId: joi.string().custom(isValidId).required(),
    content: joi.string().when("attachment", {
      is: joi.exist(),
      then: joi.optional(),
      otherwise: joi.required(),
    }),
    attachment: joi.object(attachmentType).optional(),
  })
  .required();

export const getAllComments = joi
  .object({
    postId: joi.string().custom(isValidId).required(),
  })
  .required();

export const deleteComment = joi
  .object({
    postId: joi.string().custom(isValidId).required(),
  })
  .required();

export const updateComment = joi
  .object({
    postId: joi.string().custom(isValidId).required(),
    commentId: joi.string().custom(isValidId).required(),
    content: joi.string().required(),
  })
  .required();

export const likeOrDislike = joi
  .object({
    postId: joi.string().custom(isValidId).required(),
    commentId: joi.string().custom(isValidId).required(),
    react: joi
      .string()
      .valid(...Object.values(Reactions))
      .required(),
  })
  .required();

export const getAllLikes = joi
  .object({
    postId: joi.string().custom(isValidId).required(),
    commentId: joi.string().custom(isValidId).required(),
  })
  .required();
