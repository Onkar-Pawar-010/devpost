const { response } = require("express");
const {
  signupSchema,
  signinSchema,
  acceptCodeSchema,
  acceptFPCodeSchema,
  changePasswordSchema,
} = require("../middlewares/validator");
const User = require("../models/userModels");
const { doHash, doHashValidation, hmacProcess } = require("../utils/hashing");
const jwt = require("jsonwebtoken");
const transport = require("../middlewares/sendEmail");

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signupSchema.validate({ email, password });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User already exists!" });
    }

    const hashedPassword = await doHash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    const result = await newUser.save();
    result.password = undefined;
    res.status(201).json({
      success: true,
      message: "Your account has been Created Successfully",
      result,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signinSchema.validate({ email, password });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User Does not exists!" });
    }
    const result = await doHashValidation(password, existingUser.password);
    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        verified: existingUser.verified,
      },
      process.env.TOKEN_SECERT,
      {
        expiresIn: "8h", // 8 hours expiration time
      }
    );

    res
      .cookie("Authorization", "Bearer " + token, {
        expire: new Date(Date.now() + 8 * 3600000),
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        success: true,
        token,
        message: "Logged in Succesfully",
      });
  } catch (error) {}
};

exports.signout = async (req, res) => {
  res.clearCookie("Authorization").status(200).json({
    success: true,
    message: "Logged out successfully!",
  });
};

exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User Does not exists!" });
    }
    if (existingUser.verified) {
      return res
        .status(404)
        .json({ success: false, message: "You are already verified!" });
    }

    const codeValue = Math.floor(Math.random() * 1000000).toString();

    let info = await transport.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      to: existingUser.email,
      subject: "verifiction Code",
      html: "<h1>" + codeValue + "</h1>",
    });

    if (info.accepted[0] === existingUser.email) {
      console.log(process.env.HMAC_VERIFICATION_CODE_SECERT);
      const hasedCodeValue = hmacProcess(
        codeValue,
        process.env.HMAC_VERIFICATION_CODE_SECERT
      );
      existingUser.verificationCode = hasedCodeValue;
      existingUser.verificationCodeValid = Date.now(); // ✅ Fix spelling here

      await existingUser.save();
      return res.status(200).json({
        status: true,
        message: "Code sent!",
      });
    }
    res.status(200).json({
      status: true,
      message: "Code sent failed!",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.verifyVerificationCode = async (req, res) => {
  const { email, providedCode } = req.body;
  try {
    const { error, value } = acceptCodeSchema.validate({ email, providedCode });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const codeValue = providedCode.toString();
    const existingUser = await User.findOne({ email }).select(
      "+verificationCode +verificationCodeValid"
    );
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User Does not exists!" });
    }
    if (existingUser.verified) {
      return res
        .status(400)
        .json({ success: false, message: "you are already verifed!" });
    }

    console.log(
      existingUser.verificationCode,
      existingUser.verificationCodeValid
    );

    if (!existingUser.verificationCode || !existingUser.verificationCodeValid) {
      return res
        .status(400)
        .json({ success: false, message: "something is wrong with the code!" });
    }

    if (Date.now() - existingUser.verificationCodeValid > 5 * 60 * 1000) {
      return res
        .status(400)
        .json({ success: false, message: "code has been expired!" });
    }

    const hashedCodeValue = hmacProcess(
      codeValue,
      process.env.HMAC_VERIFICATION_CODE_SECERT
    );

    if (hashedCodeValue === existingUser.verificationCode) {
      existingUser.verified = true;
      existingUser.verificationCode = undefined;
      existingUser.verificationCodeValid = undefined;
      await existingUser.save();
      return res
        .status(200)
        .json({ success: true, message: "your account has been verified!" });
    }
    return res
      .status(400)
      .json({ success: false, message: "unexpected occured!!" });
  } catch (error) {
    console.log(error);
  }
};

exports.changePassword = async (req, res) => {
  const { userId, verified } = req.user;
  const { oldPassword, newPassword } = req.body;
  try {
    const { error, value } = changePasswordSchema.validate({
      oldPassword,
      newPassword,
    });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }
    if (!verified) {
      return res
        .status(401)
        .json({ success: false, message: "You are not verified user!" });
    }
    const existingUser = await User.findOne({ _id: userId }).select(
      "+password"
    );
    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User does not exists!" });
    }
    const result = await doHashValidation(oldPassword, existingUser.password);
    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials!" });
    }
    const hashedPassword = await doHash(newPassword, 12);
    existingUser.password = hashedPassword;
    await existingUser.save();
    return res
      .status(200)
      .json({ success: true, message: "Password updated!!" });
  } catch (error) {
    console.log(error);
  }
};

exports.sendForgetPasswordCode = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User Does not exists!" });
    }
    // if (existingUser.verified) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "You are already verified!" });
    // }

    const codeValue = Math.floor(Math.random() * 1000000).toString();

    let info = await transport.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      to: existingUser.email,
      subject: "Forgot Password Code",
      html: "<h1>" + codeValue + "</h1>",
    });

    if (info.accepted[0] === existingUser.email) {
      console.log(process.env.HMAC_VERIFICATION_CODE_SECERT);
      const hasedCodeValue = hmacProcess(
        codeValue,
        process.env.HMAC_VERIFICATION_CODE_SECERT
      );
      existingUser.forgotPasswordCode = hasedCodeValue;
      existingUser.forgotPasswordCodeValidation = Date.now(); // ✅ Fix spelling here

      await existingUser.save();
      return res.status(200).json({
        status: true,
        message: "Code sent!",
      });
    }
    res.status(200).json({
      status: true,
      message: "Code sent failed!",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.verifyForgotPasswordCode = async (req, res) => {
  const { email, providedCode, newPassword } = req.body;
  try {
    const { error, value } = acceptFPCodeSchema.validate({
      email,
      providedCode,
      newPassword,
    });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const codeValue = providedCode.toString();
    const existingUser = await User.findOne({ email }).select(
      "+forgotPasswordCode +forgotPasswordCodeValidation"
    );

    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User does not exists!" });
    }

    if (
      !existingUser.forgotPasswordCode ||
      !existingUser.forgotPasswordCodeValidation
    ) {
      return res
        .status(400)
        .json({ success: false, message: "something is wrong with the code!" });
    }

    if (
      Date.now() - existingUser.forgotPasswordCodeValidation >
      5 * 60 * 1000
    ) {
      return res
        .status(400)
        .json({ success: false, message: "code has been expired!" });
    }

    const hashedCodeValue = hmacProcess(
      codeValue,
      process.env.HMAC_VERIFICATION_CODE_SECERT
    );

    if (hashedCodeValue === existingUser.forgotPasswordCode) {
      const hashedPassword = await doHash(newPassword, 12);
      existingUser.password = hashedPassword;
      existingUser.forgotPasswordCode = undefined;
      existingUser.forgotPasswordCodeValidation = undefined;
      await existingUser.save();
      return res
        .status(200)
        .json({ success: true, message: "Password updated!!" });
    }
    return res
      .status(400)
      .json({ success: false, message: "unexpected occured!!" });
  } catch (error) {
    console.log(error);
  }
};
