require("dotenv").config(); // At the top
const express = require("express");
const router = express.Router();
const {
  redirectToGitHub,
  handleGitHubCallback,
} = require("../controllers/githubAuthController");

router.get("/login/github", redirectToGitHub);
router.get("/login/github/callback", handleGitHubCallback);

module.exports = router;
