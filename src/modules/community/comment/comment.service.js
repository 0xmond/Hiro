import { Types } from "mongoose";
import cloudinary from "../../../utils/upload/cloudinary.js";
import { Comment } from "../../../db/models/comment.model.js";
import { entityMessages } from "../../../utils/messages/entity.messages.js";
import { React } from "../../../db/models/react.model.js";
import { CommunityEntities } from "../../../utils/enum/index.js";

export const createComment = async (req, res, next) => {
  // parse data from request body
  const { content } = req.body;

  // upload attachment if exists
  const commentId = new Types.ObjectId();
  if (req.file)
    var { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `hiro/posts/${req.post._id}/comments/${commentId}`,
      }
    );

  // create comment
  const comment = await Comment.create({
    _id: commentId,
    content,
    attachment: { public_id, secure_url },
    postId: req.post._id,
    userId: req.user.profileId,
  });

  // send success response
  return res.status(201).json({ success: true, data: comment });
};

export const getAllComments = async (req, res, next) => {
  // get all comments of post
  const comments = await Comment.find({ postId: req.post._id })
    .populate([
      {
        path: "user",
        select:
          "profileId username companyName firstName lastName profilePicture.secure_url -_id",
      },
    ])
    .sort({ createdAt: 1 })
    .lean();

  // check if there are no comments
  if (!comments.length) return next(new Error(entityMessages.comment.notFound));

  // send success response
  return res.status(200).json({ success: true, data: comments });
};

export const deleteComment = async (req, res, next) => {
  // parse comment id from request params
  const { commentId } = req.params;

  // find comment and delete it if exists
  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    userId: req.user.profileId, // <<<<<=====  forbidden 403
  });

  // check if comment not exists
  if (!comment)
    return next(new Error(entityMessages.comment.notFound, { cause: 404 }));

  // send success response
  return res.status(200).json({
    success: true,
    message: entityMessages.comment.deletedSuccessfully,
  });
};

export const updateComment = async (req, res, next) => {
  // parse comment id from request params
  const { commentId } = req.params;

  // find comment and update if exists
  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, userId: req.user.profileId },
    req.body,
    { new: true }
  )
    .populate([
      {
        path: "user",
        select:
          "profileId username companyName firstName lastName profilePicture.secure_url -_id",
      },
    ])
    .lean();

  // check comment existence
  if (!comment)
    return next(new Error(entityMessages.comment.notFound, { cause: 404 }));

  // send success response
  return res.status(200).json({ success: true, data: comment });
};

export const likeOrDislike = async (req, res, next) => {
  // parse comment id from request params
  const { commentId } = req.params;
  const { react } = req.body;

  // get comment and like or dislike
  const comment = await Comment.findOne({ _id: commentId });

  // check comment existence
  if (!comment)
    return next(new Error(entityMessages.comment.notFound, { cause: 404 }));

  // update comment
  const existingReact = await React.findOne({
    entityId: comment._id,
    userId: req.user.profileId,
    entityType: CommunityEntities.COMMENT,
  });

  if (existingReact) {
    await React.deleteOne({ _id: existingReact._id });
    return res.status(200).json({ success: true, message: "Disliked" });
  } else {
    await React.create({
      entityId: comment._id,
      react,
      userId: req.user.profileId,
      entityType: CommunityEntities.COMMENT,
    });

    // send success response
    return res
      .status(200)
      .json({ success: true, message: existingReact ? "Disliked" : "Liked" });
  }
};

export const getAllLikes = async (req, res, next) => {
  // parse comment id from request params
  const { commentId } = req.params;

  // get comment
  const comment = await Comment.findOne({ _id: commentId })
    .populate([
      {
        path: "reacts",
        select:
          "profileId username companyName firstName lastName profilePicture.secure_url -_id",
      },
    ])
    .lean();

  // check comment existence
  if (!comment)
    return next(new Error(entityMessages.comment.notFound, { cause: 404 }));

  // get all likes for the post
  const reacts = await React.find({
    entityId: commentId,
    entityType: CommunityEntities.COMMENT,
  })
    .populate(
      "user",
      "profileId username companyName firstName lastName profilePicture.secure_url -_id"
    )
    .lean();

  // send success response
  return res.status(200).json({ success: true, data: reacts });
};
