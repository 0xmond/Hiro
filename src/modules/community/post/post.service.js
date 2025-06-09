import { Types } from "mongoose";
import { Post } from "../../../db/models/post.model.js";
import { entityMessages } from "../../../utils/messages/entity.messages.js";
import cloudinary from "../../../utils/upload/cloudinary.js";
import { React } from "../../../db/models/react.model.js";
import { CommunityEntities } from "../../../utils/enum/index.js";
import { extractSkillsFromText } from "../../../utils/ai/skill.extraction.js";
import { extractTextFromImage } from "../../../utils/ai/image.extraction.js";
import { fileFormats } from "../../../utils/upload/multer.js";

export const createPost = async (req, res, next) => {
  // parse content from request body
  const { content } = req.body;

  // upload attachment to cloud if exists
  const postId = new Types.ObjectId();
  const uploadPromises = req.files.map((file) =>
    cloudinary.uploader.upload(file.path, {
      folder: `hiro/users/${req.user.profileId}/posts/${postId}/post`,
    })
  );

  const uploadedFiles = await Promise.all(uploadPromises);

  // extract public_id and secure_url for each file
  const filesData = uploadedFiles.map(({ public_id, secure_url }) => ({
    public_id,
    secure_url,
  }));

  // generate tags for the post content
  let contentTags = [];
  if (content) {
    contentTags.push(...(await extractSkillsFromText(content)));
  }

  const imagesTags = [];
  if (
    req.files &&
    req.files.some((f) => fileFormats.imageMimeTypes.includes(f.mimetype))
  ) {
    for (let i = 0; i < req.files.length; i++) {
      if (fileFormats.imageMimeTypes.includes(req.files[i].mimetype))
        imagesTags.push(...(await extractTextFromImage(req.files[i])));
    }
  }

  for (const tag of imagesTags) {
    if (contentTags.includes(tag)) continue;
    else contentTags.push(tag);
  }

  // add post data to db
  const post = await Post.create({
    _id: postId,
    content,
    attachments: filesData,
    tags: contentTags,
    publisherId: req.user.profileId,
  });

  // send success reponse
  return res.status(201).json({
    success: true,
    message: entityMessages.post.createdSuccessfully,
    data: post,
  });
};

export const getPost = async (req, res, next) => {
  // parse ids from request
  const { userId } = req.params;
  const { postId } = req.query;

  // check if post id is provided
  if (!postId && !userId) {
    const posts = await Post.find({
      publisherId: req.user.profileId,
      archived: false,
    })
      .populate([
        {
          path: "reacts",
          select: "profileId -_id",
        },
        {
          path: "publisher",
          select:
            "profilePicture.secure_url username firstName lastName companyName profileId -_id",
        },
        {
          path: "sharedFrom",
          populate: {
            path: "publisher",
            select:
              "profilePicture.secure_url username firstName lastName companyName profileId -_id",
          },
        },
      ])
      .lean();

    // if posts is empty
    if (!posts.length)
      return next(new Error(entityMessages.post.notFound, { cause: 404 }));

    return res.status(200).json({ success: true, data: posts });
  }

  const filter = { archived: false };
  if (postId) filter._id = postId;
  if (userId) filter.publisherId = userId;
  // find post by id
  const post = await Post.find(filter)
    .populate([
      {
        path: "reacts",
        populate: {
          path: "user",
          select:
            "profilePicture.secure_url username firstName lastName companyName profileId -_id",
        },
      },
      {
        path: "publisher",
        select:
          "profilePicture.secure_url username firstName lastName companyName profileId -_id",
      },
      {
        path: "sharedFrom",
        populate: {
          path: "publisher",
          select:
            "profilePicture.secure_url username firstName lastName companyName profileId -_id",
        },
      },
    ])
    .lean();

  // if posts is empty
  if (!post.length)
    return next(new Error(entityMessages.post.notFound, { cause: 404 }));

  // send success response
  return res.status(200).json({ message: true, data: post });
};

