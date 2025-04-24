import express from "express";
import bootstrap from "./src/app.controller.js";

const app = express();

bootstrap(app, express);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is listening on port", port);
});
