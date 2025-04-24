import joi from "joi";
import { isValidId } from "../../../middlewares/validation.middleware.js";

export const followOrUnfollowUser = joi
  .object({
    id: joi.string().custom(isValidId).required(),
  })
  .required();
