import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../../models/User.js";
import dotenv from "dotenv";
import sendEmail from "../../helpers/sendEmail.js";
dotenv.config();

//register
const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const missingFields = [];
    if (!userName) missingFields.push("Username");
    if (!email) missingFields.push("Email");
    if (!password) missingFields.push("Password");

    if (missingFields.length > 0) {
      const message =
        missingFields.length > 1
          ? `Please fill these fields: ${missingFields.join(", ")}`
          : `Please fill this field: ${missingFields.join("")}`;

      return res.status(400).json({
        message,
        success: false,
      });
    }

    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res.status(409).json({
        message: "Email already registered",
        success: false,
      });
    }

    if (password.length < 8) {
      return res.status(422).json({
        message: "Password must be at least 8 characters long",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.error(error.message || error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const missingFields = [];
    if (!email) missingFields.push("Email");
    if (!password) missingFields.push("Password");

    if (missingFields.length > 0) {
      const message =
        missingFields.length > 1
          ? `Please fill these fields: ${missingFields.join(", ")}`
          : `Please fill this field: ${missingFields.join("")}`;

      return res.status(400).json({ message, success: false });
    }

    const existUser = await UserModel.findOne({ email });
    if (!existUser) {
      return res.status(400).json({
        message: "Email not registered",
        success: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, existUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Wrong password",
        success: false,
      });
    }

    const token = jwt.sign(
      {
        id: existUser._id,
        role: existUser.role,
        email: existUser.email,
        userName: existUser.userName,
      },
      process.env.SECRET_KEY,
      { expiresIn: "60m" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Logged in successfully",
      success: true,
      user: {
        email: existUser.email,
        role: existUser.role,
        id: existUser._id,
        userName: existUser.userName,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message || error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//logout
const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Logout error:", error.message || error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//forget password
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please provide your email",
        success: false,
      });
    }

    const user = await UserModel.findOne({
      email,
    });
    if (!user) {
      return res.status(400).json({
        message: "Email not registered",
        success: false,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.updateOne({
      otp,
      otpExpiry,
    });

    try {
      await sendEmail(email, "Your OTP From Mucha Lucha", otp);
    } catch (emailError) {
      console.error("Email sending error:", emailError.message || emailError);
      return res.status(500).json({
        message: "Failed to send OTP email. Please try again later.",
        success: false,
      });
    }

    res.status(200).json({
      message: "Reset password link sent to your email",
      success: true,
    });
  } catch (error) {
    console.error("Forget password error:", error.message || error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//otp verification
const otpVerification = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp) {
      return res.status(400).json({
        message: "Please provide your OTP",
        success: false,
      });
    }

    const user = await UserModel.findOne({
      email,
    });

    if (!user.otpExpiry || user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
        success: false,
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
      });
    }

    await user.updateOne({ otp: null, otpExpiry: null });

    res.status(200).json({
      message: "OTP verified",
      success: true,
    });
  } catch (error) {
    console.error("OTP verification error:", error.message || error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//reset password
const resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        message: "Please fill all fields",
        success: false,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        success: false,
      });
    }

    if (password.length < 8 || confirmPassword.length < 8) {
      return res.status(422).json({
        message: "Password must be at least 8 characters long",
        success: false,
      });
    }
    const user = await UserModel.findOne({
      email,
    });

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    await user.updateOne({ password: hashedPassword });

    res.status(200).json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error) {
    console.error("Reset password error:", error.message || error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized user! No token provided.",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message || error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token.",
        success: false,
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired. Please log in again.",
        success: false,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();

    return res.status(200).json({
      message: "All users",
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error.message || error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export {
  register,
  login,
  logout,
  authMiddleware,
  getAllUsers,
  forgetPassword,
  otpVerification,
  resetPassword,
};
