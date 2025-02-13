import { connectDB } from "./db/db.connection.js";
import { globalError } from "./utils/error/global-error.js";
import { notFound } from "./utils/error/not-found.js";
import authRouter from "./modules/auth/auth.controller.js";
import jobPostRouter from "./modules/jobpost/jobpost.controller.js";
import cors from "cors";
import profileRouter from "./modules/profile/profile.controller.js";

const bootstrap = async (app, express) => {
  app.use(cors("*"));

  // parse request data
  app.use(express.json());

  await connectDB();

  // auth router
  app.use("/auth", authRouter);

  // job post router
  app.use("/jobpost", jobPostRouter);

  // profile router
  app.use("/profile", profileRouter);

  // handle not found pages
  app.all("*", notFound);

  // global error handling
  app.use(globalError);
};

export default bootstrap;
