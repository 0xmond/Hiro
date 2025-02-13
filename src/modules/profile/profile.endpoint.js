import { Roles } from "../../utils/enum/index.js";

export const endpoint = {
  getProfile: [Roles.COMPANY, Roles.EMPLOYEE],
  updateProfile: [Roles.COMPANY, Roles.EMPLOYEE],
};
