import { Schema, Types, model } from "mongoose";
import { Genders, JobCategory, Skills, Roles } from "../../utils/enum/index.js";

export const defaultPublicId = "default_duucnz";
export const defaultSecureUrl =
  "https://res.cloudinary.com/dbdv3lubq/image/upload/v1739568352/default_duucnz.png";

// schema
const baseUserSchema = new Schema(
  {
    profileId: {
      type: Types.ObjectId,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [...Object.values(Roles)],
      required: true,
    },
    profilePicture: {
      secure_url: {
        type: String,
        required: true,
        default: defaultSecureUrl,
      },
      public_id: {
        type: String,
        required: true,
        default: defaultPublicId,
      },
    },
    address: {
      type: String,
    },
    followersIds: [{ type: Types.ObjectId, ref: "User" }],
    followingIds: [{ type: Types.ObjectId, ref: "User" }],
  },
  {
    discriminatorKey: "role",
    collection: "users",
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

baseUserSchema.virtual("followers", {
  ref: "User",
  localField: "followersIds",
  foreignField: "profileId",
});

baseUserSchema.virtual("following", {
  ref: "User",
  localField: "followingIds",
  foreignField: "profileId",
});

// model

const employeeSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: [...Object.values(Genders)], required: true },
  isEmployed: { type: Boolean, default: false },
  education: [
    {
      degree: { type: String },
      institution: { type: String },
      location: { type: String },
    },
  ],
  skills: [
    {
      skill: { type: String, enum: [...Object.values(Skills)] },
      verified: { type: Boolean, default: false },
    },
  ],
  experience: [
    {
      title: String,
      company: String,
      duration: {
        from: { type: Date },
        to: { type: Date },
      },
    },
  ],
  friendsIds: [{ type: Types.ObjectId, ref: "User" }],
  friendRequestsIds: [{ type: Types.ObjectId, ref: "User" }],
  friendRequestsSentIds: [{ type: Types.ObjectId, ref: "User" }],
  jobTitle: { type: String, enum: [...Object.values(JobCategory)] },
  resume: {
    secure_url: {
      type: String,
    },
    public_id: {
      type: String,
    },
  },
  resumeText: {
    type: String,
  },
  company: {
    type: Types.ObjectId,
    ref: "Company",
    validate: {
      validator: function (value) {
        if (!this.isEmployed && value) {
          return false;
        }
        return true;
      },
      message: "Invalid company assignment.",
    },
  },
  hireDate: {
    type: Date,
    validate: {
      validator: function (value) {
        if (!this.isEmployed && value) {
          return false;
        }
        return true;
      },
      message: "Invalid hire date.",
    },
  },
  github: { type: String },
  website: { type: String },
  twitter: { type: String },
});

employeeSchema.virtual("jobApplications", {
  ref: "JobApplication",
  localField: "profileId",
  foreignField: "employeeId",
});
employeeSchema.virtual("friends", {
  ref: "User",
  localField: "friendsIds",
  foreignField: "profileId",
});
employeeSchema.virtual("friendRequests", {
  ref: "User",
  localField: "friendRequestsIds",
  foreignField: "profileId",
});

const companySchema = new Schema({
  companyName: { type: String, required: true },
  aboutCompany: { type: String },
  // jobPosts: [{ type: Types.ObjectId, ref: "JobPost" }],
  employeesCount: { type: String },
});

companySchema.virtual("jobPosts", {
  ref: "JobPost",
  localField: "profileId",
  foreignField: "companyId",
});
export const User = model("User", baseUserSchema);
export const Employee = User.discriminator(Roles.EMPLOYEE, employeeSchema);

export const Company = User.discriminator(Roles.COMPANY, companySchema);
