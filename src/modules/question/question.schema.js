import Joi from "joi";

export const questionValidationSchema = Joi.object({
  skill: Joi.string().required(),
  question: Joi.string().required(),
  options: Joi.array().items(Joi.string()).min(2).required(),
  answer: Joi.string().required(),
  explanation: Joi.string().optional(),
});
