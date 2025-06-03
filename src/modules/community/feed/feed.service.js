import { Roles } from "../../../utils/enum/index.js";
import feed from "./feed.algorithm.js";

export const getPosts = async (req, res, next) => {
  // get ranked posts
  let posts;
  if (req.user.role == Roles.EMPLOYEE) {
    const skills = req.user.skills.map((s) => s.skill);
    posts = await feed.getRankedPostsForEmployee(skills);
  } else {
    posts = await feed.getRankedPostsForCompany();
  }

  // send success response
  return res.status(200).json({ success: true, data: posts });
};
