import { User } from "../../../db/models/user.model.js";
import { Roles } from "../../../utils/enum/index.js";
import { entityMessages } from "../../../utils/messages/entity.messages.js";

export const followOrUnfollowUser = async (req, res, next) => {
  // parse user id from request params
  const { id } = req.params;

  // if the user trying to follow himself
  if (req.user.profileId.equals(id))
    return next(new Error("You cannot follow yourself 😡", { cause: 400 }));

  // find user
  const employee = await User.findOne({ profileId: id });

  // check user existence
  if (!employee)
    return next(new Error(entityMessages.user.notFound, { cause: 404 }));

  // update => if exist, remove it and if not, add it
  const followExists = employee.followersIds.includes(req.user.profileId);

  const updates = followExists
    ? [
        {
          updateOne: {
            filter: { _id: employee._id },
            update: { $pull: { followersIds: req.user.profileId } },
          },
        },
        {
          updateOne: {
            filter: { _id: req.user._id },
            update: { $pull: { followingIds: employee.profileId } },
          },
        },
      ]
    : [
        {
          updateOne: {
            filter: { _id: employee._id },
            update: { $addToSet: { followersIds: req.user.profileId } },
          },
        },
        {
          updateOne: {
            filter: { _id: req.user._id },
            update: { $addToSet: { followingIds: employee.profileId } },
          },
        },
      ];

  await User.bulkWrite(updates);

  // send success response
  return res.status(200).json({
    success: true,
    message: followExists
      ? entityMessages.follow.removedSuccessfully
      : entityMessages.follow.createdSuccessfully,
  });
};

export const getAllFollowers = async (req, res, next) => {
  // get all followers of logged in user
  const followers = await User.findOne(
    { _id: req.user._id },
    { followersIds: 1, _id: 0 }
  )
    .populate([
      {
        path: "followers",
        select:
          "profileId username companyName firstName lastName profilePicture.secure_url -_id",
      },
    ])
    .lean();

  if (!followers.followers.length)
    return next(new Error(entityMessages.follower.notFound, { cause: 404 }));

  return res.status(200).json(followers.followers);
};

export const getAllFollowing = async (req, res, next) => {
  // get all followers of logged in user
  const following = await User.findOne(
    { _id: req.user._id },
    { followingIds: 1, _id: 0 }
  )
    .populate([
      {
        path: "following",
        select:
          "profileId username companyName firstName lastName profilePicture.secure_url -_id",
      },
    ])
    .lean();

  if (!following.following.length)
    return next(new Error(entityMessages.user.notFound, { cause: 404 }));

  return res.status(200).json(following.following);
};
