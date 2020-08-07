const nodemailer = require("nodemailer");

require("dotenv").config();

const mailConfig = (to, subjct, body) => {
  const config = {
    mailserver: {
      host: "smtp.ethereal.email",
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    },
    mail: {
      from: process.env.EMAIL_PASSWORD,
      to: to,
      subject: subjct,
      text: body,
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
};

module.exports = mailConfig;
