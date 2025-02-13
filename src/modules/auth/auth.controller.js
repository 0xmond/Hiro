import { Router } from "express";
import * as authService from "./auth.service.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import {
  companySchema,
  employeeRegister,
  login,
  passwordReset,
  requestPasswordReset,
  resendConfirmEmail,
} from "./auth.schema.js";

const router = Router();

// employee register
router.post(
  "/employee",
  isValid(employeeRegister),
  asyncHandler(authService.employeeRegister)
);

// company register
router.post(
  "/company",
  isValid(companySchema),
  asyncHandler(authService.companyRegister)
);

// login
router.post("/login", isValid(login), asyncHandler(authService.login));

// confirmation email
router.get("/confirm", asyncHandler(authService.emailConfirm));

// resend confirmation email
router.post(
  "/resend-confirm",
  isValid(resendConfirmEmail),
  asyncHandler(authService.resendConfirmEmail)
);

// request password reset
router.post(
  "/request-password-reset",
  isValid(requestPasswordReset),
  asyncHandler(authService.requestPasswordReset)
);

// reset password
router.post(
  "/password-reset",
  isValid(passwordReset),
  asyncHandler(authService.passwordReset)
);

export default router;
