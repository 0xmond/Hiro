import joi from "joi";
import { isValidId } from "../../middlewares/validation.middleware.js";
import EducationDegrees, {
  EmployeesCount,
  Experiences,
  Genders,
  JobCategory,
  Roles,
  Skills,
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
      education: joi
        .array()
        .items(
          joi.object({
            degree: joi
              .string()
              .valid(...Object.values(EducationDegrees))
              .required(),
            institution: joi.string().required(),
            location: joi.string().required(),
          })
        )
        .when("$key", {
          is: Roles.EMPLOYEE,
          then: joi.optional(),
          otherwise: joi.forbidden(),
        }),
      experience: joi
        .array()
        .items({
          title: joi
            .string()
            .valid(...Object.values(JobCategory))
            .required(),
          company: joi.string().required(),
          duration: joi
            .object({ from: joi.date().required(), to: joi.date().required() })
            .required(),
        })
        .when("$key", {
          is: Roles.EMPLOYEE,
          then: joi.optional(),
          otherwise: joi.forbidden(),
        }),
      jobTitle: joi
        .string()
        .valid(...Object.values(JobCategory))
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
      twitter: joi
        .string()
        .pattern(/^https?:\/\/(?:www\.)?x\.com\/[a-zA-Z0-9_]+\/?$/)
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
      employeesCount: joi
        .string()
        .valid(...Object.values(EmployeesCount))
        .when("$key", {
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

export const search = joi
  .object({
    // type: joi
    //   .string()
    //   .valid(...Object.values(Roles))
    //   .required(),
    q: joi.string().required(),
  })
  .required();

export const updateSkills = joi
  .object({
    skills: joi
      .array()
      .items(
        joi
          .string()
          .valid(...Object.values(Skills))
          .required()
      )
      .required(),
  })
  .required();
