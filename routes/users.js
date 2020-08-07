const router = require("express").Router();
let User = require("../models/user.model");
const Emial = require("../email/config.email.js");

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const phone = req.body.phone;

  const newUser = new User({ username, email, phone });
  const newEmail = new Email(
    email,
    "Welcome To Project",
    "Thanks for becoming a member"
  );

  newUser
    .save()
    .then(() => res.json("User added!"))
    .catch((err) => res.status(400).json("Error: " + err));

  try {
    newEmail();
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
