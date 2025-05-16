const axios = require("axios");
const User = require("../models/userModels");

const redirectToGitHub = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `http://localhost:${process.env.PORT}/auth/github/login/github/callback`;

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;

  res.redirect(githubAuthUrl);
};

const handleGitHubCallback = async (req, res) => {
  const { code } = req.query;

  try {
    const tokenRes = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenRes.data.access_token;
    console.log("GitHub Access Token:", accessToken); // Log the access token

    const userRes = await axios.get(`https://api.github.com/user`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    console.log("Hi 1");

    const {
      name: fullName,
      id: githubId,
      login: username,
      avatar_url: avatarUrl,
      html_url: profileUrl,
    } = userRes.data;

    const emailsRes = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    console.log("Hi 2");

    const githubEmailObj =
      emailsRes.data.find((e) => e.primary) || emailsRes.data[0];
    const githubEmail = githubEmailObj?.email;

    console.log("Hi 3");
    // Check if user already exists
    let user = await User.findOne({ githubId });

    if (user) {
      // 🔁 Update access token and GitHub details
      user.username = username;
      user.avatarUrl = avatarUrl;
      user.profileUrl = profileUrl;
      user.accessToken = accessToken;
      user.fullName = fullName;
      await user.save();
      console.log("Updated existing user by githubId:", user);
    } else if (!user && githubEmail) {
      // 🔍 Try finding by email
      user = await User.findOne({ email: githubEmail });

      if (user) {
        user.githubId = githubId;
        user.username = username;
        user.avatarUrl = avatarUrl;
        user.profileUrl = profileUrl;
        user.accessToken = accessToken;
        user.fullName = fullName;
        await user.save();
        console.log("Updated existing user by email:", user);
      }
    }
    console.log("Hi 7");

    const jwt = require("jsonwebtoken");

    // Create JWT token for the user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("Hi 7");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    console.log("Hi 7");

    res.json({
      message: "GitHub Login Successful!",
      token,
      user,
    });
  } catch (error) {
    console.error("GitHub Auth Error:", error.message);
    res.status(500).json({ error: "GitHub Authentication Failed" });
  }
};

module.exports = {
  redirectToGitHub,
  handleGitHubCallback,
};
