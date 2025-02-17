import { Types } from "mongoose";
import { JobPost } from "../../db/models/jobpost.model.js";
import { Company } from "../../db/models/user.model.js";
// import { client } from "../../db/redis.connection.js";
import { Skills } from "../../utils/enum/index.js";
import { entityMessages } from "../../utils/messages/entity.messages.js";
import { jobPostHiddenData } from "../../utils/hidden/index.js";

export const createJobPost = async (req, res, next) => {
  // parse request data
  const {
    jobTitle,
    requiredSkills,
    location,
    country,
    salary,
    jobPeriod,
    jobType,
    experience,
    applicationDeadline,
  } = req.body;

  let { jobDescription } = req.body;

  jobDescription = `Job Title: ${jobTitle}\n` + jobDescription;

  // get valid skills
  // const results = await Promise.all(
  //   requiredSkills.map((skill) => client.sIsMember("skills", skill))
  // );
  // const validSkills = requiredSkills.filter(
  //   (skill, index) => results[index] == true
  // );

  let validSkills = [];
  requiredSkills.forEach((element) => {
    if (Skills.includes(element)) validSkills.push(element);
  });

  // create job post
  const jobPost = await JobPost.create({
    company: req.user.profileId,
    jobTitle,
    jobDescription,
    requiredSkills: validSkills,
    location,
    country,
    salary,
    jobPeriod,
    jobType,
    experience,
    applicationDeadline,
  });

  // // add post to company
  // const company = await Company.updateOne(
  //   { _id: req.user._id },
  //   {
  //     $push: { jobPosts: jobPost._id },
  //   }
  // );

  // send success response
  return res.status(201).json({
    success: true,
    message: entityMessages.jobPost.createdSuccessfully,
    data: jobPost,
  });
};

export const deleteJobPost = async (req, res, next) => {
  // parse request data
  const { id } = req.params;

  const convertedId = new Types.ObjectId(id);
  // ensure that company owns the post
  if (!req.user.jobPosts.some((post) => post._id.equals(convertedId)))
    return next(new Error(entityMessages.jobPost.notFound, { cause: 404 }));

  // delete job post if exists
  const post = await JobPost.findByIdAndDelete(id);

  // // remove post id from job posts array in company
  // await Company.updateOne(
  //   { _id: req.user._id },
  //   { $pull: { jobPosts: post._id } }
  // );

  // return success response
  return res.status(200).json({
    success: true,
    message: entityMessages.jobPost.deletedSuccessfully,
  });
};

export const updateJobPost = async (req, res, next) => {
  // parse request data
  const { id } = req.params;

  const convertedId = new Types.ObjectId(id);
  // ensure that company owns the post
  if (!req.user.jobPosts.some((post) => post._id.equals(convertedId)))
    return next(new Error(entityMessages.jobPost.notFound, { cause: 404 }));

  // find post and update it
  const post = await JobPost.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true }
  ).lean();

  // send success response
  return res.status(200).json({
    success: true,
    message: entityMessages.jobPost.updatedSuccessfully,
    data: post,
  });
};

export const search = async (req, res, next) => {
  // parse request data
  const { search, location, minSalary, maxSalary, size, page } = req.query;

  const { experience, jobPeriod, jobType } = req.body;

  // find job posts based on filters
  const query = {
    salary: {
      $gte: minSalary ? minSalary : 1,
      $lte: maxSalary ? maxSalary : 1000000,
    },
  };

  if (search) query.$text = { $search: search, $caseSensitive: false }; // search in text index

  if (location) query.location = { $regex: location, $options: "i" };

  if (jobPeriod) query.jobPeriod = { $in: jobPeriod };

  if (experience) query.experience = { $in: experience };

  if (jobType) query.experience = { $in: experience };

  const posts = await JobPost.find(query, jobPostHiddenData, {
    skip: (page - 1) * size,
    limit: size || 8,
  });

  // check if there is no posts match filters
  if (posts.length < 1)
    return next(new Error(entityMessages.jobPost.notFound, { cause: 404 }));

  // send success response
  return res.status(200).json({ success: true, data: posts });
};

export const getJobPost = async (req, res, next) => {
  // parse request data
  const { id } = req.params;

  const filter = { archived: false };
  if (id) filter._id = id;

  // get job post
  const posts = await JobPost.find(filter, jobPostHiddenData).lean();

  // check if the post is not valid
  if (!posts.length)
    return next(new Error(entityMessages.jobPost.notFound, { cause: 404 }));

  // send success response
  return res.status(200).json({ success: true, data: posts });
};

export const getArchivedJobPosts = async (req, res, next) => {
  // get job post
  const posts = await JobPost.find(
    { company: req.user.profileId, archived: true },
    jobPostHiddenData
  ).lean();

  // check if the post is not valid
  if (!posts.length) return next(new Error("Empty", { cause: 404 }));

  // send success response
  return res.status(200).json({ success: true, data: posts });
};

export const archiveJobPost = async (req, res, next) => {
  // parse request data
  const { id } = req.params;

  const convertedId = new Types.ObjectId(id);
  // ensure that company owns the post
  if (!req.user.jobPosts.some((post) => post._id.equals(convertedId)))
    return next(new Error(entityMessages.jobPost.notFound, { cause: 404 }));

  // find post and update it
  const post = await JobPost.findById(id).lean();

  const updatedPost = await JobPost.findByIdAndUpdate(
    id,
    { archived: post.archived ? false : true },
    { new: true }
  ).lean();

  // send success response
  return res.status(200).json({
    success: true,
    message: entityMessages.jobPost.updatedSuccessfully,
  });
};
