import joi from "joi";
import { attachmentType } from "../../../utils/upload/single.validation.js";
import { isValidId } from "../../../middlewares/validation.middleware.js";
import { Reactions } from "../../../utils/enum/index.js";

export const createPost = joi
  .object({
    content: joi.string().when("attachment", {
      is: joi.exist(),
      then: joi.optional(),
      otherwise: joi.optional(),
    }),
    attachment: joi.array().items(attachmentType).optional(),
  })
  .required();

export const getPost = joi
  .object({
    userId: joi.string().custom(isValidId).optional(),
    postId: joi.string().custom(isValidId).optional(),
  })
  .required();

export const deletePost = joi
  .object({
    id: joi.string().custom(isValidId).required(),
  })
  .required();

export const archivePost = joi
  .object({
    id: joi.string().custom(isValidId).required(),
  })
  .required();

export const updatePost = joi
  .object({
    id: joi.string().custom(isValidId).required(),
    content: joi.string().required(),
  })
  .required();

export const likeOrDislike = joi
  .object({
    id: joi.string().custom(isValidId).required(),
    react: joi
      .string()
      .valid(...Object.values(Reactions))
      .required(),
  })
  .required();

export const getAllLikes = joi
  .object({
    id: joi.string().custom(isValidId).required(),
  })
  .required();

export const share = joi
  .object({
    content: joi.string().optional(),
    postId: joi.string().custom(isValidId).required(),
  })
  .required();
