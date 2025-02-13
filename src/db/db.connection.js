import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(process.env.DB)
    .then(() => {
      console.warn("DB connected successfully");
    })
    .catch((error) => {
      console.error(error.message);
    });
};
