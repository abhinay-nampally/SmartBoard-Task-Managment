require('dotenv').config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// CORS configuration
const corsOptions = {
  origin: "https://splendorous-vacherin-307623.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

let otpStore = {};

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send OTP
app.post("/send-otp", (req, res) => {

  const email = req.body.email;

  if (!email) {
    return res.status(400).json({
      message: "Email is required"
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[email] = otp;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "SmartBoard Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {

    if (error) {
      console.log("Email sending error:", error);

      return res.status(500).json({
        message: "Email sending failed"
      });
    }

    console.log("OTP email sent:", info.messageId);

    res.json({
      message: "OTP sent successfully"
    });

  });

});

// Verify OTP
app.post("/verify-otp", (req, res) => {

  const { email, otp } = req.body;

  if (otpStore[email] == parseInt(otp)) {

    delete otpStore[email];

    res.json({
      success: true
    });

  } else {

    res.json({
      success: false
    });

  }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});