import joi from "joi";

export const attachmentType = {
  fieldname: joi.string().required(),
  originalname: joi.string().required(),
  encoding: joi.string().required(),
  mimetype: joi.string().required(),
  destination: joi.string().required(),
  filename: joi.string().required(),
  path: joi.string().required(),
  size: joi.number().required(),
};

export const uploadSingle = joi
  .object({ attachment: joi.object(attachmentType).required() })
  .required();