export const deletePost = async (req, res, next) => {
  // parse post id from request params
  const { id } = req.params;

  // find post
  const post = await Post.findOneAndDelete({
    _id: id,
    publisherId: req.user.profileId,
  });

  // if id is invalid
  if (!post)
    return next(new Error(entityMessages.post.notFound, { cause: 404 }));

  // send success response
  return res
    .status(200)
    .json({ message: true, message: entityMessages.post.deletedSuccessfully });
};

export const archivePost = async (req, res, next) => {
  // parse post id from request params
  const { id } = req.params;

  // get post
  const post = await Post.findOne({ _id: id, publisherId: req.user.profileId });

  // check if post not exists
  if (!post)
    return next(new Error(entityMessages.post.notFound, { cause: 404 }));

  // update post
  await post.updateOne(
    { archived: post.archived ? false : true },
    { new: true }
  );

  // send success response
  return res
    .status(200)
    .json({ success: true, message: entityMessages.post.updatedSuccessfully });
};

export const getArchivedPosts = async (req, res, next) => {
  // get all archived posts
  const posts = await Post.find({
    publisherId: req.user.profileId,
    archived: true,
  })
    .populate([
      {
        path: "reacts",
        select:
          "profileId username companyName firstName lastName profilePicture.secure_url -_id",
      },
    ])
    .lean();

  // check if there is no archived posts
  if (!posts.length)
    return next(new Error(entityMessages.post.notFound, { cause: 404 }));

  // send success response
  return res.status(200).json({ success: true, data: posts });
};

export const updatePost = async (req, res, next) => {
  // parse post id from request params
  const { id } = req.params;

  // find post and update
  const post = await Post.findOneAndUpdate(
    { publisherId: req.user.profileId, _id: id },
    req.body,
    { new: true }
  ).lean();

  // check post existence
  if (!post)
    return next(new Error(entityMessages.post.notFound, { cause: 404 }));

  // send success response
  return res.status(200).json({
    success: true,
    message: entityMessages.post.updatedSuccessfully,
    data: post,
  });
};

export const likeOrDislike = async (req, res, next) => {
  // parse post id from request params
  const { id } = req.params;
  const { react } = req.body;

  // get post and like or dislike
  const post = await Post.findOne({ _id: id, archived: false });

  // check post existence
  if (!post)
    return next(new Error(entityMessages.post.notFound, { cause: 404 }));

  const existingReact = await React.findOne({
    entityId: post._id,
    userId: req.user.profileId,
    entityType: CommunityEntities.POST,
  });

  if (existingReact) {
    await React.deleteOne({ _id: existingReact._id });
    return res.status(200).json({ success: true, message: "Disliked" });
  } else {
    await React.create({
      entityId: post._id,
      react,
      userId: req.user.profileId,
      entityType: CommunityEntities.POST,
    });

    // send success response
    return res
      .status(200)
      .json({ success: true, message: existingReact ? "Disliked" : "Liked" });
  }
};

export const getAllLikes = async (req, res, next) => {
  // parse post id from request params
  const { id } = req.params;

  // get post
  const post = await Post.findOne({ _id: id, archived: false });

  // check post existence
  if (!post)
    return next(new Error(entityMessages.post.notFound, { cause: 404 }));

  // get all likes for the post
  const reacts = await React.find({
    entityId: id,
    entityType: CommunityEntities.POST,
  })
    .populate(
      "user",
      "profileId username companyName firstName lastName profilePicture.secure_url -_id"
    )
    .lean();

  // send success response
  return res.status(200).json({ success: true, data: reacts });
};

export const share = async (req, res, next) => {
  // parse content from request body
  const { content, postId } = req.body;

  const originalPost = await Post.findOne({ archived: false, _id: postId });

  if (!originalPost)
    return next(new Error(entityMessages.post.notFound, { cause: 404 }));

  // add post data to db
  const post = await Post.create({
    content,
    tags: originalPost.tags,
    publisherId: req.user.profileId,
    sharedFrom: originalPost.sharedFrom
      ? originalPost.sharedFrom
      : originalPost._id,
  });

  await originalPost.updateOne({
    $inc: { shareCount: 1 },
  });

  // send success reponse
  return res.status(201).json({
    success: true,
    message: entityMessages.post.createdSuccessfully,
    data: post,
  });
};
