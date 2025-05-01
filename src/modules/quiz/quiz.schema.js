import Joi from "joi";
import { isValidId } from "../../middlewares/validation.middleware.js";

export const quizAnswersValidationSchema = Joi.object({
  id: Joi.string().custom(isValidId).required().messages({
    "any.required": "Quiz ID is required",
    "string.empty": "Quiz ID cannot be empty",
  }),
  quizAnswers: Joi.array()
    .length(10)
    .items(
      Joi.object({
        _id: Joi.string().custom(isValidId).required().messages({
          "any.required": "Question ID is required",
          "string.empty": "Question ID cannot be empty",
        }),
        userAnswer: Joi.string().required().messages({
          "any.required": "User answer is required",
          "string.empty": "User answer cannot be empty",
        }),
      })
    )
    .required()
    .messages({
      "array.length": "Exactly 10 questions are required",
      "any.required": "Quiz answers are required",
    }),
});
