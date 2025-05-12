require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const authRouter = require("./routers/authRouter.js");

const app = express();
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const githubAuthRoutes = require("./routers/githubAuthRoutes.js");
const githubDataRoutes = require("./routers/githubDataRoutes");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.use("/api/auth", authRouter);
app.get("/", (req, res) => {
  res.json({ message: "Hello from the server" });
});

app.use("/auth/github", githubAuthRoutes);
app.use("/api/github", githubDataRoutes);

app.listen(process.env.PORT, () => {
  console.log("Listenning");
});
console.log("hello");
