require('dotenv').config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

let otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD
}
});

app.post("/send-otp", (req, res) => {

  const email = req.body.email;

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[email] = otp;

  const mailOptions = {
    from: "SmartBoard",
    to: email,
    subject: "SmartBoard Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {

    if (error) {
      console.log(error);
      return res.status(500).json({message:"Email sending failed"});
    }

    res.json({message:"OTP sent successfully"});

  });

});

app.post("/verify-otp", (req, res) => {

  const { email, otp } = req.body;

  if (otpStore[email] == parseInt(otp)) {
    res.json({success:true});
  } else {
    res.json({success:false});
  }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});