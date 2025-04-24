import { model, Schema, Types } from "mongoose";
import { CommunityEntities, Reactions } from "../../utils/enum/index.js";

const reactSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    entityId: { type: Types.ObjectId, required: true },
    entityType: {
      type: String,
      enum: [...Object.values(CommunityEntities)],
      required: true,
    },
    react: { type: String, enum: Object.values(Reactions), required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

reactSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "profileId",
});

export const React = model("React", reactSchema);
