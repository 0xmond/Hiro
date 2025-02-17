import cors from "cors";
import { connectDB } from "./db/db.connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import jobPostRouter from "./modules/job.post/jobpost.controller.js";
import profileRouter from "./modules/profile/profile.controller.js";
import { globalError, notFound } from "./utils/error/index.js";

const bootstrap = async (app, express) => {
  app.use(
    cors({
      origin: "http://localhost:5173", // Replace with your frontend URL
      methods: "GET,POST,PUT,DELETE",
      credentials: true, // If using cookies or authorization headers
    })
  );

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
