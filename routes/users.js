const router = require("express").Router();
let User = require("../models/user.model");
const Email = require("../email/config.email.js");

email_body = router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const phone = req.body.phone;

  const newUser = new User({ username, email, phone });
  newUser
    .save()
    .then(() => res.json("User added!"))
    .catch((err) => res.status(400).json("Error: " + err));

  Email.SendEmail(
    email,
    "WELCOME!!",
    "<p>Hey " +
      username +
      "</p><P>Welcome to TEST COMPANY.You can sign from the link below</P><p><a target='_blank' href='/localhost:3000/'>Click Me</a></p>"
  );
});

module.exports = router;
