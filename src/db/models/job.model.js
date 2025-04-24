import { Schema, Types, model } from "mongoose";
import {
  Experiences,
  JobPeriod,
  JobCategory,
  JobType,
} from "../../utils/enum/index.js";
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
      required: [true, fieldMessages.required("Job title")],
    },
    jobCategory: {
      type: String,
      enum: [...Object.values(JobCategory)],
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
    city: {
      type: String,
      required: [true, fieldMessages.required("City")],
    },
    fullAddress: {
      type: String,
      default: function () {
        return `${this.location} ${this.city}, ${this.country}`;
      },
    },
    salary: {
      type: Number,
    },
    jobPeriod: {
      type: String,
      enum: [...Object.values(JobPeriod)],
      required: [true, fieldMessages.required("Job period")],
    },
    jobType: {
      type: String,
      enum: [...Object.values(JobType)],
      required: false,
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
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jobPostSchema.virtual("jobApplications", {
  ref: "JobApplication",
  localField: "_id",
  foreignField: "jobPost",
});

jobPostSchema.virtual("company", {
  ref: "User",
  localField: "companyId",
  foreignField: "profileId",
});

// model
export const JobPost = model("JobPost", jobPostSchema);
