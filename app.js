const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("express-async-errors");

const config = require("./utils/config");
const blogRouter = require("./controllers/blog");
const loginRouter = require("./controllers/login");
const userRouter = require("./controllers/user");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");

const app = express();

logger.info("connecting to MongoDB");
mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("connected to MongoDB"))
  .catch((e) => logger.error("error connecting to MongoDB", e.message));

app.use(express.static(path.join(__dirname, "build")));
app.use(cors());
app.use(express.json());
app.use(middleware.getToken);
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.get("/*", function (_, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.errorHandler);

module.exports = app;
