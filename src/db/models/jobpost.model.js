import { Schema, Types, model } from "mongoose";
import { Experiences, JobPeriod, JobTitle } from "../../utils/enum/index.js";
import { fieldMessages } from "../../utils/messages/field.messages.js";

// schema
const jobPostSchema = new Schema(
  {
    companyId: {
      type: Types.ObjectId,
      required: true,
      ref: "Company",
    },
    jobTitle: {
      type: String,
      enum: [...Object.values(JobTitle)],
      required: [true, fieldMessages.required("Job title")],
    },
    jobDescription: {
      type: String,
      required: [true, fieldMessages.required("Job desctiption")],
    },
    requiredSkills: {
      type: [String],
      required: [true, fieldMessages.required("Required skills")],
    },
    location: {
      type: String,
    },
    country: {
      type: String,
      required: [true, fieldMessages.required("Country")],
    },
    salary: {
      type: Number,
    },
    jobPeriod: {
      type: String,
      enum: [...Object.values(JobPeriod)],
      required: [true, fieldMessages.required("Job period")],
    },
    experience: {
      type: String,
      enum: [...Object.values(Experiences)],
      required: [true, fieldMessages.required("Experience")],
    },
    applicationDeadline: {
      type: Date,
      required: [true, fieldMessages.required("Application deadline")],
    },
    archived: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

// model
export const JobPost = model("JobPost", jobPostSchema);
