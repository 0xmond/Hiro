// // // import { Company } from "../../db/models/company.model.js";
// // // import { Employee } from "../../db/models/employee.model.js";
import { JobPost } from "../../db/models/jobpost.model.js";
import {
  defaultPublicId,
  defaultSecureUrl,
  Employee,
  User,
} from "../../db/models/user.model.js";
import { Roles } from "../../utils/enum/index.js";
import cloudinary from "../../utils/upload/cloudinary.js";
import { updateProfileSchema } from "./profile.schema.js";

function hideSensitiveData(user) {
  const {
    _id,
    createdAt,
    updatedAt,
    isConfirmed,
    role,
    isEmployed,
    password,
    ...filteredUser
  } = user;
  return filteredUser;
}

const userHiddenData = {
  _id: 0,
  createdAt: 0,
  updatedAt: 0,
  isConfirmed: 0,
  isEmployed: 0,
  password: 0,
};

export const getProfile = async (req, res, next) => {
  // parse id from query params
  const { id } = req.query;

  // get user data
  const user = await User.findOne(
    { profileId: id ? id : req.user.profileId },
    userHiddenData
  ).lean();

  // check if the visited user is company
  if (user.role == Roles.COMPANY) {
    const jobPosts = await JobPost.find(
      { companyId: user.profileId, archived: false },
      { _id: 1 }
    ).lean();
    user.jobPosts = jobPosts;
  }
  return res.status(200).json({ success: true, data: { ...user } });
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
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    req.body.email && req.body.email != req.user.email
      ? { ...req.body, isConfirmed: false }
      : req.body,
    {
      new: true,
    }
  ).lean();

  // hide sensitive data
  const filteredUser = hideSensitiveData(user);

  // send success response
  return res.status(200).json({ success: true, data: { ...filteredUser } });
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

  const filteredUser = hideSensitiveData(user);
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

  const filteredUser = hideSensitiveData(user);

  return res.status(200).json({ success: true, data: filteredUser });
};

export const uploadResume = async (req, res, next) => {
  // destroy old resume
  if (req.user.resume)
    await cloudinary.uploader.destroy(req.user.resume.public_id);
  // upload to cloud
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `hiro/pdf/resume/${req.user.profileId}` }
  );
  // update db
  const employee = await Employee.findOneAndUpdate(
    { _id: req.user._id },
    { resume: { public_id, secure_url } },
    {
      new: true,
    }
  ).lean();

  const filteredEmployee = hideSensitiveData(employee);
  return res.status(200).json({ success: true, data: filteredEmployee });
};

// export const test = async (req, res, next) => {
//   const result = await cloudinary.uploader.upload(req.file.path, {
//     folder: "hiro/pdf",
//   });
//   return res.json({ result });
// };
