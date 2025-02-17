import joi from "joi";
import {
  ArabCountries,
  Experiences,
  JobPeriod,
  JobTitle,
  JobType,
  Skills,
} from "../../utils/enum/index.js";
import { isValidId } from "../../middlewares/validation.middleware.js";

// create job post
export const createJobPost = joi
  .object({
    jobTitle: joi
      .string()
      .valid(...Object.values(JobTitle))
      .required(),
    jobDescription: joi.string().min(30).required(),
    requiredSkills: joi
      .array()
      .items(
        joi.string().required()
        // .valid(...Skills)
      )
      .required(),
    location: joi.string().optional(),
    country: joi
      .string()
      .valid(...Object.values(ArabCountries))
      .required(),
    salary: joi.number().optional(),
    jobPeriod: joi
      .string()
      .valid(...Object.values(JobPeriod))
      .required(),
    jobType: joi
      .array()
      .items(
        joi
          .string()
          .required()
          .valid(...Object.values(JobType))
      )
      .optional(),
    experience: joi
      .string()
      .valid(...Object.values(Experiences))
      .required(),
    applicationDeadline: joi.date().required(),
  })
  .required();

export const deleteJobPost = joi
  .object({
    id: joi.string().custom(isValidId).required(),
  })
  .required();

// update job post
export const updateJobPost = joi
  .object({
    id: joi.string().custom(isValidId).required(),
    jobTitle: joi
      .string()
      .valid(...Object.values(JobTitle))
      .optional(),
    jobDescription: joi.string().min(30).optional(),
    location: joi.string().optional(),
    country: joi
      .string()
      .valid(...Object.values(ArabCountries))
      .optional(),
    salary: joi.number().optional(),
    jobPeriod: joi
      .string()
      .valid(...Object.values(JobPeriod))
      .optional(),
    jobType: joi
      .array()
      .items(
        joi
          .string()
          .required()
          .valid(...Object.values(JobType))
      )
      .optional(),
    experience: joi
      .string()
      .valid(...Object.values(Experiences))
      .optional(),
    applicationDeadline: joi.date().optional(),
  })
  .required();

// get job post
export const getJobPost = joi
  .object({
    id: joi.string().custom(isValidId).optional(),
  })
  .required();

// jobs search
export const search = joi.object({
  search: joi.string().optional(),
  location: joi.string().optional(),
  jobPeriod: joi
    .array()
    .items(
      joi
        .string()
        .required()
        .valid(...Object.values(JobPeriod))
    )
    .optional(),
  jobType: joi
    .array()
    .items(
      joi
        .string()
        .required()
        .valid(...Object.values(JobType))
    )
    .optional(),
  experience: joi
    .array()
    .items(
      joi
        .string()
        .required()
        .valid(...Object.values(Experiences))
    )
    .optional(),
  minSalary: joi.number().min(1).required(),
  maxSalary: joi.number().greater(joi.ref("minSalary")).required(),
  size: joi.number().less(20).optional(),
  page: joi.number().less(100).required(),
});

// archive job post
export const archiveJobPost = joi
  .object({
    id: joi.string().custom(isValidId).required(),
  })
  .required();
