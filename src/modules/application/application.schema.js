import joi from "joi";
import { isValidId } from "../../middlewares/validation.middleware.js";
import { attachmentType } from "../../utils/upload/single.validation.js";

export const createJobApplication = joi
  .object({
    postId: joi.custom(isValidId).required(),
    attachment: joi.object(attachmentType).optional(),
    coverLetter: joi.string().min(30).required(),
  })
  .required();

export const checkApplicationStatus = joi
  .object({
    id: joi.custom(isValidId).required(),
    postId: joi.custom(isValidId).required(),
  })
  .required();

export const updateApplicationStatus = joi
  .object({
    respond: joi.boolean().required(),
    id: joi.custom(isValidId).required(),
    postId: joi.custom(isValidId).required(),
  })
  .required();

export const getJobApplications = joi
  .object({
    postId: joi.custom(isValidId).required(),
  })
  .required();
