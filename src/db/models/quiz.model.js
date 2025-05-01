import { model, Schema, Types } from "mongoose";

const quizSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    skill: {
      type: String,
      required: true,
    },
    questions: [
      {
        type: Types.ObjectId,
        ref: "Question",
        required: true,
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    attempted: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Quiz = model("Quiz", quizSchema);
