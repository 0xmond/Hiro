import { Roles } from "../../utils/enum/index.js";

export const endpoint = {
  createJobApplication: [Roles.EMPLOYEE],
  checkApplicationStatus: [Roles.EMPLOYEE, Roles.COMPANY],
};
