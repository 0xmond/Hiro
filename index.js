import express from "express";
import bootstrap from "./src/app.controller.js";

const app = express();

bootstrap(app, express);

const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log("Server is listening on port", port);
});
