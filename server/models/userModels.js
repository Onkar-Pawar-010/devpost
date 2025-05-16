const { string } = require("joi");
const { verify } = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    // Common Fields
    email: {
      type: String,
      required: false, // Optional for GitHub users
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false, // Optional for GitHub users
      trim: true,
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },

    // GitHub OAuth Fields
    githubId: {
      type: Number,
      unique: true,
      sparse: true, // Allows GitHub and local users to coexist
    },
    username: String,
    avatarUrl: String,
    profileUrl: String,
    accessToken: {
      type: String,
      select: false, // Change this to true so it's saved and can be retrieved
    },

    // Email Verification Fields
    verificationCode: {
      type: String,
      select: false,
    },
    verificationCodeValid: {
      type: Number,
      select: false,
    },

    // Forgot Password Fields
    forgotPasswordCode: {
      type: String,
      select: false,
    },
    forgotPasswordCodeValidation: {
      type: Number,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
