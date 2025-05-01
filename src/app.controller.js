import { connectDB } from "./db/db.connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import jobPostRouter from "./modules/job/job.controller.js";
import profileRouter from "./modules/profile/profile.controller.js";
import friendRouter from "./modules/community/friend/friend.controller.js";
import followRouter from "./modules/community/follow/follow.controller.js";
import postRouter from "./modules/community/post/post.controller.js";
import feedRouter from "./modules/community/feed/feed.controller.js";
import quizRouter from "./modules/quiz/quiz.controller.js";
import { globalError, notFound } from "./utils/error/index.js";

const bootstrap = async (app, express) => {
  // parse request data
  app.use(express.json());

  await connectDB();

  // auth router
  app.use("/auth", authRouter);

  // job post router
  app.use("/jobpost", jobPostRouter);

  // profile router
  app.use("/profile", profileRouter);

  // friend router
  app.use("/friend", friendRouter);

  // follow router
  app.use("/follow", followRouter);

  // post router
  app.use("/post", postRouter);

  // feed router
  app.use("/feed", feedRouter);

  // skill quiz router
  app.use("/skill", quizRouter);

  // handle not found pages
  app.all("*", notFound);

  // global error handling
  app.use(globalError);
};

export default bootstrap;
