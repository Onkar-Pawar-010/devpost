const axios = require("axios");
const User = require("../models/userModels");

// const getUserAccessToken = async (req) => {
//   const user = await User.findOne({ email: req.query.email }).select(
//     "+accessToken"
//   );
//   if (!user || !user.accessToken) throw new Error("Access token not found");
//   return user.accessToken;
// };

const getGitHubProfile = async (req, res) => {
  try {
    const accessToken = req.user.accessToken;
    console.log("🔑 GitHub Access Token:", accessToken); // log the token

    const response = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    res.json(response.data);
    console.log("✅ getGitHubProfile: Success");
  } catch (err) {
    console.log("❌ GitHub API Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
};

const getUserRepos = async (req, res) => {
  try {
    const accessToken = req.user.accessToken;
    console.log(accessToken);
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("hi");
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRepoInfo = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const accessToken = req.user.accessToken;
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get README of a repository
const getRepoReadme = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const accessToken = req.user.accessToken;

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const decoded = Buffer.from(response.data.content, "base64").toString(
      "utf-8"
    );

    res.json({ readme: decoded });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRepoCommits = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const accessToken = req.user.accessToken;
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/commits`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCommitInfo = async (req, res) => {
  try {
    const { owner, repo, sha } = req.params;
    // const accessToken = await getUserAccessToken(req);
    const accessToken = req.user.accessToken;

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getGitHubProfile,
  getUserRepos,
  getRepoInfo,
  getRepoCommits,
  getCommitInfo,
  getRepoReadme,
};
