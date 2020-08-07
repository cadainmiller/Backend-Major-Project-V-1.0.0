const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const indexRouters = require("./routes/index");
const usersRouters = require("./routes/users");

require("dotenv").config();

const config = {
  mailserver: {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "yutfggtgifd7ixet@ethereal.email",
      pass: "tX29P4QNadD7kAG7x5",
    },
  },
  mail: {
    from: "foo@example.com",
    to: "cadainmiller@gmail.com",
    subject: "Hey",
    text: "Testing Nodemailer",
  },
};

const sendMail = async ({ mailserver, mail }) => {
  // create a nodemailer transporter using smtp
  let transporter = nodemailer.createTransport(mailserver);

  // send mail using transporter
  let info = await transporter.sendMail(mail);

  console.log(`Preview: ${nodemailer.getTestMessageUrl(info)}`);
};

sendMail(config).catch(console.error);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//Database Connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

//setup routesrs
app.use("/", indexRouters);
app.use("/users", usersRouters);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

console.log("Heroku");
