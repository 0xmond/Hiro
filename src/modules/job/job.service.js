import { JobPost } from "../../db/models/job.model.js";
import { Roles, Skills } from "../../utils/enum/index.js";
import { jobPostHiddenData } from "../../utils/hidden/index.js";
import { entityMessages } from "../../utils/messages/entity.messages.js";
import { evaluateResume } from "../../utils/resume/evaluate-resume.js";

export const createJobPost = async (req, res, next) => {
  // parse request data
  const {
    jobTitle,
    jobCategory,
    requiredSkills,
    location,
    city,
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
  let validSkills = [];
  requiredSkills.forEach((element) => {
    if (Skills.includes(element)) validSkills.push(element);
  });

  // create job post
  const jobPost = await JobPost.create({
    companyId: req.user.profileId,
    jobTitle,
    jobCategory,
    jobDescription,
    requiredSkills: validSkills,
    location,
    country,
    salary,
    city,
    jobPeriod,
    jobType,
    experience,
    applicationDeadline,
  });

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

  // delete job post if exists
  const post = await JobPost.findOneAndDelete({
    _id: id,
    companyId: req.user.profileId,
  });

  // ensure that job post exists
  if (!post)
    return next(new Error(entityMessages.jobPost.notFound, { cause: 404 }));

  // return success response
  return res.status(200).json({
    success: true,
    message: entityMessages.jobPost.deletedSuccessfully,
  });
};

export const updateJobPost = async (req, res, next) => {
  // parse request data
  const { id } = req.params;

  const {
    jobTitle,
    jobCategory,
    requiredSkills,
    location,
    country,
    salary,
    jobPeriod,
    jobType,
    experience,
    applicationDeadline,
  } = req.body;

  // modify the description
  let { jobDescription } = req.body;
  jobDescription = `Job Title: ${jobTitle}\n${jobDescription}`;

  if (req.body.requiredSkills) {
    // get valid skills
    var validSkills = [];
    req.body.requiredSkills.forEach((element) => {
      if (Skills.includes(element)) validSkills.push(element);
    });
  }

  // find post and update it
  const post = await JobPost.findOneAndUpdate(
    { _id: id, companyId: req.user.profileId },
    {
      jobTitle,
      jobCategory,
      requiredSkills: validSkills,
      location,
      country,
      salary,
      jobPeriod,
      jobType,
      experience,
      applicationDeadline,
      jobDescription,
    },
    { new: true }
  ).lean();

  // ensure that job post exists
  if (!post)
    return next(new Error(entityMessages.jobPost.notFound, { cause: 404 }));

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

  if (search) query.jobDescription = { $regex: search, $options: "i" };

  if (location) query.fullAddress = { $regex: location, $options: "i" };

  if (jobPeriod) query.jobPeriod = { $in: jobPeriod };

  if (experience) query.experience = { $in: experience };

  if (jobType) query.jobType = { $in: jobType };

  const posts = await JobPost.find(query, jobPostHiddenData, {
    skip: (page - 1) * size,
    limit: size,
  })
    .populate([
      {
        path: "company",
        select: "profileId companyName profilePicture.secure_url -_id",
      },
    ])
    .lean();

  // check if there is no posts match filters
  if (!posts.length)
    return next(new Error(entityMessages.jobPost.notFound, { cause: 404 }));

  // send success response
  return res.status(200).json({ success: true, data: posts });
};

export const getJobPost = async (req, res, next) => {
  // parse request data
  const { id } = req.params;

  const filter = {
    archived: false,
  };
  if (id) filter._id = id;
  else filter.companyId = req.user.profileId;

  // get job post
  const posts = await JobPost.find(filter, jobPostHiddenData)
    .populate([
      { path: "company", select: "companyName profilePicture.secure_url -_id" },
    ])
    .lean();

  // check if the post is not valid
  if (!posts.length)
    return next(new Error(entityMessages.jobPost.notFound, { cause: 404 }));

  const evaluation = [];
  if (req.user.role == Roles.EMPLOYEE) {
    for (const post of posts) {
      post.evaluation = await evaluateResume(
        req.user.resumeText,
        post.jobDescription
      );
    }
  }

  // send success response
  return res.status(200).json({ success: true, data: posts });
};

export const getArchivedJobPosts = async (req, res, next) => {
  // get job post
  const posts = await JobPost.find(
    { companyId: req.user.profileId, archived: true },
    jobPostHiddenData
  )
    .populate([
      { path: "company", select: "companyName profilePicture.secure_url -_id" },
    ])
    .lean();

  // check if the post is not valid
  if (!posts.length)
    return next(new Error(entityMessages.jobPost.notFound, { cause: 404 }));

  // send success response
  return res.status(200).json({ success: true, data: posts });
};

export const archiveJobPost = async (req, res, next) => {
  // parse request data
  const { id } = req.params;

  // find post and update it
  const post = await JobPost.findOne({
    _id: id,
    companyId: req.user.profileId,
  }).lean();

  const updatedPost = await JobPost.findOneAndUpdate(
    {
      _id: id,
      companyId: req.user.profileId,
    },
    { archived: post.archived ? false : true },
    { new: true }
  ).lean();

  // send success response
  return res.status(200).json({
    success: true,
    message: entityMessages.jobPost.updatedSuccessfully,
  });
};
