// // // import { Company } from "../../db/models/company.model.js";
// // // import { Employee } from "../../db/models/employee.model.js";
import { JobPost } from "../../db/models/jobpost.model.js";
import { User } from "../../db/models/user.model.js";
import { Roles } from "../../utils/enum/index.js";
import { updateProfileSchema } from "./profile.schema.js";

function hideSensitiveData(user) {
  const {
    _id,
    createdAt,
    updatedAt,
    isConfirmed,
    role,
    profileId,
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
