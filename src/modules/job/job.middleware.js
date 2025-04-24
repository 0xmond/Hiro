import { JobPost } from "../../db/models/job.model.js";
import { jobPostHiddenData } from "../../utils/hidden/index.js";
import { entityMessages } from "../../utils/messages/entity.messages.js";

export const checkJobPost = async (req, res, next) => {
  // check existence of job post
  const jobPost = await JobPost.findById(
    req.params.postId,
    jobPostHiddenData
  ).populate([{ path: "jobApplications", select: "employeeId status" }]);
  if (!jobPost)
    return next(new Error(entityMessages.jobPost.notFound, { cause: 404 }));
  req.jobPost = jobPost;
  return next();
};
