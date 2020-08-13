// server/controllers/userController.js

const User = require("../models/user.model");
const { roles } = require("../roles");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const emailBody = "email/welcome.email.html";

const Email = require("../email/config.email.js");
const refreshTokenSecret = process.env.JWT_SECRET_REFRESH;
const refreshTokens = [];

require("dotenv").config();

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.signup = async (req, res, next) => {
  try {
    const { firstname, lastname, username, email, password, role } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      role: role || "basic",
    });
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,

      {
        expiresIn: "1d",
      }
    );

    refreshTokens.push(refreshToken);

    newUser.accessToken = accessToken;
    await newUser.save();
    res.json({
      data: newUser,
      accessToken,
    });
    Email.SendEmail(
      email,
      "Welocme to Company ",
      "<p>Hey " +
        firstname +
        "</p><p>Welcome to " +
        process.env.COMPANY_NAME +
        ".</p><p> You can use the link below to change your password from default </p><p>Username: " +
        username +
        "</p><p>Password: " +
        password +
        "</p><p> <a href='/localhost:4000/'>Change password</a></p>"
    );
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new Error("Email does not exist"));
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) return next(new Error("Password is not correct"));
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign({ userId: user._id }, refreshTokenSecret);
    refreshTokens.push(refreshToken);

    await User.findByIdAndUpdate(user._id, { accessToken });
    res.status(200).json({
      data: { email: user.email, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(302).json({
      error,
    });
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    data: users,
  });
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return next(new Error("User does not exist"));
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const update = req.body;
    const userId = req.params.userId;
    await User.findByIdAndUpdate(userId, update);
    const user = await User.findById(userId);
    res.status(200).json({
      data: user,
      message: "User has been updated",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      data: null,
      message: "User has been deleted",
    });
  } catch (error) {
    next(error);
  }
};

exports.grantAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user)
      return res.status(401).json({
        error: "You need to be logged in to access this route",
      });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
