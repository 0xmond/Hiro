import { model, Schema, Types } from "mongoose";
import { ApplicationStatus } from "../../utils/enum/index.js";

// schema
const jobApplicationSchema = new Schema(
  {
    jobPost: {
      type: Types.ObjectId,
      required: true,
      ref: "JobPost",
    },
    employeeId: {
      type: Types.ObjectId,
      required: true,
      ref: "Employee",
    },
    coverLetter: {
      type: String,
      required: true,
    },
    resume: {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      required: true,
      default: ApplicationStatus.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jobApplicationSchema.virtual("employee", {
  localField: "employeeId",
  foreignField: "profileId",
  ref: "Employee",
});

// model
export const JobApplication = model("JobApplication", jobApplicationSchema);
