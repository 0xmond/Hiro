import { Types } from "mongoose";
import { Company, Employee, User } from "../../../db/models/user.model.js";
import { entityMessages } from "../../../utils/messages/entity.messages.js";
import { Roles } from "../../../utils/enum/index.js";
import { userHiddenData } from "../../../utils/hidden/index.js";

export const sendOrCancelFriendRequest = async (req, res, next) => {
  // parse user id from request params
  const { id } = req.params;

  // if the user trying to send friend to himself
  if (req.user.profileId.equals(id))
    return next(
      new Error("You cannot send friend request to yourself 😡", { cause: 400 })
    );

  // if they already friends => fail
  if (req.user.friendsIds?.some((f) => f.equals(id)))
    return next(new Error("You are already friends", { cause: 400 }));

  // if the user sent a friend request to the logged in user
  if (req.user.friendRequestsIds?.some((f) => f.equals(id)))
    return next(
      new Error("This user already sent you a friend request", { cause: 400 })
    );

  // find user
  const employee = await User.findOne({ profileId: id, role: Roles.EMPLOYEE });

  // check user existence
  if (!employee)
    return next(new Error(entityMessages.user.notFound, { cause: 404 }));

  // update => if exist, remove it and if not, add it
  const requestExists = employee.friendRequestsIds.includes(req.user.profileId);

  const update = requestExists
    ? { $pull: { friendRequestsIds: req.user.profileId } }
    : {
        $addToSet: {
          friendRequestsIds: req.user.profileId,
        },
      };

  // send friend request
  await employee.updateOne(update);

  if (!requestExists) {
    await User.bulkWrite([
      {
        updateOne: {
          filter: { _id: employee._id },
          update: { $addToSet: { followersIds: req.user.profileId } },
        },
      },
      {
        updateOne: {
          filter: { _id: req.user._id },
          update: {
            $addToSet: {
              followingIds: employee.profileId,
            },
          },
        },
      },
    ]);
  } else {
    await User.updateOne(
      { _id: req.user._id },
      { $pull: { friendRequestsSentIds: employee.profileId } }
    );
  }

  await Employee.updateOne(
    { _id: req.user._id },
    {
      $addToSet: {
        friendRequestsSentIds: employee.profileId,
      },
    }
  );

  // send success response
  return res.status(200).json({
    success: true,
    message: requestExists
      ? entityMessages.friendRequest.deletedSuccessfully
      : entityMessages.friendRequest.createdSuccessfully,
  });
};

export const approveOrDeclineFriendRequest = async (req, res, next) => {
  // parse data from request
  const { id } = req.params;
  const { action } = req.body;

  // if they already friends => fail
  if (req.user.friendsIds?.some((f) => f.equals(id)))
    return next(new Error("You are already friends", { cause: 400 }));

  console.log({ user });

  // if the user approve a non-exist request
  if (!req.user.friendRequestsIds?.some((reqId) => reqId.equals(id)))
    return next(
      new Error(entityMessages.friendRequest.notFound, { cause: 404 })
    );

  // find user to be accepted or declined
  const user = await User.findOne({ profileId: id, role: Roles.EMPLOYEE });

  if (!user)
    return next(new Error(entityMessages.user.notFound, { cause: 404 }));

  // update user
  if (action) {
    await user.updateOne({
      $addToSet: { friendsIds: req.user.profileId },
    });
    await Employee.updateOne(
      { profileId: req.user.profileId },
      { $addToSet: { friendsIds: id }, $pull: { friendRequestsIds: id } }
    );
  } else {
    await Employee.updateOne(
      { profileId: req.user.profileId },
      { $pull: { friendRequestsIds: id } }
    );
  }

  // send success response
  return res.status(200).json({
    success: true,
    message: action
      ? entityMessages.friendRequest.approvedSuccessfully
      : entityMessages.friendRequest.deletedSuccessfully,
  });
};

export const getAllFriends = async (req, res, next) => {
  // get all friends of logged in user
  const friends = await Employee.findOne(
    { _id: req.user._id },
    { friendsIds: 1, _id: 0 }
  ).populate([
    {
      path: "friends",
      select: "username email firstName lastName profilePicture -_id",
    },
  ]);

  if (!friends.friends.length)
    return next(new Error(entityMessages.friend.notFound, { cause: 404 }));

  return res.status(200).json(friends.friends);
};

export const unFriend = async (req, res, next) => {
  // parse user id from request params
  const { id } = req.params;

  // if user is not a friend
  if (!req.user.friendsIds.some((f) => f.equals(id)))
    return next(new Error("You are not friends", { cause: 400 }));

  // find user
  const user = await User.findOne({ profileId: id, role: Roles.EMPLOYEE });

  if (!user)
    return next(new Error(entityMessages.friend.notFound, { cause: 404 }));

  // update users
  await Employee.updateMany(
    { profileId: { $in: [user.profileId, req.user.profileId] } },
    {
      $pull: { friendsIds: { $in: [user.profileId, req.user.profileId] } },
    }
  );

  // send success response
  return res.status(200).json({
    success: true,
    message: entityMessages.friend.removedSuccessfully,
  });
};

export const getAllFriendRequests = async (req, res, next) => {
  // get current user
  const user = await Employee.findOne({ profileId: req.user.profileId })
    .populate([
      {
        path: "friendRequests",
        select: "username firstName lastName profilePicture -_id",
      },
    ])
    .lean();

  // check if there is no friend requests
  if (!user.friendRequests.length)
    return next(
      new Error(entityMessages.friendRequest.notFound, { cause: 404 })
    );

  // send success response
  return res.status(200).json({ success: true, data: user.friendRequests });
};

export const getSuggestions = async (req, res, next) => {
  const users = await Employee.find(
    {
      skills: {
        $in: req.user.skills,
      },
      profileId: {
        $nin: req.user.friendsIds,
        $nin: req.user.friendRequestsIds,
        $ne: req.user.profileId,
        $nin: req.user.friendRequestsSentIds,
      },
      isConfirmed: true,
    },
    {
      profileId: 1,
      username: 1,
      firstName: 1,
      lastName: 1,
      profilePicture: 1,
      _id: 0,
    }
  )
    .limit(20)
    .lean();

  const companies = await Company.aggregate([
    { $sample: { size: 25 } },
    {
      $match: { isConfirmed: true, profileId: { $nin: req.user.followingIds } },
    },
    { $project: { profileId: 1, companyName: 1, profilePicture: 1, _id: 0 } },
  ]);

  if (!users.length && !companies.length)
    return next(new Error(entityMessages.user.notFound, { cause: 404 }));

  return res.status(200).json({ success: true, data: { users, companies } });
};
