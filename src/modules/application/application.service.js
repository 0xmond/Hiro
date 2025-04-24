import { JobApplication } from "../../db/models/application.model.js";
import { Employee } from "../../db/models/user.model.js";
import { sendEmail } from "../../utils/email/index.js";
import { acceptanceMail, rejectionMail } from "../../utils/email/temps.js";
import { ApplicationStatus, Roles } from "../../utils/enum/index.js";
import { jobApplicationHiddenData } from "../../utils/hidden/index.js";
import { entityMessages } from "../../utils/messages/entity.messages.js";
import cloudinary from "../../utils/upload/cloudinary.js";

export const createJobApplication = async (req, res, next) => {
  // get request data
  const { postId } = req.params;
  const { coverLetter } = req.body;

  // check if the employee has already applied for this job
  if (
    req.jobPost.jobApplications.some((jobApp) =>
      jobApp.employeeId.equals(req.user.profileId)
    )
  )
    return next(new Error("You can apply for this job once", { cause: 400 }));

  const jobApplicationData = {
    coverLetter,
    jobPost: req.jobPost._id,
    employeeId: req.user.profileId,
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
  const jobApplication = await JobApplication.findById(id)
    .populate([
      {
        path: "employee",
        select: "profileId firstName lastName profilePicture.secure_url -_id",
      },
    ])
    .lean();

  if (!jobApplication)
    return next(
      new Error(entityMessages.jobApplication.notFound, { cause: 404 })
    );

  // return success response
  return res.status(200).json({ success: true, data: jobApplication });
};

export const updateApplicationStatus = async (req, res, next) => {
  // get request data
  const { postId, id } = req.params;
  const { respond } = req.body;

  // check if the company owns job post
  if (!req.user.jobPosts.some((post) => post._id.equals(postId)))
    return next(new Error("Unauthorized", { cause: 401 }));

  // check if the company already handled job application
  if (
    req.jobPost.jobApplications.some(
      (application) =>
        application._id.equals(id) &&
        [ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED].includes(
          application.status
        )
    )
  ) {
    return next(
      new Error(`Job application is already handled`, { cause: 400 })
    );
  }

  // get job application and update it
  const jobApplication = await JobApplication.findByIdAndUpdate(
    id,
    {
      status: respond ? ApplicationStatus.ACCEPTED : ApplicationStatus.REJECTED,
    },
    { new: true }
  ).populate([{ path: "employee", select: "email" }]);

  // check if id is invalid
  if (!jobApplication)
    return next(
      new Error(entityMessages.jobApplication.notFound, { cause: 404 })
    );

  // assign employee to company if application accepted
  if (respond) {
    // update user (job seeker => employee)
    const employee = await Employee.findOneAndUpdate(
      { profileId: jobApplication.employeeId },
      {
        company: req.user.profileId,
        hireDate: Date.now(),
      }
    );
  }

  // send email to applicant
  await sendEmail(
    respond
      ? acceptanceMail(jobApplication.employee[0].email)
      : rejectionMail(jobApplication.employee[0].email)
  );

  return res.status(200).json({
    success: true,
    message: respond ? "Job Application Accepted" : "Job Application Rejected",
  });
};

export const getJobApplications = async (req, res, next) => {
  // get request data
  const { postId } = req.params;

  // check if the company owns job post
  if (!req.user.jobPosts.some((post) => post._id.equals(postId)))
    return next(new Error("Unauthorized", { cause: 401 }));

  // get all job application
  const jobApplications = await JobApplication.find(
    { jobPost: postId },
    jobApplicationHiddenData
  )
    .populate([
      {
        path: "employee",
        select: "profileId firstName lastName profilePicture.secure_url -_id",
      },
      {
        path: "jobPost",
        select: "jobTitle",
      },
    ])
    .lean();

  // if there is no job applications
  if (!jobApplications.length)
    return next(new Error("No job applications exist", { cause: 404 }));

  // send success response
  return res.status(200).json({ success: true, data: jobApplications });
};
