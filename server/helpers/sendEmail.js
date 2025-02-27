import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async (to, subject, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailTemplate = `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP for Password Reset</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #020917;
      color: #ffffff;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #020917;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }
    .header {
      text-align: center;
      padding: 20px 0;
    }
    .header h1 {
      font-size: 24px;
      color: #ffffff;
      margin: 0;
    }
    .content {
      padding: 20px;
      background-color: #020917;
      border-radius: 8px;
      margin-top: 20px;
      color: #ffffff;
    }
    .content h2 {
      font-size: 20px;
      color: #ffffff;
      margin: 0 0 20px 0;
    }
    .otp {
      font-size: 32px;
      font-weight: bold;
      color: #4caf50;
      text-align: center;
      margin: 20px 0;
      padding: 10px;
      background-color: #111827;
      border-radius: 4px;
      letter-spacing: 5px;
    }
    .footer {
      text-align: center;
      padding: 20px 0;
      font-size: 14px;
      color: #aaaaaa;
    }
    .footer a {
      color: #4caf50;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Your One-Time Password (OTP)</h2>
      <p>Hello,</p>
      <p>We received a request to reset your password. Please use the following OTP to proceed:</p>

      <!-- OTP Display -->
      <div class="otp">${otp}</div>

      <p>This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
      <p>If you didn't request this, please ignore this email or contact support.</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>If you have any questions, feel free to <a href="mailto:zarradiheb007@gmail.com">contact us</a>.</p>
      <p>&copy; 2023 Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>

    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: emailTemplate,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending error:", error);
  }
};

export default sendEmail;
