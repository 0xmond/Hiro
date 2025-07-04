import express from "express";
import bootstrap from "./src/app.controller.js";
import cors from "cors";
import { config } from "dotenv";
config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true, // If using cookies or authorization headers
  })
);
bootstrap(app, express);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is listening on port", port);
});
