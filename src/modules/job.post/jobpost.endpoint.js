import { Roles } from "../../utils/enum/index.js";

export const endpoint = {
  createJobPost: [Roles.COMPANY],
  deleteJobPost: [Roles.COMPANY],
  updateJobPost: [Roles.COMPANY],
  getJobPost: [Roles.COMPANY, Roles.EMPLOYEE],
  search: [Roles.COMPANY, Roles.EMPLOYEE],
  getArchivedJobPosts: [Roles.COMPANY],
  archiveJobPost: [Roles.COMPANY],
};
