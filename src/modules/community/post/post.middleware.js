import { Post } from "../../../db/models/post.model.js";
import { entityMessages } from "../../../utils/messages/entity.messages.js";

export const checkPost = async (req, res, next) => {
  // parse post id from request params
  const { postId } = req.params;

  // get post and check if exists
  const post = await Post.findOne({ _id: postId, archived: false }).lean();

  if (!post)
    return next(new Error(entityMessages.post.notFound, { cause: 404 }));

  // pass post to request
  req.post = post;

  return next();
};
