import { Schema, Types, model } from "mongoose";
import { fieldMessages } from "../../utils/messages/index.js";
import {
  Experiences,
  Genders,
  JobTitle,
  Skills,
  Roles,
} from "../../utils/enum/index.js";

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
  },
  {
    discriminatorKey: "role",
    collection: "users",
    versionKey: false,
    timestamps: true,
  }
);

// model
export const User = model("User", baseUserSchema);

export const Employee = User.discriminator(
  Roles.EMPLOYEE,
  new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: [...Object.values(Genders)], required: true },
    isEmployed: { type: Boolean, default: false },
    education: { type: String },
    skills: { type: [String], enum: [...Object.values(Skills)] },
    experience: { type: String, enum: [...Object.values(Experiences)] },
    jobTitle: { type: String, enum: [...Object.values(JobTitle)] },
    resume: {
      secure_url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    companyId: {
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
  })
);

export const Company = User.discriminator(
  Roles.COMPANY,
  new Schema({
    companyName: { type: String, required: true },
    address: { type: String, required: true },
    aboutCompany: { type: String },
    jobPosts: [{ type: Types.ObjectId, ref: "JobPost" }],
    employeesCount: { type: Number, default: 0 },
  })
);
