import { model, Schema, Types } from "mongoose";

const questionSchema = new Schema(
  {
    skill: { type: String, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: String, required: true },
    explanation: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

questionSchema.index({ skill: 1 });

export const Question = model("Question", questionSchema);
