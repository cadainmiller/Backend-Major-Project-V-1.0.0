const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const indexRouters = require("./routes/index");
const usersRouters = require("./routes/users");

require("dotenv").config();

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
