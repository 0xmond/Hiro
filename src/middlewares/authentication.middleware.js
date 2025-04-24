import { User } from "../db/models/user.model.js";
import { Roles } from "../utils/enum/index.js";
import { verifyToken } from "../utils/token/index.js";

export const isAuthenticate = async (req, res, next) => {
  // get token from request headers
  const token = req.headers.authorization;

  // verify the token and get the payload -> payload = { _id, email, iat }
  const payload = verifyToken({ token }); // returns payload || throws exception

  if (payload.error) return next(payload.error);

  // get user data
  const user = await User.findById(payload._id, {
    password: 0,
    updatedAt: 0,
    isConfirmed: 0,
  })
    .populate([
      {
        path: payload.role == Roles.EMPLOYEE ? "jobApplications" : "jobPosts",
        populate:
          payload.role == Roles.EMPLOYEE
            ? {
                path: "jobPost",
                select: "jobTitle companyId",
                populate: {
                  path: "company",
                  select: "companyName profilePicture.secure_url -_id ",
                },
              }
            : undefined,
      },
    ])
    .lean();

  // check token validity
  if (!user) return next(new Error("Invalid token", { cause: 400 }));

  // pass user data in request object to next node in pipeline
  req.user = user;

  return next();
};
