import joi from "joi";
import { isValidId } from "../../middlewares/validation.middleware.js";
import {
  Experiences,
  Genders,
  JobTitle,
  Roles,
} from "../../utils/enum/index.js";

export const getProfile = joi
  .object({
    id: joi.string().custom(isValidId).optional(),
  })
  .required();

export const updateProfileSchema = (key) =>
  joi
    .object({
      // Available for both company and employee
      username: joi.string().optional(),
      email: joi.string().email().optional(),
      phone: joi
        .string()
        .pattern(/^(?:\+20|0)(1[0125]\d{8}|2\d{8}|3\d{8})$/)
        .optional(),
      address: joi.string().min(10).optional(),
      website: joi
        .string()
        .pattern(
          /^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9-]*)*\/?$/
        )
        .optional(),

      // Only allowed when key is (Employee)
      firstName: joi.string().min(2).when("$key", {
        is: Roles.EMPLOYEE,
        then: joi.optional(),
        otherwise: joi.forbidden(),
      }),
      lastName: joi.string().min(2).when("$key", {
        is: Roles.EMPLOYEE,
        then: joi.optional(),
        otherwise: joi.forbidden(),
      }),
      dob: joi.date().when("$key", {
        is: Roles.EMPLOYEE,
        then: joi.optional(),
        otherwise: joi.forbidden(),
      }),
      gender: joi
        .string()
        .valid(...Object.values(Genders))
        .when("$key", {
          is: Roles.EMPLOYEE,
          then: joi.optional(),
          otherwise: joi.forbidden(),
        }),
      education: joi.string().when("$key", {
        is: Roles.EMPLOYEE,
        then: joi.optional(),
        otherwise: joi.forbidden(),
      }),
      skills: joi.array().items(joi.string()).when("$key", {
        is: Roles.EMPLOYEE,
        then: joi.optional(),
        otherwise: joi.forbidden(),
      }),
      experience: joi
        .string()
        .valid(...Object.values(Experiences))
        .when("$key", {
          is: Roles.EMPLOYEE,
          then: joi.optional(),
          otherwise: joi.forbidden(),
        }),
      jobTitle: joi
        .string()
        .valid(...Object.values(JobTitle))
        .when("$key", {
          is: Roles.EMPLOYEE,
          then: joi.optional(),
          otherwise: joi.forbidden(),
        }),
      github: joi
        .string()
        .pattern(/^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]{1,39}\/?$/)
        .when("$key", {
          is: Roles.EMPLOYEE,
          then: joi.optional(),
          otherwise: joi.forbidden(),
        }),

      // Only allowed when key is (Company)
      companyName: joi.string().min(2).when("$key", {
        is: Roles.COMPANY,
        then: joi.optional(),
        otherwise: joi.forbidden(),
      }),
      aboutCompany: joi.string().min(30).optional().when("$key", {
        is: Roles.COMPANY,
        then: joi.optional(),
        otherwise: joi.forbidden(),
      }),
    })
    .required();
