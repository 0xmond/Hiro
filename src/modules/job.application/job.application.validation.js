import joi from "joi";
import { uploadSingle } from "../../utils/upload/single.validation.js";
import { isValidId } from "../../middlewares/validation.middleware.js";

export const createJobApplication = joi
  .object({
    postId: joi.custom(isValidId).required(),
    attachment: joi
      .object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
        size: joi.number().required(),
      })
      .optional(),
    coverLetter: joi.string().min(30).required(),
  })
  .required();

export const checkApplicationStatus = joi
  .object({
    id: joi.custom(isValidId).required(),
    postId: joi.custom(isValidId).required(),
  })
  .required();
