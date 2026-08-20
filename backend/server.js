require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(express.json());

const allowedOrigins = [
  "https://splendorous-vacherin-307623.netlify.app",
  "http://localhost:4200"
];

app.use(cors({
  origin: function (origin, callback) {

    // Allow requests without an origin
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },

  methods: ["GET", "POST", "OPTIONS"],

  allowedHeaders: [
    "Content-Type"
  ]
}));

// Handle preflight requests

let otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});


// Test route
app.get("/", (req, res) => {
  res.json({
    message: "SmartBoard backend is running"
  });
});


// SEND OTP
app.post("/send-otp", async (req, res) => {

  try {

    const email = req.body.email;

    console.log("OTP requested for:", email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    );

    otpStore[email] = otp;

    console.log("Generated OTP:", otp);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "SmartBoard Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`
    };

    await transporter.sendMail(mailOptions);

    console.log("OTP email sent successfully");

    res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {

    console.error("EMAIL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Email sending failed"
    });

  }

});


// VERIFY OTP
app.post("/verify-otp", (req, res) => {

  const { email, otp } = req.body;

  console.log(
    "Verifying OTP:",
    email,
    otp
  );

  if (
    otpStore[email] &&
    otpStore[email] == parseInt(otp)
  ) {

    delete otpStore[email];

    return res.json({
      success: true,
      message: "OTP verified successfully"
    });

  }

  res.json({
    success: false,
    message: "Invalid OTP"
  });

});


const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {

  console.log(
    `Server running on port ${PORT}`
  );

});