import { JobApplication } from "../../db/models/job.application.model.js";
import { JobPost } from "../../db/models/jobpost.model.js";
import { Roles } from "../../utils/enum/index.js";
import { jobPostHiddenData } from "../../utils/hidden/index.js";
import { entityMessages } from "../../utils/messages/entity.messages.js";
import cloudinary from "../../utils/upload/cloudinary.js";

export const createJobApplication = async (req, res, next) => {
  // get request data
  const { postId } = req.params;
  const { coverLetter } = req.body;

  // check if the employee has already applied for this job
  if (
    req.jobPost.jobApplications.some((jobApp) =>
      jobApp.employee.equals(req.user.profileId)
    )
  )
    return next(new Error("You can apply for this job once", { cause: 400 }));

  const jobApplicationData = {
    coverLetter,
    jobPost: req.jobPost._id,
    employee: req.user.profileId,
  };

  if (req.file) {
    // upload resume to cloud
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `hiro/pdf/jobs/${postId}/applications/${req.user.profileId}`,
      }
    );
    jobApplicationData.resume = {
      public_id,
      secure_url,
    };
  } else {
    jobApplicationData.resume = req.user.resume;
  }

  // create job application
  const jobApplication = await JobApplication.create(jobApplicationData);

  // return success response
  return res.status(201).json({
    success: true,
    message: entityMessages.jobApplication.createdSuccessfully,
  });
};

export const checkApplicationStatus = async (req, res, next) => {
  // get request data
  const { postId, id } = req.params;

  // ensure that the user owns the application || company owns the job post
  if (req.user.role == Roles.COMPANY) {
    if (!req.user.jobPosts.some((post) => post._id.equals(postId)))
      return next(new Error("Unauthorized", { cause: 401 }));
  } else {
    if (
      !req.user.jobApplications.some((application) =>
        application._id.equals(id)
      )
    )
      return next(new Error("Unauthorized", { cause: 401 }));
  }

  // get job application
  const jobApplication = await JobApplication.findById(id).lean();

  if (!jobApplication)
    return next(
      new Error(entityMessages.jobApplication.notFound, { cause: 404 })
    );

  // return success response
  return res.status(200).json({ success: true, data: jobApplication });
};
