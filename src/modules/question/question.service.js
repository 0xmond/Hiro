import { Question } from "../../db/models/question.model.js";
import { questionValidationSchema } from "./question.schema.js";

// create Question
export const createQuestion = async (req, res, next) => {
  const { error, value } = questionValidationSchema.validate(req.body);
  if (error) {
    return next(new Error(error.details[0].message, { cause: 400 }));
  }

  const newQuestion = await Question.create(value);
  return res.status(201).json({ success: true, data: newQuestion });
};

// update Question
export const updateQuestion = async (req, res, next) => {
  const { error, value } = questionValidationSchema.validate(req.body);
  if (error) {
    return next(new Error(error.details[0].message, { cause: 400 }));
  }

  const updatedQuestion = await Question.findByIdAndUpdate(
    req.params.id,
    value,
    { new: true, runValidators: true }
  );

  if (!updatedQuestion) {
    return next(new Error("Question not found", { cause: 404 }));
  }

  return res.status(200).json({ success: true, data: updatedQuestion });
};

// get Question by ID
export const getQuestionById = async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next(new Error("Question not found", { cause: 404 }));
  }

  return res.status(200).json({ success: true, data: question });
};

// delete Question
export const deleteQuestion = async (req, res, next) => {
  const deletedQuestion = await Question.findByIdAndDelete(req.params.id);

  if (!deletedQuestion) {
    return next(new Error("Question not found", { cause: 404 }));
  }

  return res
    .status(200)
    .json({ success: true, message: "Question deleted successfully" });
};
