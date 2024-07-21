const nodemailer = require("nodemailer");
const express = require("express");
require("dotenv").config();
const app = express();
const port = 3000;

app.use(express.static("public_html"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let users = [];

const mailOptions = {
  from: {
    name: "Noah Cross",
    address: process.env.USER,
  },
  to: null,
  subject: "Welcome",
  text: "Welcome to my website",
};

app.post("/newsletter-signup", (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send(`Email is required`);
    }
    if (users.find((user) => user.email == email)) {
      return res.status(409).send("User already signed up");
    }
    const newUser = { email, data: new Date() };
    users.push(newUser);
    sendMail(mailOptions, email);
    res.status(201).send("signed up successfully");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
  },
});

const sendMail = async (mailOptions, email) => {
  try {
    mailOptions["to"] = email;
    await transporter.sendMail(mailOptions);
    console.log("Email has been sent successfully");
  } catch (error) {
    console.error(error);
  }
};
