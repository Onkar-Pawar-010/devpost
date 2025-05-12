const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");
const {
  getGitHubProfile,
  getUserRepos,
  getRepoInfo,
  getRepoCommits,
  getCommitInfo,
  getRepoReadme,
} = require("../controllers/githubDataController");

router.get("/profile", authenticate, getGitHubProfile);
router.get("/repos", authenticate, getUserRepos);
router.get("/repos/:owner/:repo", authenticate, getRepoInfo);
router.get("/repos/:owner/:repo/commits", authenticate, getRepoCommits);
router.get("/repos/:owner/:repo/commits/:sha", authenticate, getCommitInfo);
router.get("/repos/:owner/:repo/readme", authenticate, getRepoReadme);

module.exports = router;
