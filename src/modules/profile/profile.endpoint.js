import { Roles } from "../../utils/enum/index.js";

export const endpoint = {
  getProfile: [Roles.COMPANY, Roles.EMPLOYEE],
  updateProfile: [Roles.COMPANY, Roles.EMPLOYEE],
  updateSkills: [Roles.EMPLOYEE],
  updateProfilePicture: [Roles.COMPANY, Roles.EMPLOYEE],
  deleteProfilePicture: [Roles.COMPANY, Roles.EMPLOYEE],
  uploadResume: [Roles.EMPLOYEE],
  getEmployeeApplications: [Roles.EMPLOYEE],
};
