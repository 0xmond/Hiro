import { isAvailable, getSkillQuiz, submitQuiz } from "./quiz.service.js";
import { Router } from "express";
import {
  isAuthenticate,
  isAuthorized,
  isValid,
} from "../../middlewares/index.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { quizAnswersValidationSchema } from "./quiz.schema.js";
import { Roles } from "../../utils/enum/index.js";
const router = Router();

router.use(asyncHandler(isAuthenticate), isAuthorized([Roles.EMPLOYEE]));

router.get("/quiz", asyncHandler(isAvailable), asyncHandler(getSkillQuiz));

router.post("/quiz", asyncHandler(submitQuiz));

export default router;
