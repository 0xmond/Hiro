import { model, Schema, Types } from "mongoose";

// schema
const commentSchema = new Schema(
  {
    postId: { type: Types.ObjectId, ref: "Post", required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    content: {
      type: String,
      required: function () {
        return !this.attachment;
      },
    },
    attachment: {
      secure_url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

commentSchema.virtual("reacts", {
  ref: "React",
  localField: "userId",
  foreignField: "userId",
});

commentSchema.virtual("post", {
  ref: "Post",
  localField: "postId",
  foreignField: "_id",
});

commentSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "profileId",
});

// model
export const Comment = model("Comment", commentSchema);
