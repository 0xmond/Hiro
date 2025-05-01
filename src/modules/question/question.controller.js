import { questionValidationSchema } from "./question.schema.js";
import express from "express";
import { asyncHandler } from "../../utils/error/async-handler.js";
import {
  isAuthenticate,
  isAuthorized,
  isValid,
} from "../../middlewares/index.js";

import * as questionService from "./questions.service.js";

import { endpoint } from "./questions.endpoint.js";

const router = express.Router();

router.use(asyncHandler(isAuthenticate));
// Create a new question
router.post(
  "/add",
  isAuthorized(endpoint.addQuestion),
  isValid(questionValidationSchema),
  asyncHandler(questionService.createQuestion)
);

// Get a specific question by ID
router.get(
  "/:id",
  isAuthorized(endpoint.getQuestions),
  asyncHandler(questionService.getQuestionById)
);

// Update a question
router.put(
  "/update/:id",
  isAuthorized(endpoint.updateQuestion),
  isValid(questionValidationSchema),
  asyncHandler(questionService.updateQuestion)
);

// Delete a question
router.delete(
  "/delete/:id",
  isAuthorized(endpoint.deleteQuestion),
  asyncHandler(questionService.createQuestion)
);

export default router;
