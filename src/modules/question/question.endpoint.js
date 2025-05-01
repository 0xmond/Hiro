import { Roles } from "../../utils/enum/index.js";

export const endpoint = {
  addQuestion: [Roles.ADMIN],
  deleteQuestion: [Roles.ADMIN],
  updateQuestion: [Roles.ADMIN],
  getQuestions: [Roles.ADMIN],
};
