const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      minlength: 3,
    },
    lastname: {
      type: String,
      required: true,
      minlength: 3,
    },
    username: {
      type: String,
      required: true,
      minlength: 5,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    phonenumber: {
      type: Number,
      required: true,
      minlength: 9,
    },
    role: {
      type: String,
      default: "basic",
      enum: ["basic", "supervisor", "admin"],
    },
    accessToken: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
