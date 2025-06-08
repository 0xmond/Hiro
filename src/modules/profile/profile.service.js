import { JobApplication } from "../../db/models/application.model.js";
import { Post } from "../../db/models/post.model.js";
import {
  Company,
  defaultPublicId,
  defaultSecureUrl,
  Employee,
  User,
} from "../../db/models/user.model.js";
import { Roles } from "../../utils/enum/index.js";
import {
  hideUserSensitiveData,
  userHiddenData,
  communityHiddenData,
} from "../../utils/hidden/index.js";
import { entityMessages } from "../../utils/messages/entity.messages.js";
import { extractTextFromPdf } from "../../utils/resume/test.js";
import cloudinary from "../../utils/upload/cloudinary.js";
import { updateProfileSchema } from "./profile.schema.js";

export const getProfile = async (req, res, next) => {
  // parse id from query params
  const { id } = req.query;

  // get user data
  const user = await User.findOne(
    { profileId: id ? id : req.user.profileId },
    { ...userHiddenData, ...communityHiddenData }
  )
    .populate([
      { path: "jobPosts" },
      {
        path: "jobApplications",
        populate: {
          path: "jobPost",
          select: "jobTitle companyId",
          populate: {
            path: "company",
            select: "companyName profilePicture.secure_url -_id ",
          },
        },
      },
    ])
    .lean();

  if (!user)
    return next(new Error(entityMessages.user.notFound, { cause: 404 }));

  const posts = await Post.find({
    archived: false,
    publisherId: id ? id : req.user.profileId,
  })
    .populate([
      {
        path: "publisher",
        select:
          "profilePicture.secure_url username firstName lastName companyName profileId -_id",
        populate: {
          path: "reacts",
          populate: {
            path: "user",
            select:
              "profilePicture.secure_url username firstName lastName companyName profileId -_id",
          },
        },
      },
    ])
    .lean();

  return res.status(200).json({ success: true, data: { user, posts } });
};

export const search = async (req, res, next) => {
  // parse search terms from request query string
  const { q } = req.query;

  // get user
  const users = await User.find({
    username: { $regex: q, $options: "i" },
    isConfirmed: true,
  })
    .select(
      "profileId username profilePicture.secure_url firstName lastName companyName role -_id"
    )
    .lean();

  // check if there are no users exist
  if (!users.length)
    return next(new Error(entityMessages.user.notFound, { cause: 404 }));

  // send success response
  return res.status(200).json({ success: true, data: users });
};

export const updateProfile = async (req, res, next) => {
  // validate request data
  const schema = updateProfileSchema(req.user.role);
  const data = { ...req.body, ...req.query, ...req.params };
  const result = schema.validate(data, {
    abortEarly: false,
    context: { key: req.user.role },
  });

  if (result.error) {
    const messages = result.error.details.map((obj) => obj.message);
    return next(new Error(messages, { cause: 400 }));
  }

  // update user
  if (req.user.role == Roles.EMPLOYEE) {
    var user = await Employee.findOneAndUpdate(
      { profileId: req.user.profileId },
      req.body.email && req.body.email != req.user.email
        ? { ...req.body, isConfirmed: false }
        : req.body,
      {
        new: true,
      }
    ).lean();
  } else {
    var user = await Company.findOneAndUpdate(
      { profileId: req.user.profileId },
      req.body.email && req.body.email != req.user.email
        ? { ...req.body, isConfirmed: false }
        : req.body,
      {
        new: true,
      }
    ).lean();
  }

  // const user = await User.findOne(
  //   { profileId: req.user.profileId }
  // )

  // await user.updateOne(
  //   req.body.email && req.body.email != req.user.email
  //     ? { ...req.body, isConfirmed: false }
  //     : req.body
  // );

  // hide sensitive data
  const filteredUser = hideUserSensitiveData(user);

  // send success response
  return res.status(200).json({ success: true, data: user });
};

export const updateSkills = async (req, res, next) => {
  // parse skills from request body
  const { skills } = req.body;

  // update skills
  const user = await Employee.updateOne(
    { _id: req.user._id },
    {
      skills: skills.map((s) => ({
        skill: s,
        verified: req.user.skills?.some((us) => {
          if (us.skill == s && us.verified == true) return true;
        }),
      })),
    }
  );

  // send success response
  return res
    .status(200)
    .json({ success: 200, message: entityMessages.user.updatedSuccessfully });
};

export const updateProfilePicture = async (req, res, next) => {
  // upload to cloud
  const options = {};
  if (req.user.profilePicture.public_id == defaultPublicId)
    options.folder = `hiro/users/${req.user.profileId}/profile-pic`;
  else options.public_id = req.user.profilePicture.public_id; // => to update pp in one step (fs trick)

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    options
  );
  // update db
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      profilePicture: { public_id, secure_url },
    },
    { new: true }
  ).lean();

  const filteredUser = hideUserSensitiveData(user);
  return res.status(200).json({ success: true, data: filteredUser });
};

export const deleteProfilePicture = async (req, res, next) => {
  // remove from cloud
  if (req.user.profilePicture.public_id == defaultPublicId)
    return res.json({
      success: true,
      message: "Profile picture deleted successfully",
    });

  await cloudinary.uploader.destroy(req.user.profilePicture.public_id);

  // update db
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      profilePicture: {
        public_id: defaultPublicId,
        secure_url: defaultSecureUrl,
      },
    },
    { new: true }
  ).lean();

  const filteredUser = hideUserSensitiveData(user);

  return res.status(200).json({ success: true, data: filteredUser });
};

export const uploadResume = async (req, res, next) => {
  // destroy old resume
  if (req.user.resume?.public_id)
    await cloudinary.uploader.destroy(req.user.resume.public_id);

  // upload to cloud
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `hiro/pdf/resume/${req.user.profileId}` }
  );

  // update db
  const employee = await Employee.findOneAndUpdate(
    { _id: req.user._id },
    {
      resume: { public_id, secure_url },
      resumeText: await extractTextFromPdf(secure_url),
    },
    {
      new: true,
    }
  ).lean();

  const filteredEmployee = hideUserSensitiveData(employee);
  return res.status(200).json({ success: true, data: filteredEmployee });
};

export const getEmployeeApplications = async (req, res, next) => {
  const applications = await JobApplication.find({
    employeeId: req.user.profileId,
  })
    .populate([
      {
        path: "jobPost",
        select: "jobTitle companyId",
        populate: {
          path: "company",
          select: "companyName profilePicture.secure_url -_id ",
        },
      },
    ])
    .lean();

  if (!applications.length)
    return next(
      new Error(entityMessages.jobApplication.notFound, { cause: 404 })
    );

  return res.status(200).json({ success: true, data: applications });
};
