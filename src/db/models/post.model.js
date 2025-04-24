import { model, Schema, Types } from "mongoose";
import { Reactions } from "../../utils/enum/index.js";

// schema
const postSchema = new Schema(
  {
    content: {
      type: String,
      required: false,
    },
    tags: { type: [String] },
    attachments: [
      {
        secure_url: {
          type: String,
        },
        public_id: {
          type: String,
        },
      },
    ],
    sharedFrom: { type: Types.ObjectId, default: null, ref: "Post" },
    shareCount: { type: Number, default: 0 },
    publisherId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

postSchema.virtual("publisher", {
  ref: "User",
  localField: "publisherId",
  foreignField: "profileId",
});

postSchema.virtual("reacts", {
  ref: "React",
  localField: "_id",
  foreignField: "entityId",
});

postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
});

// model
export const Post = model("Post", postSchema);
