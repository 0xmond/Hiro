import joi from "joi";
import { Genders } from "../../utils/enum/index.js";

// employee and job seeker schema
export const employeeRegister = joi
  .object({
    // personal info
    username: joi.string().required(),
    email: joi.string().email().required(),
    phone: joi
      .string()
      .pattern(/^(?:\+20|0)(1[0125]\d{8}|2\d{8}|3\d{8})$/)
      .required(),
    password: joi.string().min(8).required(),
    firstName: joi.string().min(2).required(),
    lastName: joi.string().min(2).required(),
    dob: joi.date().required(),
    gender: joi
      .string()
      .valid(...Object.values(Genders))
      .required(),
  })
  .required();

// company register schema
export const companySchema = joi
  .object({
    username: joi.string().required(),
    email: joi.string().email().required(),
    phone: joi
      .string()
      .pattern(/^(?:\+20|0)(1[0125]\d{8}|2\d{8}|3\d{8})$/) // landlines and mobile
      .required(),
    password: joi.string().min(8).required(),
    companyName: joi.string().min(2),
    address: joi.string().optional(),
  })
  .required();

// login schema
export const login = joi
  .object({
    email: joi.string().email(),
    username: joi.string(),
    password: joi.string().min(8),
  })
  .or("email", "username")
  .required();

// resend confirm email
export const resendConfirmEmail = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

// request password reset schema
export const requestPasswordReset = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

// password reset schema
export const passwordReset = joi
  .object({
    token: joi.string().required(),
    newPassword: joi.string().min(8).required(),
  })
  .required();
